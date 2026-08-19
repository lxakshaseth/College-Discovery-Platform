"use client";

import Link from "next/link";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import { useCompare } from "@/components/providers/CompareContext";
import { Button } from "@/components/ui/button";

export function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl rounded-2xl border border-gray-800 bg-gray-900/95 p-4 text-white shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Selected Colleges chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider pr-2 border-r border-gray-800">
            <Scale className="h-4 w-4" />
            Compare ({compareList.length}/3)
          </div>

          {compareList.map((college) => (
            <div
              key={college.id}
              className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-200 border border-gray-700 whitespace-nowrap"
            >
              <span className="max-w-[140px] truncate">{college.name}</span>
              <button
                onClick={() => removeFromCompare(college.id)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompare}
            className="text-xs text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>

          <Link href={`/compare?ids=${compareList.map((c) => c.id).join(",")}`}>
            <Button
              size="sm"
              disabled={compareList.length < 2}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 gap-1.5 shadow-md"
            >
              Compare Side-by-Side
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
