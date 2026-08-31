"use client";

import { Scale, Check } from "lucide-react";
import { useCompare } from "@/components/providers/CompareContext";
import { Button } from "@/components/ui/button";

interface AddToCompareDetailButtonProps {
  college: {
    id: string;
    name: string;
    slug: string;
    location: string;
    state: string;
    type: string;
    rating: number;
    minFees: number;
    ranking: number | null;
    placements?: Array<{ averagePackage: number; highestPackage: number }>;
  };
}

export function AddToCompareDetailButton({ college }: AddToCompareDetailButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();

  const isComparing = isInCompare(college.id);

  const handleToggle = () => {
    if (isComparing) {
      removeFromCompare(college.id);
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 colleges at once.");
        return;
      }
      addToCompare(college as any);
    }
  };

  return (
    <Button
      size="sm"
      variant={isComparing ? "default" : "outline"}
      onClick={handleToggle}
      className={`text-xs font-semibold gap-1.5 transition ${
        isComparing
          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          : "border-slate-200 text-slate-700 hover:bg-slate-50"
      }`}
      title={isComparing ? "Remove from comparison" : "Add to comparison matrix"}
    >
      {isComparing ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Added to Compare</span>
        </>
      ) : (
        <>
          <Scale className="h-3.5 w-3.5 text-slate-500" />
          <span>Compare College</span>
        </>
      )}
    </Button>
  );
}
