import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PlaceCard from '@/components/PlaceCard';

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: {
          place: {
            include: { city: true }
          }
        },
        orderBy: { place: { name: 'asc' } }
      }
    }
  });

  if (!user) {
    return <div className="container mx-auto p-6">User not found.</div>;
  }

  const favorites = user.favorites.map(f => f.place);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Account</h1>
        <div className="text-sm text-gray-600">
          Welcome back, {user.name || user.email}!
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ❤️ Favorite Places
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              You have {favorites.length} favorite place{favorites.length !== 1 ? 's' : ''}.
            </p>
            {favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.slice(0, 5).map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
                {favorites.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    And {favorites.length - 5} more...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No favorite places yet. Start exploring cities to add some!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900">{user.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {user.role === 'admin' || user.role === 'editor' ? (
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              You have administrative privileges.
            </p>
            <div className="flex gap-4">
              <a
                href="/admin/ingest"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Upload CSV Data
              </a>
              <a
                href="/admin"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Admin Dashboard
              </a>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}