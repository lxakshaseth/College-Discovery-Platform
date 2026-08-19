"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { GraduationCap, Scale, Bookmark, Search, User, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/components/providers/CompareContext";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { compareList } = useCompare();

  const navLinks = [
    { name: "Explore Colleges", href: "/colleges", icon: Search },
    { name: "Compare", href: "/compare", icon: Scale, badge: compareList.length },
    { name: "Rank Predictor", href: "/predictor", icon: Sparkles, highlight: true },
    { name: "Saved", href: "/saved", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-blue-600 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="tracking-tight text-gray-900 font-extrabold">
            Campus<span className="text-blue-600">Pulse</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } ${link.highlight ? "text-amber-600 font-semibold" : ""}`}
              >
                <Icon className={`h-4 w-4 ${link.highlight ? "text-amber-500" : ""}`} />
                <span>{link.name}</span>
                {link.badge ? (
                  <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-blue-600 text-white">
                    {link.badge}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Account Controls */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                Hi, {session.user.name || session.user.email?.split("@")[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="gap-1.5 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-gray-700">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
