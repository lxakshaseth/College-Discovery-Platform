import Link from "next/link";
import { GraduationCap, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span>CampusPulse</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              India's premier college discovery, side-by-side comparison, and admission rank prediction platform. Helping students make confident career decisions.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Discovery Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/colleges" className="hover:text-white transition">Search Colleges</Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition">Compare Colleges</Link>
              </li>
              <li>
                <Link href="/predictor" className="hover:text-white transition">College Rank Predictor</Link>
              </li>
              <li>
                <Link href="/discussions" className="hover:text-white transition">Community Q&A Forum</Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition">Saved Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Popular Hubs</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/colleges?sortBy=ranking" className="hover:text-white transition">Top NIRF Ranked Colleges</Link>
              </li>
              <li>
                <Link href="/colleges?type=PUBLIC" className="hover:text-white transition">Government IITs & NITs</Link>
              </li>
              <li>
                <Link href="/colleges?type=PRIVATE" className="hover:text-white transition">Private & Deemed Universities</Link>
              </li>
              <li>
                <Link href="/colleges?state=Maharashtra" className="hover:text-white transition">Colleges in Maharashtra</Link>
              </li>
              <li>
                <Link href="/colleges?state=Karnataka" className="hover:text-white transition">Colleges in Karnataka</Link>
              </li>
              <li>
                <Link href="/colleges?state=Delhi" className="hover:text-white transition">Colleges in Delhi NCR</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span>Built for engineering excellence & transparency</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} CampusPulse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
