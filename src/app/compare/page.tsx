"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Scale, Plus, Bookmark, RefreshCw, Trash2, ArrowLeft, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompareTable } from "@/components/college/CompareTable";
import { CompareCollege, CollegeListItem } from "@/types";
import { useCompare } from "@/components/providers/CompareContext";
import { safeJsonParse } from "@/lib/utils";
import Link from "next/link";

const POPULAR_MATCHUPS = [
  { title: "IIT Bombay vs IIT Delhi", query1: "IIT Bombay", query2: "IIT Delhi", desc: "Top 2 NIRF Premier Engineering Institutes" },
  { title: "IIT Madras vs IIT Kharagpur", query1: "IIT Madras", query2: "IIT Kharagpur", desc: "NIRF #1 vs Oldest Legacy IIT" },
  { title: "BITS Pilani vs NIT Trichy", query1: "BITS Pilani", query2: "NIT Trichy", desc: "Premier Private vs Top Tier NIT" },
  { title: "DTU Delhi vs NSUT Delhi", query1: "Delhi Technological", query2: "Netaji Subhas", desc: "Delhi Premier State Engineering Giants" },
];

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const [colleges, setColleges] = useState<CompareCollege[]>([]);
  const [loading, setLoading] = useState(true);

  // Search selector for adding a college dynamically
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CollegeListItem[]>([]);
  const [searching, setSearching] = useState(false);

  // Save comparison state
  const [savingComp, setSavingComp] = useState(false);

  const idsFromUrl = searchParams.get("ids");

  useEffect(() => {
    async function fetchCompareData() {
      // Determine college IDs to load (either from URL params or local Context state)
      const idsToFetch = idsFromUrl
        ? idsFromUrl.split(",").filter(Boolean)
        : compareList.map((c) => c.id);

      if (idsToFetch.length === 0) {
        setColleges([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/colleges/compare?ids=${idsToFetch.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setColleges(data);
        }
      } catch (err) {
        console.error("Failed to load comparison data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompareData();
  }, [idsFromUrl, compareList]);

  // Live search colleges to add to comparison
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/colleges?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) {
          const json = await res.json();
          setSearchResults(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddCollege = (c: CollegeListItem) => {
    if (colleges.length >= 3) {
      alert("Maximum 3 colleges allowed for comparison.");
      return;
    }

    if (colleges.some((item) => item.id === c.id)) {
      setSearchQuery("");
      setSearchResults([]);
      return;
    }

    const updatedIds = [...colleges.map((item) => item.id), c.id];
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/compare?ids=${updatedIds.join(",")}`);
  };

  const handleRemoveCollege = (id: string) => {
    removeFromCompare(id);
    const remaining = colleges.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      router.push("/compare");
    } else {
      router.push(`/compare?ids=${remaining.map((c) => c.id).join(",")}`);
    }
  };

  const handleSaveComparison = async () => {
    if (!session?.user) {
      alert("Please log in to save comparisons to your account.");
      return;
    }

    if (colleges.length < 2) {
      alert("Please select at least 2 colleges to save a comparison.");
      return;
    }

    setSavingComp(true);
    try {
      const name = `${colleges.map((c) => c.name.split(" ")[0]).join(" vs ")} Comparison`;
      const res = await fetch("/api/saved/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          collegeIds: colleges.map((c) => c.id),
        }),
      });

      if (res.ok) {
        alert("Comparison saved to your profile!");
      } else {
        alert("Failed to save comparison.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingComp(false);
    }
  };

  const handleExportCSV = () => {
    if (colleges.length === 0) return;
    const headers = [
      "Metric",
      ...colleges.map((c) => `"${c.name.replace(/"/g, '""')}"`),
    ];

    const rows = [
      ["Location", ...colleges.map((c) => `"${c.location}, ${c.state}"`)],
      ["Type", ...colleges.map((c) => `"${c.type}"`)],
      ["Established", ...colleges.map((c) => `"${c.establishedYear || "N/A"}"`)],
      ["NIRF Ranking", ...colleges.map((c) => `"${c.ranking ? `#${c.ranking}` : "Unranked"}"`)],
      ["Student Rating", ...colleges.map((c) => `"${c.rating} / 5"`)],
      ["Min Tuition Fees (Annual)", ...colleges.map((c) => `"₹${c.minFees.toLocaleString("en-IN")}"`)],
      ["Avg CTC Package", ...colleges.map((c) => `"${c.placements[0]?.averagePackage ? `₹${c.placements[0].averagePackage} LPA` : "N/A"}"`)],
      ["Highest CTC Package", ...colleges.map((c) => `"${c.placements[0]?.highestPackage ? `₹${c.placements[0].highestPackage} LPA` : "N/A"}"`)],
      ["Placement Rate", ...colleges.map((c) => `"${c.placements[0]?.placementRate ? `${c.placements[0].placementRate}%` : "N/A"}"`)],
      ["Approvals", ...colleges.map((c) => `"${safeJsonParse<string[]>(c.approvals, []).join(", ")}"`)],
      ["Official Website", ...colleges.map((c) => `"${c.website || "N/A"}"`)],
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `college-comparison-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadPreset = async (q1: string, q2: string) => {
    setLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/colleges?q=${encodeURIComponent(q1)}&limit=1`),
        fetch(`/api/colleges?q=${encodeURIComponent(q2)}&limit=1`),
      ]);
      const json1 = await res1.json();
      const json2 = await res2.json();
      const c1 = json1.data?.[0];
      const c2 = json2.data?.[0];
      if (c1 && c2) {
        router.push(`/compare?ids=${c1.id},${c2.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/colleges" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Scale className="h-7 w-7 text-blue-600" />
              Side-by-Side College Comparison
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Compare annual tuition fees, NIRF rank, average salary CTC, and top recruiters across 2-3 colleges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {colleges.length >= 2 && (
            <>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                Export CSV
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                Print
              </Button>
            </>
          )}

          {session?.user && colleges.length >= 2 ? (
            <Button
              onClick={handleSaveComparison}
              disabled={savingComp}
              variant="outline"
              size="sm"
              className="gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Bookmark className="h-4 w-4" />
              {savingComp ? "Saving..." : "Save Comparison"}
            </Button>
          ) : null}

          {colleges.length > 0 ? (
            <Button
              onClick={() => {
                clearCompare();
                router.push("/compare");
              }}
              variant="ghost"
              size="sm"
              className="text-xs text-gray-500 hover:text-red-600 gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      {/* Dynamic College Add Bar */}
      {colleges.length < 3 ? (
        <div className="relative mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Add College to Compare ({colleges.length}/3 selected)
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Type college name to add (e.g. BITS Pilani, NIT Trichy)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
            {searching ? <RefreshCw className="absolute right-3 top-3 h-4 w-4 text-blue-500 animate-spin" /> : null}
          </div>

          {/* Autocomplete dropdown results */}
          {searchResults.length > 0 ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden divide-y divide-gray-100">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddCollege(item)}
                  className="w-full p-3 text-left hover:bg-blue-50 transition flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.location}, {item.state} • {item.type}
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-blue-600" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Comparison Matrix Table */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 font-medium">Loading comparison data...</div>
      ) : (
        <CompareTable colleges={colleges} onRemove={handleRemoveCollege} />
      )}

      {/* Popular Comparison Matchups */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Popular Head-to-Head Comparisons
            </h3>
            <p className="text-xs text-slate-500">
              Quickly load comparison matrices for top competing universities with 1-click.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {POPULAR_MATCHUPS.map((match) => (
            <button
              key={match.title}
              onClick={() => handleLoadPreset(match.query1, match.query2)}
              disabled={loading}
              className="group text-left p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition block">
                  {match.title}
                </span>
                <p className="text-[11px] text-slate-500 line-clamp-1">{match.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 mt-2.5">
                <span>Compare Now</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading comparison tool...</div>}>
      <ComparePageContent />
    </Suspense>
  );
}
