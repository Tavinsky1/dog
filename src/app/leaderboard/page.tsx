import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    orderBy: { points: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, points: true }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Top Collaborators</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">#</th>
            <th className="text-left p-2">User</th>
            <th className="text-left p-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{i+1}</td>
              <td className="p-2">{u.name ?? u.email}</td>
              <td className="p-2">{u.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
