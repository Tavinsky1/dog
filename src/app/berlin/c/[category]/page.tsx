import { PrismaClient } from "@prisma/client";
import type { Metadata } from "next";
import PlaceCard from "@/components/PlaceCard";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";

const prisma = new PrismaClient();

const VALID = new Set([
  "cafe_restaurant_bar",
  "park_offleash_area",
  "lake_swim",
  "trail_hike",
  "pet_store_boutique",
  "vet_clinic_hospital",
  "dog_groomer",
  "dog_hotel_boarding",
  "dog_walker_trainer",
]);

const pretty = (c?: string | null) => (c ?? "").replace(/_/g, " ");

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const cat = VALID.has(params.category) ? params.category : null;
  const title = cat ? `${pretty(cat)} in Berlin • DogAtlas` : `Dog-friendly places in Berlin • DogAtlas`;
  const description = cat
    ? `Discover the best ${pretty(cat)} for dogs in Berlin: ratings, photos, and local tips.`
    : `Browse dog-friendly cafés, parks, lakes, trails, vets and more in Berlin.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const category = String(params.category);
  if (!VALID.has(category)) {
    return <div className="p-6">Unknown category</div>;
  }

  const page = Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page ?? 1);
  const limit = 24;
  const skip = (page - 1) * limit;
  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) as string | undefined;

  // Build where with optional q filter
  const where: any = { city: "Berlin", category, status: "published" };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { district: { contains: q, mode: "insensitive" } },
      { neighborhood: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.place.count({ where }),
    prisma.place.findMany({
      where,
      orderBy: [{ rating: "desc" }, { ratingCount: "desc" }, { updatedAt: "desc" }],
      skip,
      take: limit,
      include: { features: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const categoryPath = `/berlin/c/${category}`;
  const mapHref = `/berlin/map?category=${encodeURIComponent(category)}&radiusKm=5${
    q ? `&q=${encodeURIComponent(q)}` : ""
  }`;

  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(n));
    return `?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <div>
        <Link 
          href="/berlin" 
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        >
          <span>←</span>
          <span>Back to Berlin</span>
        </Link>
      </div>

      <div className="rounded-xl p-4 border bg-white">
        <h1 className="text-2xl font-bold capitalize">{pretty(category)}</h1>
        <p className="text-sm opacity-70">Best places in Berlin · {total} results</p>

        {/* Tabs */}
        <div className="mt-3 inline-flex gap-1 rounded-lg border p-1 bg-gray-50">
          <a href={categoryPath + (q ? `?q=${encodeURIComponent(q)}` : "")} className="px-3 py-1.5 text-sm rounded-md bg-white border">
            List
          </a>
          <a href={mapHref} className="px-3 py-1.5 text-sm rounded-md hover:bg-white">
            Map
          </a>
        </div>

        {/* Search */}
        <div className="mt-3">
          <SearchInput placeholder={`Search ${pretty(category)}…`} initial={q ?? ""} />
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded-xl border p-6 bg-white text-center">
          <div className="text-lg font-semibold">No matching places</div>
          <p className="text-sm opacity-70 mt-1">Try a different search term or category.</p>
          <a
            href="/submit"
            className="inline-flex mt-3 px-3 py-1.5 text-sm rounded-md bg-brand-500 text-white hover:bg-brand-600"
          >
            Suggest a place
          </a>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((p) => {
              const hasDogsIndoors = p.features?.some((f) => f.key === "dogs_allowed_indoors" && f.value === "true");
              const offLeash = p.features?.find((f) => f.key === "off_leash_allowed")?.value;

              return (
                <PlaceCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  category={pretty(p.category as any)}
                  district={p.district}
                  neighborhood={p.neighborhood}
                  badges={[
                    typeof p.rating === "number" ? `★ ${p.rating.toFixed(1)}` : "",
                    hasDogsIndoors ? "Dogs indoors" : "",
                    offLeash ? `Off-leash: ${offLeash}` : "",
                  ].filter(Boolean) as string[]}
                />
              );
            })}
          </div>

          {total > limit && (
            <div className="flex items-center gap-2 mt-3">
              <a
                href={page > 1 ? pageHref(Math.max(1, page - 1)) : undefined}
                className={
                  "px-3 py-1.5 border rounded-md" +
                  (page <= 1 ? " opacity-50 pointer-events-none" : "")
                }
                tabIndex={page <= 1 ? -1 : 0}
              >
                Prev
              </a>
              <span className="text-sm opacity-70">
                Page {page} / {totalPages}
              </span>
              <a
                href={page < totalPages ? pageHref(Math.min(totalPages, page + 1)) : undefined}
                className={
                  "px-3 py-1.5 border rounded-md" +
                  (page >= totalPages ? " opacity-50 pointer-events-none" : "")
                }
                tabIndex={page >= totalPages ? -1 : 0}
              >
                Next
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}

