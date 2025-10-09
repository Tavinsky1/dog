import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  await requireAdmin(); // Protect this route

  // Fetch statistics
  const [
    totalUsers,
    totalPlaces,
    totalCities,
    totalReviews,
    totalFavorites,
    recentUsers,
    recentReviews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.place.count(),
    prisma.city.count(),
    prisma.review.count(),
    prisma.favorite.count(),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    }),
    prisma.review.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        place: {
          select: { name: true, slug: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your DogAtlas platform</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          ← Back to Site
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon="👥"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Places"
          value={totalPlaces}
          icon="📍"
          color="bg-green-500"
        />
        <StatCard
          title="Total Cities"
          value={totalCities}
          icon="🌍"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Reviews"
          value={totalReviews}
          icon="⭐"
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Favorites"
          value={totalFavorites}
          icon="❤️"
          color="bg-red-500"
        />
      </div>

      {/* Analytics Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">📊</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analytics & Traffic
            </h3>
            <p className="text-gray-700 mb-4">
              Your Vercel Analytics are enabled! View detailed traffic analytics in your Vercel dashboard:
            </p>
            <a
              href="https://vercel.com/tavinskys-projects/dog-atlas/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Open Vercel Analytics
              <span>→</span>
            </a>
            <p className="text-sm text-gray-600 mt-4">
              Track page views, visitor sources, device types, top pages, and more in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Users
          </h2>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {user.role}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user._count.reviews} reviews
                  </div>
                  <div className="text-xs text-gray-500">
                    {user._count.favorites} favorites
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Reviews
          </h2>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-900">
                    {review.user?.name || "Anonymous"}
                  </div>
                  <div className="text-yellow-500">
                    {"⭐".repeat(review.rating)}
                  </div>
                </div>
                <Link
                  href={`/${review.place.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {review.place.name}
                </Link>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {review.body || "No comment"}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔒</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Security Status
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                NextAuth.js authentication enabled
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Role-based access control (RBAC) active
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Admin routes protected
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">⚠</span>
                Rate limiting: Configure in next steps
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">⚠</span>
                Security headers: Configure in next steps
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
