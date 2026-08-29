"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, User, MessageSquare, Send, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReviewUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string | Date;
  user: ReviewUser;
}

interface ReviewSectionProps {
  collegeSlug: string;
  initialReviews: ReviewItem[];
}

export function ReviewSection({ collegeSlug, initialReviews }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const ratingCounts: Record<number, number> = {
    5: reviews.filter((r) => Math.round(r.rating) === 5).length,
    4: reviews.filter((r) => Math.round(r.rating) === 4).length,
    3: reviews.filter((r) => Math.round(r.rating) === 3).length,
    2: reviews.filter((r) => Math.round(r.rating) === 2).length,
    1: reviews.filter((r) => Math.round(r.rating) === 1).length,
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const filteredReviews = starFilter !== null
    ? reviews.filter((r) => Math.round(r.rating) === starFilter)
    : reviews;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      alert("Please log in to submit a review.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setErrorMsg("Please fill in all review fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/colleges/${collegeSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setReviews([data, ...reviews]);
      setTitle("");
      setContent("");
      setRating(5);
      setSuccessMsg("Your review has been published successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while posting your review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Review Form Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          Write a Student Review
        </h3>

        {session?.user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg ? (
              <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-200">
                {errorMsg}
              </div>
            ) : null}
            {successMsg ? (
              <div className="p-3 text-xs text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-200">
                {successMsg}
              </div>
            ) : null}

            {/* Rating Stars Selector */}
            <div>
              <Label className="text-xs text-gray-600 font-semibold mb-1.5 block">Select Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">{rating} out of 5</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <Label className="text-xs text-gray-600 font-semibold mb-1 block">Review Headline</Label>
              <Input
                placeholder="e.g. Fantastic campus life and great placements"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            {/* Content */}
            <div>
              <Label className="text-xs text-gray-600 font-semibold mb-1 block">Detailed Review</Label>
              <Textarea
                placeholder="Share your experience about faculty, labs, hostel, placements, and campus atmosphere..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Send className="h-4 w-4" />
              {submitting ? "Publishing..." : "Submit Review"}
            </Button>
          </form>
        ) : (
          <div className="rounded-lg bg-blue-50/60 p-4 text-center border border-blue-100">
            <p className="text-sm text-gray-700">Log in to write a verified student review for this college.</p>
          </div>
        )}
      </div>

      {/* Rating Breakdown & Stats */}
      {totalReviews > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Overall Score */}
            <div className="text-center md:border-r md:border-slate-100 md:pr-6 space-y-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{averageRating}</span>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= Math.round(Number(averageRating))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500">Based on {totalReviews} student reviews</p>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                const isSelected = starFilter === stars;

                return (
                  <button
                    key={stars}
                    onClick={() => setStarFilter(isSelected ? null : stars)}
                    className={`w-full flex items-center gap-3 text-xs py-1 px-2 rounded-lg transition text-left ${
                      isSelected ? "bg-amber-50 font-bold" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="w-12 font-semibold flex items-center gap-1">
                      {stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </span>

                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-10 text-right text-[11px] text-slate-400">{percentage}%</span>
                    <span className="w-8 text-right font-medium text-slate-700">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h4 className="font-bold text-gray-900 text-base">
            Verified Student Reviews ({filteredReviews.length}
            {starFilter !== null ? ` with ${starFilter}★` : ""})
          </h4>

          {/* Rating filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setStarFilter(null)}
              className={`px-3 py-1 rounded-lg transition ${
                starFilter === null
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setStarFilter(starFilter === s ? null : s)}
                className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                  starFilter === s
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{s}★</span>
                <span className="text-[10px] opacity-80">({ratingCounts[s] || 0})</span>
              </button>
            ))}
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            {starFilter !== null
              ? `No reviews found with ${starFilter} stars.`
              : "No reviews yet. Be the first to review!"}
          </p>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                    {rev.user.name?.[0] || "U"}
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-gray-900">{rev.user.name || "Verified Student"}</h5>
                    <span className="text-[11px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-bold text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {rev.rating}.0
                </div>
              </div>

              <h6 className="font-bold text-sm text-gray-900">{rev.title}</h6>
              <p className="text-sm text-gray-600 leading-relaxed">{rev.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
