"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareCollegeButtonProps {
  collegeName: string;
}

export function ShareCollegeButton({ collegeName }: ShareCollegeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: ${collegeName} - CampusPulse,
          text: Check out  fees, placements, and cutoffs on CampusPulse:,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-1.5 text-xs text-slate-700 hover:bg-slate-50 border-slate-200"
      title="Share college details"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-slate-500" />
          <span>Share</span>
        </>
      )}
    </Button>
  );
}
