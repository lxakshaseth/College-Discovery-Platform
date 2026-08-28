"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Scale, GraduationCap, ArrowRight, X, Bookmark, MessageSquare } from "lucide-react";
import { CollegeListItem } from "@/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CollegeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle Ctrl+K / Cmd+K global hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const json = await res.json();
          setResults(json.data || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search colleges, tools, or shortcuts... (Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery("")} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
              ESC
            </span>
          )}
        </div>

        {/* Results / Navigation Body */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {query.trim() ? (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Colleges & Universities ({results.length})
              </div>

              {loading ? (
                <div className="p-6 text-center text-xs text-slate-400">Searching institutes...</div>
              ) : results.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No colleges found for "{query}". Try searching by state or initials.
                </div>
              ) : (
                results.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigateTo(`/colleges/${c.slug}`)}
                    className="w-full p-2.5 rounded-xl text-left hover:bg-blue-50 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                        {c.ranking ? `#${c.ranking}` : "🎓"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {c.location}, {c.state} • {c.type} • {c.rating}★
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition" />
                  </button>
                ))
              )}
            </div>
          ) : (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Navigation & Tools
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => navigateTo("/predictor")}
                  className="w-full p-2.5 rounded-xl text-left hover:bg-amber-50 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-amber-700">
                        Rank & Admission Predictor
                      </div>
                      <div className="text-xs text-slate-500">Calculate cutoff probability across 50+ institutes</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-600" />
                </button>

                <button
                  onClick={() => navigateTo("/compare")}
                  className="w-full p-2.5 rounded-xl text-left hover:bg-blue-50 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                      <Scale className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                        College Comparison Matrix
                      </div>
                      <div className="text-xs text-slate-500">Compare fees, salary CTC & NIRF ranks side-by-side</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                </button>

                <button
                  onClick={() => navigateTo("/discussions")}
                  className="w-full p-2.5 rounded-xl text-left hover:bg-purple-50 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                        Community Q&A Forum
                      </div>
                      <div className="text-xs text-slate-500">Ask seniors about cutoffs, campus life & hostels</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600" />
                </button>

                <button
                  onClick={() => navigateTo("/saved")}
                  className="w-full p-2.5 rounded-xl text-left hover:bg-slate-100 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Saved Wishlist & Comparisons</div>
                      <div className="text-xs text-slate-500">View your bookmarked colleges and saved sessions</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
