import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span>🐾</span>
          <span>CodexPet</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/category" className="text-gray-600 hover:text-gray-900">
            Categories
          </Link>
          <Link href="/submit" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Submit Pet
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold">
              <span>🐾</span> CodexPet
            </div>
            <p className="mt-2 text-sm text-gray-500">
              The ultimate directory for desktop pets. Find, compare, and
              download the best companions for your screen.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/category/ai-tool" className="hover:text-gray-900">AI Tool Pets</Link></li>
              <li><Link href="/category/indie" className="hover:text-gray-900">Indie Pets</Link></li>
              <li><Link href="/category/classic" className="hover:text-gray-900">Classic Pets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="https://github.com/kxcsgit/codexpet" className="hover:text-gray-900">GitHub</a></li>
              <li><a href="https://twitter.com" className="hover:text-gray-900">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CodexPet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
