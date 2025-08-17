"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
      <div className="max-w-6xl mx-auto h-16 flex items-center gap-4 px-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl2 bg-brand-500 text-white grid place-items-center shadow-soft">�</div>
          <span className="font-extrabold text-lg tracking-tight">DogAtlas</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link className="hover:text-brand-600" href="/berlin">Berlin</Link>
          <Link className="hover:text-brand-600" href="/leaderboard">Leaderboard</Link>
          {(session?.user?.role === 'ADMIN' || session?.user?.role === 'MOD') && (
            <Link className="hover:text-brand-600" href="/mod">Moderation</Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {session?.user?.role && session.user.role !== 'USER' && (
            <span className="text-xs px-2 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
              {session.user.role}
            </span>
          )}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
