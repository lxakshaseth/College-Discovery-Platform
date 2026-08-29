"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bookmark, Scale, Trash2, ArrowUpRight, GraduationCap, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollegeCard } from "@/components/college/CollegeCard";
import { SavedCollegeWithCollege } from "@/types";
import { formatCurrency, formatPackage } from "@/lib/utils";

export default function SavedPage() {
  const { data: session, status } = useSession();
  const [savedColleges, setSavedColleges] = useState<SavedCollegeWithCollege[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const exportWishlistCSV = () => {
    if (typeof window === "undefined" || savedColleges.length === 0) return;

    const headers = [
      "College Name",
      "Location",
      "State",
      "Type",
      "NIRF Rank",
      "Rating",
      "Annual Tuition Fees",
      "Avg Placement CTC",
      "Website",
    ];

    const rows = savedColleges.map(({ college }: any) => [
      `"${college.name.replace(/"/g, '""')}"`,
      `"${college.location}"`,
      `"${college.state}"`,
      `"${college.type}"`,
      `"${college.ranking ? `#${college.ranking}` : "Unranked"}"`,
      `"${college.rating ? college.rating.toFixed(1) : "0.0"} / 5.0"`,
      `"${formatCurrency(college.minFees || 0)}"`,
      `"${college.placements?.[0] ? formatPackage(college.placements[0].averagePackage) : "N/A"}"`,
      `"${college.website || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `saved_colleges_wishlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSavedColleges = savedColleges.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.college.name.toLowerCase().includes(q) ||
      item.college.location.toLowerCase().includes(q) ||
      item.college.state.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    async function fetchSavedData() {
      setLoading(true);
      try {
        const [collegesRes, comparisonsRes] = await Promise.all([
          fetch("/api/saved/colleges"),
          fetch("/api/saved/comparisons"),
        ]);

        if (collegesRes.ok) {
          const collegesData = await collegesRes.json();
          setSavedColleges(collegesData);
        }

        if (comparisonsRes.ok) {
          const compData = await comparisonsRes.json();
          setSavedComparisons(compData);
        }
      } catch (err) {
        console.error("Failed to load saved items", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedData();
  }, [status]);

  const handleDeleteComparison = async (id: string) => {
    try {
      const res = await fetch(`/api/saved/comparisons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSavedComparisons((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Log in to view saved items</h2>
        <p className="text-sm text-gray-500">
          Save your favorite colleges and side-by-side comparison sets across devices.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="font-bold px-6">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Bookmark className="h-7 w-7 text-blue-600" />
          My Saved Wishlist & Comparisons
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Access your bookmarked colleges and saved comparison matrix sessions.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading your saved items...</div>
      ) : (
        <Tabs defaultValue="colleges" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1.5 rounded-xl">
            <TabsTrigger value="colleges" className="px-5 py-2 font-bold text-sm">
              Saved Colleges ({savedColleges.length})
            </TabsTrigger>
            <TabsTrigger value="comparisons" className="px-5 py-2 font-bold text-sm">
              Saved Comparisons ({savedComparisons.length})
            </TabsTrigger>
          </TabsList>

          {/* Saved Colleges Tab */}
          <TabsContent value="colleges" className="space-y-4">
            {savedColleges.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                <input
                  type="text"
                  placeholder="Filter saved colleges by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80 px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                    Showing {filteredSavedColleges.length} of {savedColleges.length} saved colleges
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportWishlistCSV}
                    className="text-xs font-semibold gap-1.5 border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0"
                    title="Export your shortlisted colleges as CSV spreadsheet"
                  >
                    <Download className="h-3.5 w-3.5 text-gray-500" />
                    <span>Export Wishlist</span>
                  </Button>
                </div>
              </div>
            )}

            {savedColleges.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-white space-y-3">
                <GraduationCap className="h-10 w-10 text-gray-400 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">No saved colleges yet</h3>
                <p className="text-xs text-gray-500">Click the bookmark icon on any college card to add it to your wishlist.</p>
                <Link href="/colleges">
                  <Button size="sm" className="bg-blue-600 text-white font-semibold mt-2">
                    Browse Colleges
                  </Button>
                </Link>
              </div>
            ) : filteredSavedColleges.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-sm text-gray-500">
                No saved colleges match "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSavedColleges.map((item) => (
                  <CollegeCard key={item.id} college={item.college as any} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Comparisons Tab */}
          <TabsContent value="comparisons">
            {savedComparisons.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-white space-y-3">
                <Scale className="h-10 w-10 text-gray-400 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">No saved comparisons</h3>
                <p className="text-xs text-gray-500">Save side-by-side comparison sets for quick decision-making later.</p>
                <Link href="/compare">
                  <Button size="sm" className="bg-blue-600 text-white font-semibold mt-2">
                    Go to Compare Tool
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedComparisons.map((comp) => (
                  <div
                    key={comp.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Saved Comparison
                        </span>
                        <button
                          onClick={() => handleDeleteComparison(comp.id)}
                          className="text-gray-400 hover:text-red-600 transition"
                          title="Delete comparison"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <h3 className="font-bold text-base text-gray-900">{comp.name}</h3>

                      <div className="space-y-1 pt-2">
                        {comp.colleges?.map((c: any) => (
                          <div key={c.id} className="text-xs text-gray-700 font-medium flex justify-between">
                            <span>{c.name}</span>
                            <span className="text-gray-400">Rating: {c.rating}★</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href={`/compare?ids=${comp.collegeIds.join(",")}`}>
                      <Button size="sm" variant="outline" className="w-full text-xs font-semibold gap-1">
                        Open Side-by-Side View
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
