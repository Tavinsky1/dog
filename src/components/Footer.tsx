import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} DogAtlas. Built for dog people.</div>
        <nav className="flex gap-4">
          <Link className="transition-colors hover:text-blue-600" href="/contact">
            Contact
          </Link>
          <Link className="transition-colors hover:text-blue-600" href="/privacy">
            Privacy
          </Link>
          <Link className="transition-colors hover:text-blue-600" href="/tos">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
