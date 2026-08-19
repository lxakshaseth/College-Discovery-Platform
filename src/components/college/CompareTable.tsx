"use client";

import Link from "next/link";
import { Star, MapPin, Building, IndianRupee, Trophy, Check, X, Award, ExternalLink } from "lucide-react";
import { CompareCollege } from "@/types";
import { formatCurrency, formatPackage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CompareTableProps {
  colleges: CompareCollege[];
  onRemove?: (id: string) => void;
}

export function CompareTable({ colleges, onRemove }: CompareTableProps) {
  if (!colleges || colleges.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50">
        <p className="text-gray-500 font-medium">No colleges selected for comparison.</p>
        <p className="text-xs text-gray-400 mt-1">Select 2 to 3 colleges from the listings to compare side-by-side.</p>
      </div>
    );
  }

  // Best metrics calculation highlights
  const highestRatingId = colleges.reduce((prev, curr) => (curr.rating > prev.rating ? curr : prev)).id;
  const lowestFeeId = colleges.reduce((prev, curr) => (curr.minFees < prev.minFees ? curr : prev)).id;
  const highestAvgPackageId = colleges.reduce((prev, curr) => {
    const prevAvg = prev.placements[0]?.averagePackage || 0;
    const currAvg = curr.placements[0]?.averagePackage || 0;
    return currAvg > prevAvg ? curr : prev;
  }).id;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            <th className="p-4 w-1/4 text-sm font-bold text-gray-700 bg-gray-100/50">Feature Metric</th>
            {colleges.map((college) => (
              <th key={college.id} className="p-4 text-center align-top relative border-l border-gray-200">
                {onRemove ? (
                  <button
                    onClick={() => onRemove(college.id)}
                    className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Remove college"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-2">
                    {college.ranking ? (
                      <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                        NIRF #{college.ranking}
                      </Badge>
                    ) : null}
                    <Badge variant="outline" className="text-xs">
                      {college.type}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base text-center line-clamp-2 px-2">
                    {college.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {college.location}, {college.state}
                  </p>
                  <Link href={`/colleges/${college.slug}`} className="mt-3">
                    <Button size="sm" variant="outline" className="text-xs gap-1 h-7">
                      Full Profile
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {/* Overall Rating */}
          <tr>
            <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Overall Rating</td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 text-center border-l border-gray-200">
                <div className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>{c.rating.toFixed(1)} / 5.0</span>
                  {c.id === highestRatingId ? (
                    <span title="Highest Rated">
                      <Trophy className="h-4 w-4 text-amber-600 ml-1" />
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-gray-400 mt-1">{c._count.reviews} student reviews</div>
              </td>
            ))}
          </tr>

          {/* Fee Structure */}
          <tr>
            <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Annual Tuition Fees</td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 text-center border-l border-gray-200">
                <div className={`font-bold text-base ${c.id === lowestFeeId ? "text-emerald-700" : "text-gray-900"}`}>
                  {formatCurrency(c.minFees)} / yr
                </div>
                {c.id === lowestFeeId ? (
                  <Badge variant="success" className="mt-1 text-[10px] bg-emerald-100 text-emerald-800 border-none">
                    Most Affordable
                  </Badge>
                ) : null}
                <div className="text-xs text-gray-500 mt-1">Range up to {formatCurrency(c.maxFees)}</div>
              </td>
            ))}
          </tr>

          {/* Average Package */}
          <tr>
            <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Average Placement Package</td>
            {colleges.map((c) => {
              const placement = c.placements[0];
              return (
                <td key={c.id} className="p-4 text-center border-l border-gray-200">
                  {placement ? (
                    <>
                      <div className="font-bold text-blue-700 text-base">
                        {formatPackage(placement.averagePackage)}
                      </div>
                      {c.id === highestAvgPackageId ? (
                        <Badge variant="default" className="mt-1 text-[10px] bg-blue-100 text-blue-800 border-none">
                          Highest Avg Salary
                        </Badge>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Highest Package */}
          <tr>
            <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Highest Placement Package</td>
            {colleges.map((c) => {
              const placement = c.placements[0];
              return (
                <td key={c.id} className="p-4 text-center border-l border-gray-200 font-bold text-gray-900">
                  {placement ? formatPackage(placement.highestPackage) : "N/A"}
                </td>
              );
            })}
          </tr>

          {/* Placement Rate */}
          <tr>
            <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Placement Rate (%)</td>
            {colleges.map((c) => {
              const placement = c.placements[0];
              return (
                <td key={c.id} className="p-4 text-center border-l border-gray-200 font-semibold text-emerald-700">
                  {placement ? `${placement.placementRate.toFixed(1)}%` : "N/A"}
                </td>
              );
            })}
          </tr>

          {/* Top Recruiters */}
          <tr>
            <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Top Recruiters</td>
            {colleges.map((c) => {
              const recruiters = c.placements[0]?.topRecruiters || [];
              return (
                <td key={c.id} className="p-4 text-center border-l border-gray-200">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {recruiters.map((r, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
              );
            })}
          </tr>

          {/* Established Year */}
          <tr>
            <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Established Year</td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 text-center border-l border-gray-200 text-gray-700">
                {c.establishedYear}
              </td>
            ))}
          </tr>

          {/* Approvals */}
          <tr>
            <td className="p-4 font-semibold text-gray-700 bg-gray-50/50">Approvals & Accreditations</td>
            {colleges.map((c) => (
              <td key={c.id} className="p-4 text-center border-l border-gray-200">
                <div className="flex flex-wrap justify-center gap-1">
                  {c.approvals.map((appr, idx) => (
                    <Badge key={idx} variant="outline" className="text-[11px] bg-blue-50/50 border-blue-200 text-blue-700">
                      {appr}
                    </Badge>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
