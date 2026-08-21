"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const INDIAN_STATES = [
  "Maharashtra", "Delhi", "Tamil Nadu", "Karnataka", "Telangana",
  "West Bengal", "Uttar Pradesh", "Punjab", "Rajasthan", "Kerala", "Uttarakhand"
];

export function CollegeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [state, setState] = useState(searchParams.get("state") || "ALL");
  const [type, setType] = useState(searchParams.get("type") || "ALL");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "ALL");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "rating");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setState(searchParams.get("state") || "ALL");
    setType(searchParams.get("type") || "ALL");
    setMinRating(searchParams.get("minRating") || "ALL");
    setSortBy(searchParams.get("sortBy") || "rating");
  }, [searchParams]);

  // Create query string handler
  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (!value || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.set("page", "1"); // Reset to page 1 on filter update
      return params.toString();
    },
    [searchParams]
  );

  const applyFilters = () => {
    const query = createQueryString({
      q: q || null,
      state: state !== "ALL" ? state : null,
      type: type !== "ALL" ? type : null,
      minRating: minRating !== "ALL" ? minRating : null,
      sortBy: sortBy !== "rating" ? sortBy : null,
    });
    router.push(`/colleges?${query}`);
    setMobileFilterOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const clearAllFilters = () => {
    setQ("");
    setState("ALL");
    setType("ALL");
    setMinRating("ALL");
    setSortBy("rating");
    router.push("/colleges");
    setMobileFilterOpen(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex lg:pointer-events-none items-center gap-2 text-base font-bold text-slate-900"
        >
          <Filter className="h-4 w-4 text-blue-600" />
          <span>Filter & Search</span>
          <span className="lg:hidden text-xs font-normal text-blue-600 ml-1">
            ({mobileFilterOpen ? "Hide" : "Show"})
          </span>
        </button>
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className={`${mobileFilterOpen ? "block" : "hidden"} lg:block space-y-6`}>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="space-y-1.5">
        <Label className="text-xs text-gray-600 font-semibold">Search Keywords</Label>
        <div className="relative">
          <Input
            type="text"
            placeholder="College name, city..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </form>

      {/* State Filter */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600 font-semibold">State / Location</Label>
        <Select value={state} onValueChange={(val) => setState(val)}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All States</SelectItem>
            {INDIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* College Type */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600 font-semibold">Institute Type</Label>
        <Select value={type} onValueChange={(val) => setType(val)}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="PUBLIC">Public / Govt (IIT/NIT)</SelectItem>
            <SelectItem value="PRIVATE">Private Institute</SelectItem>
            <SelectItem value="DEEMED">Deemed University</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600 font-semibold">Minimum Rating</Label>
        <Select value={minRating} onValueChange={(val) => setMinRating(val)}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Any Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Any Rating</SelectItem>
            <SelectItem value="4.5">4.5★ & above</SelectItem>
            <SelectItem value="4.0">4.0★ & above</SelectItem>
            <SelectItem value="3.5">3.5★ & above</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="space-y-1.5">
        <Label className="text-xs text-gray-600 font-semibold">Sort Results By</Label>
        <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rating</SelectItem>
            <SelectItem value="ranking">NIRF Ranking (Top 1st)</SelectItem>
            <SelectItem value="fees">Lowest Annual Fees</SelectItem>
            <SelectItem value="name">Alphabetical (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Apply Button */}
      <Button onClick={applyFilters} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Apply Filters
      </Button>
      </div>
    </div>
  );
}
