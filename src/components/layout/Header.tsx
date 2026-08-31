"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { GraduationCap, Scale, Bookmark, Search, User, LogOut, Sparkles, Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/components/providers/CompareContext";
import { Badge } from "@/components/ui/badge";
import { CommandPalette } from "./CommandPalette";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { compareList } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const navLinks = [
    { name: "Explore Colleges", href: "/colleges", icon: Search },
    { name: "Compare", href: "/compare", icon: Scale, badge: compareList.length },
    { name: "Rank Predictor", href: "/predictor", icon: Sparkles, highlight: true },
    { name: "Community Q&A", href: "/discussions", icon: MessageSquare },
    { name: "Saved", href: "/saved", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-blue-600 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="tracking-tight text-slate-900 font-extrabold">
            Campus<span className="text-blue-600">Pulse</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
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
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

        {/* Desktop Auth / Account Controls & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Shortcut Trigger */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition text-xs"
            title="Search (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-300 rounded shadow-xs text-slate-500">
              ⌘K
            </kbd>
          </button>

          {session?.user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-block text-sm font-medium text-slate-700">
                Hi, {session.user.name || session.user.email?.split("@")[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-slate-700">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${link.highlight ? "text-amber-500" : "text-slate-500"}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge ? (
                    <Badge variant="default" className="h-5 px-1.5 text-xs bg-blue-600 text-white">
                      {link.badge}
                    </Badge>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Quick Search in Mobile Dropdown */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setPaletteOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Search colleges, predictors...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-300 rounded text-slate-500">
              ⌘K
            </kbd>
          </button>

          {session?.user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 px-1 text-xs text-slate-600 font-medium">
                <User className="h-4 w-4 text-blue-600" />
                <span>Signed in as <strong className="text-slate-900">{session.user.name || session.user.email}</strong></span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="w-full gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout Account</span>
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button variant="outline" size="sm" className="w-full font-medium text-slate-700">
                  Log in
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

