import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Explore */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/countries/germany/berlin" className="hover:text-blue-600">Berlin</Link></li>
              <li><Link href="/countries/france/paris" className="hover:text-blue-600">Paris</Link></li>
              <li><Link href="/countries/spain/barcelona" className="hover:text-blue-600">Barcelona</Link></li>
              <li><Link href="/countries/italy/rome" className="hover:text-blue-600">Rome</Link></li>
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Community</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/submit" className="hover:text-blue-600">Add a Place</Link></li>
              <li><Link href="/leaderboard" className="hover:text-blue-600">Leaderboard</Link></li>
              <li><Link href="/favorites" className="hover:text-blue-600">My Favorites</Link></li>
            </ul>
          </div>
          
          {/* Shop */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              Shop <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full ml-1">Soon</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/shop" className="hover:text-blue-600">T-Shirts</Link></li>
              <li><Link href="/shop" className="hover:text-blue-600">Dog Gear</Link></li>
              <li><Link href="/shop" className="hover:text-blue-600">Accessories</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600">Privacy</Link></li>
              <li><Link href="/tos" className="hover:text-blue-600">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <span className="text-lg">🐕</span>
            <span>© {new Date().getFullYear()} Dog Atlas — Discover dog-friendly places worldwide</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Made with ❤️ for dogs and their humans</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
