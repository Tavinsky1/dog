import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import PlaceCard from "@/components/PlaceCard";

interface FavoriteWithPlace {
  id: string;
  place: {
    id: string;
    name: string;
    type: string;
    slug: string;
    shortDescription: string | null;
    imageUrl: string | null;
    dogFriendlyLevel: number | null;
    rating: number | null;
    city: {
      name: string;
      slug: string;
    };
  };
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any)?.id) {
    redirect("/login");
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      place: {
        include: {
          city: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      place: {
        name: "asc",
      },
    },
  }) as FavoriteWithPlace[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">My Favorites</h1>
          <p className="mt-2 text-slate-600">
            Your saved dog-friendly places ({favorites.length})
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-slate-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No favorites yet</h3>
          <p className="mt-2 text-slate-600">
            Start exploring and save places you love for easy access later.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-blue-200 px-6 py-2 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              Explore Places
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <PlaceCard
              key={favorite.id}
              place={{
                ...favorite.place,
                city: favorite.place.city,
              }}
              showFavoriteButton={true}
              isFavorited={true}
            />
          ))}
        </div>
      )}

      {/* Favorites by City */}
      {favorites.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-slate-900">By City</h2>

          {Object.entries(
            favorites.reduce((acc: Record<string, FavoriteWithPlace[]>, favorite: FavoriteWithPlace) => {
              const cityName = favorite.place.city.name;
              if (!acc[cityName]) {
                acc[cityName] = [];
              }
              acc[cityName].push(favorite);
              return acc;
            }, {} as Record<string, FavoriteWithPlace[]>)
          ).map(([cityName, cityFavorites]: [string, FavoriteWithPlace[]]) => (
            <div key={cityName} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{cityName}</h3>
                <Link
                  href={`/${cityFavorites[0].place.city.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View all in {cityName}
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cityFavorites.map((favorite) => (
                  <PlaceCard
                    key={favorite.id}
                    place={{
                      ...favorite.place,
                      city: favorite.place.city,
                    }}
                    showFavoriteButton={true}
                    isFavorited={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
