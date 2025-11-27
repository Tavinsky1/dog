"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { generateId } from '@/lib/accessibility';

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navId = generateId('main-nav');

  // Extract user info from session
  const me = session?.user ? {
    id: (session.user as any).id || "",
    role: (session.user as any).role || "USER",
    username: session.user.name || session.user.email || "User"
  } : null;

  async function logout() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <header className="h-14 border-b bg-white/70 backdrop-blur sticky top-0 z-30" role="banner">
      <div className="max-w-6xl mx-auto h-full px-3 flex items-center justify-between">
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

        {/* Desktop Navigation */}
        <nav id={navId} className="hidden md:flex items-center gap-3 text-sm" role="navigation" aria-label="Main navigation">
          <Link href="/berlin" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" aria-label="Explore Berlin dog-friendly places">Berlin</Link>
          <Link href="/leaderboard" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" aria-label="View community leaderboard">Leaderboard</Link>
          <Link href="/submit" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" aria-label="Submit a new dog-friendly place">Add place</Link>
          <Link href="/mod" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" aria-label="Moderation panel">Moderation</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen ? "true" : "false"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-2">
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-3 py-4 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm" role="navigation" aria-label="Mobile navigation">
              <Link href="/berlin" className="hover:underline px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Berlin</Link>
              <Link href="/leaderboard" className="hover:underline px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Leaderboard</Link>
              <Link href="/submit" className="hover:underline px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Add place</Link>
              <Link href="/mod" className="hover:underline px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Moderation</Link>
            </nav>
            
            <div className="border-t pt-3 flex flex-col space-y-2">
              {!loading && me && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border self-start">{me.role}</span>
              )}
              {!loading && me ? (
                <>
                  <span className="text-sm opacity-70 px-2">{me.username}</span>
                  <button
                    type="button"
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-sm px-3 py-1 rounded border self-start"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="text-sm px-3 py-1 rounded border self-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm px-3 py-1 rounded bg-black text-white self-start px-3 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
