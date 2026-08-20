"use client";

import Link from "next/link";
import { Star, MapPin, IndianRupee, Award, ArrowUpRight, Scale, Check, Building2 } from "lucide-react";
import { CollegeListItem } from "@/types";
import { formatCurrency, formatPackage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/components/providers/CompareContext";
import { SaveButton } from "./SaveButton";

interface CollegeCardProps {
  college: CollegeListItem;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();

  const isComparing = isInCompare(college.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isComparing) {
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
    <div className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {college.ranking ? (
              <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold gap-1">
                <Award className="h-3 w-3 text-blue-600" />
                NIRF #{college.ranking}
              </Badge>
            ) : null}
            <Badge
              variant="outline"
              className={
                college.type === "PUBLIC"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }
            >
              {college.type}
            </Badge>
          </div>
          <SaveButton collegeId={college.id} />
        </div>

        {/* College Name & Slug link */}
        <Link href={`/colleges/${college.slug}`} className="group-hover:text-blue-600 transition">
          <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight mb-2 line-clamp-2">
            {college.name}
          </h3>
        </Link>

        {/* Location & Established */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {college.location}, {college.state}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-gray-400" />
            Estd {college.establishedYear}
          </span>
        </div>

        {/* Metrics Grid: Fees, Rating & Avg CTC */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 mb-4">
          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Annual Fees</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center mt-0.5">
              {formatCurrency(college.minFees)}/yr
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Avg CTC</span>
            <span className="text-xs sm:text-sm font-bold text-blue-700 block mt-0.5">
              {college.placements?.[0] ? formatPackage(college.placements[0].averagePackage) : "₹14.5 LPA"}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Rating</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="flex items-center gap-1 font-bold text-xs text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {college.rating.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">
                ({college._count.reviews})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <Button
          variant={isComparing ? "secondary" : "outline"}
          size="sm"
          onClick={handleCompareClick}
          className={`flex-1 gap-1 text-xs ${
            isComparing ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold" : "border-gray-200 text-gray-700"
          }`}
        >
          {isComparing ? (
            <>
              <Check className="h-3.5 w-3.5 text-blue-600" />
              Comparing
            </>
          ) : (
            <>
              <Scale className="h-3.5 w-3.5 text-gray-500" />
              Compare
            </>
          )}
        </Button>

        <Link href={`/colleges/${college.slug}`} className="flex-1">
          <Button size="sm" className="w-full gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white">
            Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
