"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import LocationsDropdown from "./LocationsDropdown";

export default function HeaderWrapper() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur border-amber-200">
      <div className="max-w-6xl mx-auto h-16 flex items-center gap-4 px-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white grid place-items-center shadow-lg">🐕</div>
          <span className="font-extrabold text-lg tracking-tight text-gray-800">DogAtlas</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <LocationsDropdown />
          <Link className="hover:text-orange-600 transition-colors" href="/leaderboard">Leaderboard</Link>
          {(session?.user?.role === 'ADMIN' || session?.user?.role === 'MOD') && (
            <Link className="hover:text-orange-600 transition-colors" href="/mod">Moderation</Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {session?.user?.role && session.user.role !== 'USER' && (
            <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
              {session.user.role}
            </span>
          )}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="text-sm px-3 py-1.5 rounded-md border border-orange-200 hover:bg-orange-50 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-sm px-3 py-1.5 rounded-md border border-orange-200 hover:bg-orange-50 transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
