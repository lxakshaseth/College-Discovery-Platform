"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

interface SaveButtonProps {
  collegeId: string;
}

export function SaveButton({ collegeId }: SaveButtonProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    // Check local storage / session cached state
    try {
      const savedIds = JSON.parse(localStorage.getItem("user_saved_college_ids") || "[]");
      setIsSaved(savedIds.includes(collegeId));
    } catch (e) {
      console.error(e);
    }
  }, [collegeId, session]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      alert("Please log in to save colleges to your wishlist.");
      return;
    }

    setLoading(true);

    try {
      if (isSaved) {
        // Delete
        const res = await fetch(`/api/saved/colleges/${collegeId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsSaved(false);
          const savedIds: string[] = JSON.parse(localStorage.getItem("user_saved_college_ids") || "[]");
          const updated = savedIds.filter((id) => id !== collegeId);
          localStorage.setItem("user_saved_college_ids", JSON.stringify(updated));
        }
      } else {
        // Save
        const res = await fetch("/api/saved/colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        if (res.ok) {
          setIsSaved(true);
          const savedIds: string[] = JSON.parse(localStorage.getItem("user_saved_college_ids") || "[]");
          savedIds.push(collegeId);
          localStorage.setItem("user_saved_college_ids", JSON.stringify(savedIds));
        }
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`relative group p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/50 ${
        isSaved
          ? "bg-red-50 text-red-600 hover:bg-red-100 scale-105 shadow-xs"
          : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 hover:scale-105"
      }`}
      aria-label={isSaved ? "Remove college from wishlist" : "Save college to wishlist"}
      title={isSaved ? "Saved to your wishlist" : "Save to wishlist"}
    >
      <Heart
        className={`h-4 w-4 transition-transform duration-200 ${
          isSaved ? "fill-red-500 text-red-500 scale-110" : "group-hover:scale-110"
        } ${loading ? "animate-pulse opacity-60" : ""}`}
      />
    </button>
  );
}
