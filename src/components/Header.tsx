"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { generateId, a11yProps, getAriaLabel } from '@/lib/accessibility';

type Me = { id: string; role: string; username: string } | null;

export default function Header() {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);
  const navId = generateId('main-nav');

  useEffect(() => {
    fetch("/api/me").then(r => r.ok ? r.json() : null).then(setMe).finally(()=>setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.reload();
  }

  return (
    <header className="h-14 border-b bg-white/70 backdrop-blur sticky top-0 z-30" role="banner">
      <div className="max-w-6xl mx-auto h-full px-3 flex items-center gap-3">
        <Link
          href="/"
          className="font-bold text-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label="DogAtlas - Home"
        >
          <Image
            src="/images/dogs-globe.png"
            alt=""
            width={32}
            height={32}
            className="rounded-full"
            role="presentation"
          />
          DogAtlas
        </Link>
        <nav id={navId} className="flex items-center gap-3 text-sm" role="navigation" aria-label="Main navigation">
          <Link href="/berlin" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" aria-label="Explore Berlin dog-friendly places">Berlin</Link>
          <Link href="/leaderboard" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" aria-label="View community leaderboard">Leaderboard</Link>
          <Link href="/submit" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" aria-label="Submit a new dog-friendly place">Add place</Link>
          <Link href="/mod" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" aria-label="Moderation panel">Moderation</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {!loading && me && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border">{me.role}</span>
          )}
          {!loading && me ? (
            <>
              <span className="text-sm opacity-70">{me.username}</span>
              <button
                type="button"
                onClick={logout}
                className="text-sm px-3 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Log out of your account"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-3 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Log in to your account"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm px-3 py-1 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Create a new account"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
