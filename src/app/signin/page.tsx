import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form method="post" action="/api/auth/signin/email">
        <label className="block mb-2">
          Email address
          <input
            type="email"
            name="email"
            required
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send magic link
        </button>
      </form>
    </div>
  );
}
