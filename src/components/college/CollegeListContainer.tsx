"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, TableProperties, Star, MapPin, IndianRupee, ArrowUpRight, Scale, Check, Award, Building2, Download } from "lucide-react";
import { CollegeListItem } from "@/types";
import { CollegeCard } from "./CollegeCard";
import { formatCurrency, formatPackage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/components/providers/CompareContext";
import { SaveButton } from "./SaveButton";

interface CollegeListContainerProps {
  colleges: CollegeListItem[];
  total: number;
}

export function CollegeListContainer({ colleges, total }: CollegeListContainerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();

  const exportCollegesCSV = () => {
    if (typeof window === "undefined" || colleges.length === 0) return;

    const headers = [
      "NIRF Rank",
      "College Name",
      "Location",
      "State",
      "Type",
      "Annual Tuition Fees",
      "Avg Placement CTC",
      "Rating",
    ];

    const rows = colleges.map((c) => [
      `"${c.ranking ? `#${c.ranking}` : "N/A"}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.location}"`,
      `"${c.state}"`,
      `"${c.type}"`,
      `"${formatCurrency(c.minFees)}"`,
      `"${c.placements?.[0] ? formatPackage(c.placements[0].averagePackage) : "N/A"}"`,
      `"${c.rating.toFixed(1)}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `colleges_page_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCompareClick = (college: CollegeListItem) => {
    if (isInCompare(college.id)) {
      removeFromCompare(college.id);
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 colleges at once.");
        return;
      }
      addToCompare(college);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Toolbar: Quick Category Chips + View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold text-slate-600">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider pr-1">Quick:</span>
          <Link href="/colleges?sortBy=ranking" className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition">
            🏆 Top NIRF
          </Link>
          <Link href="/colleges?q=IIT" className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition">
            IITs
          </Link>
          <Link href="/colleges?q=NIT" className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition">
            NITs
          </Link>
          <Link href="/colleges?exam=JEE+Advanced" className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-800 transition">
            JEE Adv
          </Link>
          <Link href="/colleges?exam=BITSAT" className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 transition">
            BITSAT
          </Link>
          <Link href="/colleges?type=PUBLIC" className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition">
            Govt
          </Link>
          <Link href="/colleges?minRating=4.5" className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition">
            ★ 4.5+
          </Link>
        </div>

        {/* View Switcher & Export Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCollegesCSV}
            className="h-8 text-xs font-semibold gap-1 border-slate-200 text-slate-700 hover:bg-slate-50"
            title="Download current page college list as CSV spreadsheet"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden md:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Comparison Matrix Table View"
            >
              <TableProperties className="h-4 w-4" />
              <span className="hidden md:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode: Card Grid vs Matrix Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3.5 w-16 text-center">Rank</th>
                <th className="p-3.5">College & Location</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Annual Fees</th>
                <th className="p-3.5">Avg CTC</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {colleges.map((c) => {
                const isComparing = isInCompare(c.id);
                const avgCtc = c.placements?.[0]?.averagePackage;
                return (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition">
                    {/* Rank */}
                    <td className="p-3.5 text-center">
                      {c.ranking ? (
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                          #{c.ranking}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* College & Location */}
                    <td className="p-3.5 max-w-[260px]">
                      <Link href={`/colleges/${c.slug}`} className="font-bold text-sm text-slate-900 hover:text-blue-600 transition block truncate">
                        {c.name}
                      </Link>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {c.location}, {c.state} • Estd {c.establishedYear}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {c.type}
                      </Badge>
                    </td>

                    {/* Fees */}
                    <td className="p-3.5 font-bold text-slate-900">
                      {formatCurrency(c.minFees)} / yr
                    </td>

                    {/* Avg CTC */}
                    <td className="p-3.5 font-bold text-blue-700">
                      {avgCtc ? formatPackage(avgCtc) : "₹14.5 LPA"}
                    </td>

                    {/* Rating */}
                    <td className="p-3.5">
                      <div className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {c.rating.toFixed(1)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleCompareClick(c)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition flex items-center gap-1 ${
                            isComparing
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                          title={isComparing ? "Remove from comparison" : "Add to comparison"}
                        >
                          {isComparing ? <Check className="h-3.5 w-3.5 text-blue-600" /> : <Scale className="h-3.5 w-3.5" />}
                          <span className="hidden sm:inline">{isComparing ? "Comparing" : "Compare"}</span>
                        </button>

                        <Link href={`/colleges/${c.slug}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 gap-1">
                            Details
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </Link>

                        <SaveButton collegeId={c.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
