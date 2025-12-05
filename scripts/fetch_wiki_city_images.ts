// Fetch REAL city images from Wikipedia API

interface WikiImageResponse {
  query?: {
    pages?: Record<string, {
      original?: { source: string };
      thumbnail?: { source: string };
    }>;
  };
}

const cities: Record<string, string> = {
  'london': 'London',
  'paris': 'Paris',
  'berlin': 'Berlin',
  'rome': 'Rome',
  'barcelona': 'Barcelona',
  'madrid': 'Madrid',
  'lisbon': 'Lisbon',
  'dublin': 'Dublin',
  'munich': 'Munich',
  'vienna': 'Vienna',
  'prague': 'Prague',
  'copenhagen': 'Copenhagen',
  'amsterdam': 'Amsterdam',
  'milan': 'Milan',
  'zurich': 'Zürich',
  'new-york': 'New_York_City',
  'los-angeles': 'Los_Angeles',
  'vancouver': 'Vancouver',
  'buenos-aires': 'Buenos_Aires',
  'cordoba': 'Córdoba,_Spain',
  'tokyo': 'Tokyo',
  'sydney': 'Sydney',
  'melbourne': 'Melbourne'
};

async function getWikiPageImage(article: string): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(article)}&prop=pageimages&format=json&pithumbsize=1280`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DogAtlas/1.0 (dog-atlas.com; contact@dog-atlas.com)'
      }
    });
    const data = await response.json() as WikiImageResponse;
    
    if (data.query?.pages) {
      const page = Object.values(data.query.pages)[0];
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }
    return null;
  } catch (e) {
    console.error(`Error fetching ${article}:`, e);
    return null;
  }
}

async function verifyUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'DogAtlas/1.0 (dog-atlas.com; contact@dog-atlas.com)'
      }
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('Fetching city images from Wikipedia API...\n');
  
  const results: Record<string, string> = {};
  
  for (const [slug, article] of Object.entries(cities)) {
    const imageUrl = await getWikiPageImage(article);
    if (imageUrl) {
      const verified = await verifyUrl(imageUrl);
      if (verified) {
        console.log(`✓ ${slug}: ${imageUrl.substring(0, 80)}...`);
        results[slug] = imageUrl;
      } else {
        console.log(`❌ ${slug}: Got URL but failed verification`);
      }
    } else {
      console.log(`❌ ${slug}: No image found`);
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('\n--- VERIFIED CITY IMAGES ---\n');
  console.log('const VERIFIED_CITY_IMAGES: Record<string, string> = {');
  for (const [slug, url] of Object.entries(results)) {
    console.log(`  '${slug}': '${url}',`);
  }
  console.log('};');
  
  console.log(`\n✓ Found ${Object.keys(results).length}/${Object.keys(cities).length} city images`);
}

main();
