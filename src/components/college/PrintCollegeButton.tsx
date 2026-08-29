"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintCollegeButtonProps {
  collegeName: string;
}

export function PrintCollegeButton({ collegeName }: PrintCollegeButtonProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="no-print gap-1.5 text-xs text-slate-700 hover:bg-slate-50 border-slate-200"
      title={`Print or Save Brochure for ${collegeName}`}
    >
      <Printer className="h-3.5 w-3.5 text-slate-500" />
      <span className="hidden sm:inline">Print Brochure</span>
    </Button>
  );
}
