// scripts/import_photos_from_web.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fetch, { Response } from 'node-fetch';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import URLParse from 'url-parse';
import sharp from 'sharp';

const prisma = new PrismaClient();
const limit = pLimit(5); // parallelism, be nice

const FAKE_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

type Candidate = {
  url: string;
  priority: number; // lower is better
  source: 'website' | 'instagram' | 'facebook';
  attribution: string;
};

const MIN_WIDTH = 500;
const MIN_HEIGHT = 300;

async function headOrGet(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // some servers block HEAD; try HEAD then GET (range)
    try {
      const r = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': FAKE_USER_AGENT }
      });
      if (r.ok && r.headers.get('content-type')?.startsWith('image/')) return r;
    } catch (e) {
      // console.log(`HEAD failed for ${url}: ${e}`);
    }
    // try GET with small range to let sharp probe
    return await fetch(url, {
      method: 'GET',
      headers: {
        Range: 'bytes=0-65535',
        'User-Agent': FAKE_USER_AGENT
      },
      redirect: 'follow',
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      console.error(`Timeout fetching ${url}`);
    } else {
      console.error(`GET failed for ${url}:`, e);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function absolutize(src: string, base: string): string | null {
  if (!src) return null;
  try {
    const u = new URLParse(src, base);
    return u.toString();
  } catch (e) {
    return null;
  }
}

function unique<T>(arr: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = key(x);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(x);
    }
  }
  return out;
}

async function probeImage(url: string): Promise<{ ok: boolean; width?: number; height?: number; contentType?: string }> {
  try {
    const res = await headOrGet(url);
    if (!res || !res.ok) return { ok: false };
    const ct = res.headers.get('content-type') || '';
    if (!ct.startsWith('image/')) return { ok: false };
    
    // Try to read minimal bytes to detect size (sharp can probe from buffer)
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();
    if ((meta.width ?? 0) < MIN_WIDTH || (meta.height ?? 0) < MIN_HEIGHT) {
      return { ok: false, width: meta.width, height: meta.height, contentType: ct };
    }
    return { ok: true, width: meta.width, height: meta.height, contentType: ct };
  } catch (e) {
    console.log(`Probe failed for ${url}: ${e}`);
    return { ok: false };
  }
}

function extractFromHtml(html: string, baseUrl: string, placeName: string): Candidate[] {
  const $ = cheerio.load(html);

  const metas: string[] = [];
  
  // OpenGraph and Twitter Card metas
  const metaSelectors = [
    'meta[property="og:image"]',
    'meta[name="og:image"]',
    'meta[name="twitter:image"]',
    'meta[property="twitter:image"]',
    'link[rel="image_src"]',
  ];
  
  metaSelectors.forEach(selector => {
    const content = $(selector).attr('content') || $(selector).attr('href');
    if (content) metas.push(content);
  });

  // schema.org JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text());
      const images: string[] =
        Array.isArray(data)
          ? data.flatMap((d) => (d?.image ? (Array.isArray(d.image) ? d.image : [d.image]) : []))
          : data?.image
            ? (Array.isArray(data.image) ? data.image : [data.image])
            : [];
      images.forEach((x) => metas.push(x));
    } catch (e) {
      // Ignore JSON parse errors
    }
  });

  // Largest <img> heuristic (collect src + data-src/srcset first candidate)
  const imgs: string[] = [];
  $('img').each((_, img) => {
    const src =
      $(img).attr('src') ||
      $(img).attr('data-src') ||
      ($(img).attr('srcset')?.split(' ')?.[0] ?? '');
    if (src) imgs.push(src);
  });

  const candidates: Candidate[] = [];

  unique(metas, (x) => x)
    .map((u) => absolutize(u, baseUrl))
    .filter(Boolean)
    .forEach((u) => {
      candidates.push({
        url: u!,
        priority: 1, // OG/Schema are top
        source: 'website',
        attribution: `© ${placeName} – ${new URL(baseUrl).origin}`,
      });
    });

  unique(imgs, (x) => x)
    .map((u) => absolutize(u, baseUrl))
    .filter(Boolean)
    .forEach((u) => {
      candidates.push({
        url: u!,
        priority: 2, // fallback to largest <img>
        source: 'website',
        attribution: `© ${placeName} – ${new URL(baseUrl).origin}`,
      });
    });

  return candidates;
}

