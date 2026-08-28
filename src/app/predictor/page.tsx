"use client";

import { useState } from "react";
import { Sparkles, Trophy, CheckCircle, AlertTriangle, ArrowUpRight, Scale, Check, Filter, Layers, Target, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPackage } from "@/lib/utils";
import { useCompare } from "@/components/providers/CompareContext";
import { SaveButton } from "@/components/college/SaveButton";
import Link from "next/link";

interface MatchedCollege {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  type: string;
  rating: number;
  minFees: number;
  ranking: number | null;
  placements: Array<{ averagePackage: number; highestPackage: number }>;
  matchDetails: {
    exam: string;
    userRank: number;
    category: string;
    isHomeState: boolean;
    cutoffEstimate: number;
    admissionChance: "HIGH" | "MEDIUM" | "LOW";
  };
}

const INDIAN_STATES = [
  "Maharashtra", "Delhi", "Tamil Nadu", "Karnataka", "Telangana",
  "West Bengal", "Uttar Pradesh", "Punjab", "Rajasthan", "Kerala", "Uttarakhand"
];

export default function PredictorPage() {
  const [inputMode, setInputMode] = useState<"rank" | "percentile">("rank");
  const [percentile, setPercentile] = useState("98.50");
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("12000");
  const [category, setCategory] = useState("GENERAL");
  const [homeState, setHomeState] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchedCollege[] | null>(null);
  const [tierFilter, setTierFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum <= 0) {
      alert("Please enter a valid rank.");
      return;
    }

    setLoading(true);

    try {
      const p = new URLSearchParams({
        exam,
        rank: rankNum.toString(),
        category,
        homeState: homeState !== "ALL" ? homeState : "",
      });

      const res = await fetch(`/api/predictor?${p.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setResults(json.recommendations);
      }
    } catch (err) {
      console.error("Predictor error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareToggle = (college: MatchedCollege) => {
    if (isInCompare(college.id)) {
      removeFromCompare(college.id);
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 colleges at once.");
        return;
      }
      addToCompare(college as any);
    }
  };

  const filteredResults = results?.filter((c) => {
    if (tierFilter === "ALL") return true;
    return c.matchDetails.admissionChance === tierFilter;
  });

  const highChanceCount = results?.filter((c) => c.matchDetails.admissionChance === "HIGH").length || 0;
  const mediumChanceCount = results?.filter((c) => c.matchDetails.admissionChance === "MEDIUM").length || 0;
  const lowChanceCount = results?.filter((c) => c.matchDetails.admissionChance === "LOW").length || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-800 border border-amber-200">
          <Sparkles className="h-4 w-4 text-amber-600" />
          AI Cutoff & Admission Matching Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          College Admission Rank Predictor
        </h1>
        <p className="text-sm text-slate-600">
          Enter your entrance exam rank, category, and domicile to generate a personalized admission probability report with safety tiers.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Exam */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Entrance Exam</Label>
              <Select value={exam} onValueChange={(val) => setExam(val)}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Choose exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JEE Main">JEE Main (NITs, IIITs, GFTIs)</SelectItem>
                  <SelectItem value="JEE Advanced">JEE Advanced (IITs)</SelectItem>
                  <SelectItem value="BITSAT">BITSAT (BITS Campuses)</SelectItem>
                  <SelectItem value="GATE">GATE (M.Tech Engineering)</SelectItem>
                  <SelectItem value="CAT">CAT (MBA & Management)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rank / Percentile */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700">
                  {inputMode === "percentile" ? "NTA Percentile Score (%)" : "All India Rank (AIR)"}
                </Label>
                <button
                  type="button"
                  onClick={() => setInputMode(inputMode === "rank" ? "percentile" : "rank")}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  {inputMode === "percentile" ? "Enter AIR rank directly" : "Calculate from percentile (%)"}
                </button>
              </div>

              {inputMode === "percentile" ? (
                <div className="space-y-1">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 98.65"
                    value={percentile}
                    onChange={(e) => {
                      const p = e.target.value;
                      setPercentile(p);
                      const pVal = parseFloat(p);
                      if (!isNaN(pVal) && pVal > 0 && pVal <= 100) {
                        const calculatedRank = Math.max(1, Math.round(((100 - pVal) / 100) * 1450000));
                        setRank(calculatedRank.toString());
                      }
                    }}
                    min={1}
                    max={100}
                    required
                    className="text-sm"
                  />
                  {rank && (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Estimated AIR: ~{parseInt(rank).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              ) : (
                <Input
                  type="number"
                  placeholder="e.g. 12500"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  min={1}
                  max={500000}
                  required
                  className="text-sm"
                />
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Candidate Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General / Open</SelectItem>
                  <SelectItem value="OBC_NCL">OBC-NCL</SelectItem>
                  <SelectItem value="EWS">GEN-EWS</SelectItem>
                  <SelectItem value="SC">Scheduled Caste (SC)</SelectItem>
                  <SelectItem value="ST">Scheduled Tribe (ST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Home State */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Home State (Domicile Quota)</Label>
              <Select value={homeState} onValueChange={setHomeState}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="All India" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All India (Open Quota)</SelectItem>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base h-12 rounded-xl shadow-md gap-2"
          >
            <Sparkles className="h-5 w-5 text-amber-300" />
            {loading ? "Analyzing Cutoffs & Quota Matrices..." : "Predict Recommended Colleges"}
          </Button>
        </form>
      </div>

      {/* Prediction Results Grid */}
      {results && (
        <div className="space-y-6 pt-4">
          {/* Results Summary Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Matching Colleges for AIR #{rank} in {exam}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Category: <span className="font-semibold text-slate-700">{category}</span> • Found{" "}
                <span className="font-bold text-slate-900">{results.length}</span> recommended institutions
              </p>
            </div>

            {/* Tier Filters */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setTierFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  tierFilter === "ALL" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => setTierFilter("HIGH")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  tierFilter === "HIGH" ? "bg-emerald-600 text-white shadow-xs" : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <CheckCircle className="h-3 w-3" />
                Safe ({highChanceCount})
              </button>
              <button
                onClick={() => setTierFilter("MEDIUM")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  tierFilter === "MEDIUM" ? "bg-amber-600 text-white shadow-xs" : "text-amber-700 hover:bg-amber-50"
                }`}
              >
                <Target className="h-3 w-3" />
                Target ({mediumChanceCount})
              </button>
              <button
                onClick={() => setTierFilter("LOW")}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  tierFilter === "LOW" ? "bg-purple-600 text-white shadow-xs" : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                <Compass className="h-3 w-3" />
                Dream ({lowChanceCount})
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults?.map((c) => {
              const chance = c.matchDetails.admissionChance;
              const isComparing = isInCompare(c.id);

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-300 transition"
                >
                  <div className="space-y-3">
                    {/* Tier badge & save */}
                    <div className="flex items-center justify-between">
                      {chance === "HIGH" ? (
                        <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-200 font-bold gap-1 text-xs">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> High Chance (Safe)
                        </Badge>
                      ) : chance === "MEDIUM" ? (
                        <Badge variant="warning" className="bg-amber-50 text-amber-800 border-amber-200 font-bold gap-1 text-xs">
                          <Target className="h-3.5 w-3.5 text-amber-600" /> Target Match
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 font-bold gap-1 text-xs">
                          <Compass className="h-3.5 w-3.5 text-purple-600" /> Dream / Reach
                        </Badge>
                      )}

                      <SaveButton collegeId={c.id} />
                    </div>

                    <Link href={`/colleges/${c.slug}`}>
                      <h3 className="font-bold text-base text-slate-900 hover:text-blue-600 transition line-clamp-2">
                        {c.name}
                      </h3>
                    </Link>

                    <div className="text-xs text-slate-500">
                      {c.location}, {c.state} • {c.type}
                    </div>

                    {/* Cutoff & Metrics Box */}
                    <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-2 border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Est. Closing Cutoff:</span>
                        <span className="font-bold text-slate-900">~ AIR #{c.matchDetails.cutoffEstimate.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Seat Quota Applied:</span>
                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">
                          {c.matchDetails.isHomeState ? "Home State (HS)" : "All India (AI)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Annual Tuition Fees:</span>
                        <span className="font-bold text-slate-900">{formatCurrency(c.minFees)} / yr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Avg Placement CTC:</span>
                        <span className="font-bold text-blue-700">
                          {c.placements[0] ? formatPackage(c.placements[0].averagePackage) : "₹14.5 LPA"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant={isComparing ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleCompareToggle(c)}
                      className={`flex-1 gap-1 text-xs ${
                        isComparing
                          ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                          : "border-slate-200 text-slate-700"
                      }`}
                    >
                      {isComparing ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-blue-600" />
                          Comparing
                        </>
                      ) : (
                        <>
                          <Scale className="h-3.5 w-3.5 text-slate-500" />
                          Compare
                        </>
                      )}
                    </Button>

                    <Link href={`/colleges/${c.slug}`} className="flex-1">
                      <Button size="sm" className="w-full text-xs font-semibold gap-1 bg-blue-600 hover:bg-blue-700 text-white">
                        Details
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
