"use client";

import { useState } from "react";
import { Sparkles, Trophy, CheckCircle, AlertTriangle, ShieldCheck, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPackage } from "@/lib/utils";
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
    cutoffEstimate: number;
    admissionChance: "HIGH" | "MEDIUM" | "LOW";
  };
}

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("12000");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchedCollege[] | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum <= 0) {
      alert("Please enter a valid rank.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/predictor?exam=${encodeURIComponent(exam)}&rank=${rankNum}`);
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-800 border border-amber-200">
          <Sparkles className="h-4 w-4 text-amber-600" />
          AI Cutoff & Rank Matching Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          College Admission Rank Predictor
        </h1>
        <p className="text-sm text-gray-600">
          Enter your competitive entrance exam rank to discover predicted college cutoffs and admission chance tiers.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-md">
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Select Entrance Exam</Label>
              <Select value={exam} onValueChange={(val) => setExam(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JEE Main">JEE Main (B.Tech)</SelectItem>
                  <SelectItem value="JEE Advanced">JEE Advanced (IITs)</SelectItem>
                  <SelectItem value="BITSAT">BITSAT (BITS Campuses)</SelectItem>
                  <SelectItem value="GATE">GATE (M.Tech)</SelectItem>
                  <SelectItem value="CAT">CAT (MBA/Management)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">All India Rank (AIR)</Label>
              <Input
                type="number"
                placeholder="e.g. 12500"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                min={1}
                max={500000}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base h-12 rounded-xl shadow-md gap-2"
          >
            <Sparkles className="h-5 w-5 text-amber-300" />
            {loading ? "Calculating Match Probabilities..." : "Predict Recommended Colleges"}
          </Button>
        </form>
      </div>

      {/* Prediction Results Grid */}
      {results ? (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Recommended Colleges ({results.length})
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Based on AIR #{rank} in {exam}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((c) => {
              const chance = c.matchDetails.admissionChance;
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-300 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {chance === "HIGH" ? (
                        <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-none font-bold gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> High Admission Chance (Safe)
                        </Badge>
                      ) : chance === "MEDIUM" ? (
                        <Badge variant="warning" className="bg-amber-100 text-amber-800 border-none font-bold gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Moderate Match
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-none font-bold gap-1">
                          Reach / Ambitious
                        </Badge>
                      )}
                    </div>

                    <Link href={`/colleges/${c.slug}`}>
                      <h3 className="font-bold text-base text-gray-900 hover:text-blue-600 transition line-clamp-2">
                        {c.name}
                      </h3>
                    </Link>

                    <div className="text-xs text-gray-500">
                      {c.location}, {c.state} • {c.type}
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Predicted Closing Cutoff:</span>
                        <span className="font-bold text-gray-900">~ AIR #{c.matchDetails.cutoffEstimate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Annual Tuition Fees:</span>
                        <span className="font-bold text-gray-900">{formatCurrency(c.minFees)} / yr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Average Placement CTC:</span>
                        <span className="font-bold text-blue-700">
                          {c.placements[0] ? formatPackage(c.placements[0].averagePackage) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/colleges/${c.slug}`} className="w-full">
                    <Button size="sm" variant="outline" className="w-full text-xs font-semibold gap-1">
                      View College Profile
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