async function fetchHtml(url:string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': FAKE_USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!response.ok) {
      console.error(`[${response.status}] Failed to fetch HTML from ${url}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Timeout fetching HTML from ${url}`);
    } else {
        console.error(`Failed to fetch HTML from ${url}:`, error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function extractBestFromWebsite(place: any): Promise<Candidate[]> {
  if (!place.websiteUrl) return [];
  const html = await fetchHtml(place.websiteUrl);
  if (!html) return [];
  const candidates = extractFromHtml(html, place.websiteUrl, place.name);
  return candidates;
}

async function extractFromInstagram(place: any): Promise<Candidate[]> {
  if (!place.instagramUrl) return [];
  const html = await fetchHtml(place.instagramUrl);
  if (!html) return [];
  const candidates = extractFromHtml(html, place.instagramUrl, place.name)
    .map((c) => ({ ...c, source: 'instagram' as const, priority: c.priority + 3 }));
  return candidates;
}

async function extractFromFacebook(place: any): Promise<Candidate[]> {
  if (!place.facebookUrl) return [];
  const html = await fetchHtml(place.facebookUrl);
  if (!html) return [];
  const candidates = extractFromHtml(html, place.facebookUrl, place.name)
    .map((c) => ({ ...c, source: 'facebook' as const, priority: c.priority + 4 }));
  return candidates;
}

async function pickBest(candidates: Candidate[]): Promise<{ chosen?: Candidate; width?: number; height?: number; contentType?: string }> {
  // de-dup by URL
  const uniqueC = unique(candidates, (x) => x.url);
  // sort by priority
  uniqueC.sort((a, b) => a.priority - b.priority);
  for (const c of uniqueC) {
    const probe = await probeImage(c.url);
    if (probe.ok) {
      return { chosen: c, width: probe.width, height: probe.height, contentType: probe.contentType };
    }
  }
  return {};
}

async function hasAnyPhoto(placeId: string) {
  const count = await prisma.placePhoto.count({ where: { placeId } });
  return count > 0;
}

async function processPlace(place: any, dryRun = false) {
  if (await hasAnyPhoto(place.id)) return { skipped: true, reason: 'already-has-photo' };

  const allCandidates: Candidate[] = [];
  allCandidates.push(...await extractBestFromWebsite(place));
  // Try social media if no website image found
  if (allCandidates.length === 0 && place.instagramUrl) {
    allCandidates.push(...await extractFromInstagram(place));
  }
  if (allCandidates.length === 0 && place.facebookUrl) {
    allCandidates.push(...await extractFromFacebook(place));
  }

  if (allCandidates.length === 0) {
    return { skipped: true, reason: 'no-candidates' };
  }

  const { chosen, width, height, contentType } = await pickBest(allCandidates);
  if (!chosen) return { skipped: true, reason: 'none-validated' };

  if (dryRun) {
    return { ok: true, dryRun: true, chosen };
  }

  await prisma.placePhoto.create({
    data: {
      placeId: place.id,
      url: chosen.url,
      source: chosen.source,
      attribution: chosen.attribution,
      width: width ?? undefined,
      height: height ?? undefined,
      contentType: contentType ?? undefined,
      status: 'approved',
    },
  });

  // Set as primary photo if not set
  if (!place.primaryPhotoId) {
    const photo = await prisma.placePhoto.findFirst({
      where: { placeId: place.id },
      orderBy: { createdAt: 'desc' },
    });
    if (photo) {
      await prisma.place.update({
        where: { id: place.id },
        data: { primaryPhotoId: photo.id },
      });
    }
  }

  return { ok: true, url: chosen.url, source: chosen.source };
}

async function main() {
  const dryRun = process.argv.includes('--dry');
  const onlyCityArgIdx = process.argv.indexOf('--city');
  const onlyCity = onlyCityArgIdx > -1 ? process.argv[onlyCityArgIdx + 1] : null;
  const limitArgIdx = process.argv.indexOf('--limit');
  const limitNum = limitArgIdx > -1 ? parseInt(process.argv[limitArgIdx + 1], 10) : undefined;


  const places = await prisma.place.findMany({
    where: onlyCity ? {
      city: {
        slug: onlyCity
      }
    } : undefined,
    select: {
      id: true,
      name: true,
      websiteUrl: true,
      instagramUrl: true,
      facebookUrl: true,
      city: {
        select: {
          name: true,
          slug: true,
        }
      },
      primaryPhotoId: true
    },
    orderBy: { name: 'asc' },
    take: limitNum,
  });

  console.log(`Found ${places.length} places${onlyCity ? ` in ${onlyCity}` : ''}. Starting import${dryRun ? ' (dry run)' : ''}…`);

  let ok = 0, skipped = 0, failed = 0;
  await Promise.all(
    places.map((p) => limit(async () => {
      try {
        const res = await processPlace(p, dryRun);
        if ((res as any).ok) {
          ok++;
          console.log(`✅ [${p.city.name}] ${p.name} → ${(res as any).url || (res as any).chosen?.url}`);
        } else {
          skipped++;
          console.log(`⏭️  [${p.city.name}] ${p.name} – skipped: ${(res as any).reason}`);
        }
      } catch (e: any) {
        failed++;
        console.log(`❌ [${p.city.name}] ${p.name} – error: ${e?.message || e}`);
      }
    }))
  );

  console.log(`\nDone. ok=${ok}, skipped=${skipped}, failed=${failed}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
