import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 py-8 border-t bg-white/60">
      <div className="max-w-6xl mx-auto px-3 text-sm flex flex-wrap items-center justify-between gap-2">
        <div className="text-ink-300">© {new Date().getFullYear()} DogAtlas</div>
        <nav className="flex gap-4">
          <Link className="hover:text-brand-600" href="/privacy">Privacy</Link>
          <Link className="hover:text-brand-600" href="/tos">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
