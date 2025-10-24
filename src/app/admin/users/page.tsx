import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth-utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      createdAt: true,
      emailVerified: true,
      sessions: {
        orderBy: { expires: 'desc' },
        take: 1,
        select: {
          expires: true,
          sessionToken: true,
        },
      },
      _count: {
        select: {
          reviews: true,
          favorites: true,
        },
      },
    },
  });

  const now = new Date();
  
  return users.map(user => ({
    ...user,
    isOnline: user.sessions.some(session => new Date(session.expires) > now),
    lastSession: user.sessions[0] || null,
  }));
}

export default async function UsersPage() {
  await requireRole('ADMIN');
  
  const users = await getUsers();
  const onlineUsers = users.filter(u => u.isOnline);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
          <p className="text-slate-600 mt-1">View and manage all registered users</p>
        </div>
        <Link
          href="/admin"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          ← Back to Admin
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
              🟢
            </div>
            <div>
              <p className="text-sm text-slate-600">Online Now</p>
              <p className="text-2xl font-bold text-green-600">{onlineUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl">
              👑
            </div>
            <div>
              <p className="text-sm text-slate-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div>
              <p className="text-sm text-slate-600">Moderators</p>
              <p className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.role === 'MOD').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Online Users Section */}
      {onlineUsers.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
            <span className="animate-pulse">🟢</span>
            Currently Online ({onlineUsers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg p-3 border border-green-300">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img src={user.image} alt={user.name || ''} className="h-10 w-10 rounded-full" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {(user.name?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                  <span className="text-green-500 text-xl animate-pulse">●</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Activity</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  {/* Status */}
                  <td className="px-6 py-4">
                    {user.isOnline ? (
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-green-700">Online</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-slate-300"></span>
                        <span className="text-xs font-medium text-slate-500">Offline</span>
                      </div>
                    )}
                  </td>

                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || ''}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {(user.name?.[0] || user.email?.[0] || '?').toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.name || 'No name'}
                        </p>
                        <p className="text-xs text-slate-500">ID: {user.id.slice(0, 12)}...</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-700">{user.email || 'No email'}</p>
                      {user.emailVerified && (
                        <span className="text-green-600 text-xs" title="Email verified">✓</span>
                      )}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'MOD'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'ADMIN' && '👑 '}
                      {user.role === 'MOD' && '⭐ '}
                      {user.role}
                    </span>
                  </td>

                  {/* Activity */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      <div>{user._count.reviews} reviews</div>
                      <div className="text-xs text-slate-500">{user._count.favorites} favorites</div>
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleTimeString()}
                    </div>
                  </td>

                  {/* Session Info */}
                  <td className="px-6 py-4">
                    {user.lastSession ? (
                      <div className="text-sm">
                        {user.isOnline ? (
                          <div className="text-green-600 font-medium">Active</div>
                        ) : (
                          <div className="text-slate-500">Expired</div>
                        )}
                        <div className="text-xs text-slate-500">
                          Expires: {new Date(user.lastSession.expires).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">No session</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No users yet</h3>
          <p className="text-slate-600">Users will appear here once they sign up.</p>
        </div>
      )}
    </div>
  );
}
