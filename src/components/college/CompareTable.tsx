"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Building, IndianRupee, Trophy, Check, X, Award, ExternalLink, Share2, CheckCheck } from "lucide-react";
import { CompareCollege } from "@/types";
import { formatCurrency, formatPackage, safeJsonParse } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CompareTableProps {
  colleges: CompareCollege[];
  onRemove?: (id: string) => void;
}

export function CompareTable({ colleges, onRemove }: CompareTableProps) {
  const [copied, setCopied] = useState(false);

  if (!colleges || colleges.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
        <p className="text-slate-700 font-bold text-base">No colleges selected for comparison.</p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add 2 to 3 colleges from the search bar above or click "Compare" on any college card.
        </p>
        <Link href="/colleges">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2 text-xs">
            Browse Colleges Directory
          </Button>
        </Link>
      </div>
    );
  }

  // Best metrics calculation highlights
  const highestRatingId = colleges.reduce((prev, curr) => (curr.rating > prev.rating ? curr : prev)).id;
  const lowestFeeId = colleges.reduce((prev, curr) => (curr.minFees < prev.minFees ? curr : prev)).id;
  
  const bestRankCollege = colleges.filter((c) => c.ranking).reduce((prev, curr) => {
    if (!prev.ranking) return curr;
    if (!curr.ranking) return prev;
    return curr.ranking < prev.ranking ? curr : prev;
  }, colleges[0]);
  const bestRankId = bestRankCollege?.id;

  const highestAvgPackageId = colleges.reduce((prev, curr) => {
    const prevAvg = prev.placements[0]?.averagePackage || 0;
    const currAvg = curr.placements[0]?.averagePackage || 0;
    return currAvg > prevAvg ? curr : prev;
  }).id;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Share / Action Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Comparing <span className="font-bold text-slate-900">{colleges.length}</span> institutions
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="text-xs font-semibold gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          {copied ? (
            <>
              <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
              Link Copied!
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-slate-500" />
              Share Comparison
            </>
          )}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 w-1/4 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100/60">
                Feature Parameter
              </th>
              {colleges.map((college) => (
                <th key={college.id} className="p-4 text-center align-top relative border-l border-slate-200">
                  {onRemove && (
                    <button
                      onClick={() => onRemove(college.id)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Remove from comparison"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-2">
                      {college.ranking ? (
                        <Badge variant="default" className="bg-blue-100 text-blue-800 font-bold text-xs">
                          NIRF #{college.ranking}
                        </Badge>
                      ) : null}
                      <Badge variant="outline" className="text-xs font-semibold">
                        {college.type}
                      </Badge>
                    </div>

                    <Link
                      href={`/colleges/${college.slug}`}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 transition block text-center line-clamp-2"
                    >
                      {college.name}
                    </Link>
                    <span className="text-xs text-slate-500 mt-1 block">
                      {college.location}, {college.state}
                    </span>

                    <Link href={`/colleges/${college.slug}`} className="mt-3">
                      <Button size="sm" variant="outline" className="text-xs h-7 px-3 gap-1">
                        View College
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {/* NIRF Ranking */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">NIRF National Rank</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-center border-l border-slate-200 font-bold">
                  {c.ranking ? (
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-slate-900 text-base">#{c.ranking}</span>
                      {c.id === bestRankId && (
                        <Badge variant="default" className="bg-amber-100 text-amber-900 border-amber-200 font-bold text-[10px] gap-0.5">
                          <Trophy className="h-3 w-3 text-amber-600" /> Best Rank
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Annual Tuition Fees */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Annual Tuition Fees</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-center border-l border-slate-200">
                  <div className="font-bold text-slate-900 text-base">
                    {formatCurrency(c.minFees)} / yr
                  </div>
                  {c.id === lowestFeeId && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                      <Check className="h-3 w-3 text-emerald-600" /> Lowest Fee / Best Value
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Student Rating */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Student Rating</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-center border-l border-slate-200">
                  <div className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    {c.rating.toFixed(1)} / 5.0
                  </div>
                  {c.id === highestRatingId && (
                    <div className="text-[11px] font-bold text-blue-700 mt-1">★ Highest Rated</div>
                  )}
                </td>
              ))}
            </tr>

            {/* Average Placement CTC */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Average Salary CTC</td>
              {colleges.map((c) => {
                const placement = c.placements[0];
                return (
                  <td key={c.id} className="p-4 text-center border-l border-slate-200">
                    {placement ? (
                      <div>
                        <div className="font-bold text-blue-800 text-base">
                          {formatPackage(placement.averagePackage)}
                        </div>
                        {c.id === highestAvgPackageId && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full mt-1 border border-purple-200">
                            <Trophy className="h-3 w-3 text-purple-600" /> Top Average CTC
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Highest Placement CTC */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Highest Placement CTC</td>
              {colleges.map((c) => {
                const placement = c.placements[0];
                return (
                  <td key={c.id} className="p-4 text-center border-l border-slate-200 font-bold text-emerald-700 text-base">
                    {placement ? formatPackage(placement.highestPackage) : "N/A"}
                  </td>
                );
              })}
            </tr>

            {/* Placement Rate % */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Placement Rate %</td>
              {colleges.map((c) => {
                const placement = c.placements[0];
                return (
                  <td key={c.id} className="p-4 text-center border-l border-slate-200 font-bold text-slate-800">
                    {placement ? `${placement.placementRate.toFixed(1)}%` : "N/A"}
                  </td>
                );
              })}
            </tr>

            {/* Top Recruiters */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Top Hiring Companies</td>
              {colleges.map((c) => {
                const placement = c.placements[0];
                const recruiters = placement ? safeJsonParse<string[]>(placement.topRecruiters, []) : [];
                return (
                  <td key={c.id} className="p-4 text-center border-l border-slate-200">
                    <div className="flex flex-wrap justify-center gap-1">
                      {recruiters.slice(0, 5).map((rec: string, idx: number) => (
                        <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Ownership Type */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Institute Ownership</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-center border-l border-slate-200 font-semibold text-slate-800">
                  {c.type === "PUBLIC" ? "Government / Public" : c.type === "PRIVATE" ? "Private University" : "Deemed University"}
                </td>
              ))}
            </tr>

            {/* Established Year */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Established Year</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 text-center border-l border-slate-200 text-slate-700">
                  {c.establishedYear}
                </td>
              ))}
            </tr>

            {/* Approvals */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Approvals & Accreditations</td>
              {colleges.map((c) => {
                const approvals = safeJsonParse<string[]>(c.approvals, ["AICTE", "UGC"]);
                return (
                  <td key={c.id} className="p-4 text-center border-l border-slate-200">
                    <div className="flex flex-wrap justify-center gap-1">
                      {approvals.map((appr: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-[11px] bg-blue-50/50 border-blue-200 text-blue-700 font-semibold">
                          {appr}
                        </Badge>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
