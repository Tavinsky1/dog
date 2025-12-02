"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import GlobalSearch from "./GlobalSearch";

type City = {
  id: string;
  slug: string;
  name: string;
  country: string;
};

function deriveSelectedCity(pathname: string, cities: City[]): string {
  const match = cities.find(city => pathname === `/${city.slug}` || pathname.startsWith(`/${city.slug}/`));
  return match ? match.slug : "home";
}

export default function HeaderWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [cities, setCities] = useState<City[]>([]);
  const [selected, setSelected] = useState("home");
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Derived values
  const userRole = session?.user?.role;
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isLoading = status === "loading";

  // Simple sign out handler - use window.location for hard reload
  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    
    try {
      // Sign out without redirect, then hard reload to clear all state
      await signOut({ redirect: false });
      // Hard reload clears all client state and forces cookie check
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  }, [isSigningOut]);

  // Simple sign in handler
  const handleSignIn = useCallback(() => {
    signIn(undefined, { callbackUrl: pathname || "/" });
  }, [pathname]);

  // Fetch cities
  useEffect(() => {
    let isMounted = true;
    
    fetch("/api/cities")
      .then(res => res.ok ? res.json() : [])
      .then((data: City[]) => {
        if (isMounted) {
          setCities(data);
          setIsLoadingCities(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCities([]);
          setIsLoadingCities(false);
        }
      });
    
    return () => { isMounted = false; };
  }, []);

  // Update selected city based on pathname
  useEffect(() => {
    if (pathname) {
      setSelected(deriveSelectedCity(pathname, cities));
    }
  }, [pathname, cities]);

  const handleCityChange = useCallback((value: string) => {
    setSelected(value);
    router.push(value === "home" ? "/" : `/${value}`);
  }, [router]);

  // City selector
  const cityOptions = useMemo(() => {
    if (cities.length === 0) {
      return (
        <Link
          href="/submit"
          className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:border-blue-200 hover:text-blue-700"
        >
          Add your city
        </Link>
      );
    }

    return (
      <select
        aria-label="Choose a city"
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selected}
        onChange={(e) => handleCityChange(e.target.value)}
      >
        <option value="home">Choose a city</option>
        {cities.map((city) => (
          <option key={city.id} value={city.slug}>
            {city.name}, {city.country}
          </option>
        ))}
      </select>
    );
  }, [cities, selected, handleCityChange]);

  // Auth section - loading state
  const renderAuthSection = () => {
    if (isLoading) {
      return <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />;
    }

    if (isAuthenticated && session.user) {
      return (
        <div className="flex items-center gap-3">
          <Link
            href="/favorites"
            className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <span>❤️</span>
            <span>Favorites</span>
          </Link>
          
          {userRole === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="hidden sm:flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
            >
              <span>👑</span>
              <span>Admin</span>
            </Link>
          )}
          
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-6 w-6 rounded-full"
              />
            )}
            <span className="text-sm font-medium text-slate-700">
              {session.user.name || session.user.email?.split('@')[0]}
            </span>
          </div>
          
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleSignIn}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 shadow-sm hover:shadow-md"
      >
        Sign in
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-blue-700">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white shadow-sm">🐕</span>
          DogAtlas
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-slate-600 md:flex">
          <Link className="transition-colors hover:text-blue-600" href="/leaderboard">
            Leaderboard
          </Link>
          <Link className="transition-colors hover:text-blue-600" href="/shop">
            <span className="flex items-center gap-1">
              Shop
              <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">Soon</span>
            </span>
          </Link>
          <Link className="transition-colors hover:text-blue-600" href="/contact">
            Contact
          </Link>
          {(userRole === "ADMIN" || userRole === "EDITOR") && (
            <Link className="transition-colors hover:text-blue-600" href="/mod">
              Moderation
            </Link>
          )}
        </nav>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <GlobalSearch />
        </div>

        <div className="ml-auto md:ml-0 flex items-center gap-3">
          {isLoadingCities ? (
            <div className="h-9 w-40 animate-pulse rounded-full bg-slate-100" />
          ) : (
            cityOptions
          )}

          {userRole && userRole !== "USER" && (
            <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {userRole}
            </span>
          )}

          {renderAuthSection()}
        </div>
      </div>
    </header>
  );
}
