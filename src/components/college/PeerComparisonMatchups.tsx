"use client";

import Link from "next/link";
import { Scale, ArrowRight, TrendingUp, IndianRupee, Trophy, Star } from "lucide-react";
import { formatCurrency, formatPackage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PeerCollege {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  type: string;
  minFees: number;
  ranking: number | null;
  rating: number;
  placements?: Array<{ averagePackage: number; highestPackage: number }>;
}

interface PeerComparisonMatchupsProps {
  currentCollege: {
    id: string;
    name: string;
    slug: string;
    minFees: number;
    ranking: number | null;
    rating: number;
    averagePackage?: number;
  };
  peers: PeerCollege[];
}

export function PeerComparisonMatchups({ currentCollege, peers }: PeerComparisonMatchupsProps) {
  if (!peers || peers.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            Head-to-Head Peer Matchups
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare key tuition fees, salary packages, and ranking differentials with top competing institutions.
          </p>
        </div>

        <Link href={`/compare?ids=${currentCollege.id}`}>
          <Button variant="outline" size="sm" className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold gap-1">
            Custom Comparison
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {peers.map((peer) => {
          const peerAvgPackage = peer.placements?.[0]?.averagePackage || 0;
          const currentAvgPackage = currentCollege.averagePackage || 0;

          // Fee differential calculation
          const feeDiff = peer.minFees - currentCollege.minFees;
          const pkgDiff = peerAvgPackage - currentAvgPackage;

          return (
            <div
              key={peer.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition p-4 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <Badge variant="outline" className="text-[10px] bg-white text-slate-700 font-semibold border-slate-200">
                    {peer.type}
                  </Badge>
                  {peer.ranking ? (
                    <Badge variant="default" className="text-[10px] bg-blue-100 text-blue-800 font-bold border-blue-200">
                      NIRF #{peer.ranking}
                    </Badge>
                  ) : null}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1" title={peer.name}>
                    {peer.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {peer.location}, {peer.state}
                  </p>
                </div>

                {/* Metrics Comparison Grid */}
                <div className="space-y-2 pt-2 border-t border-slate-200/70 text-xs">
                  {/* Annual Fee Comparison */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Annual Fees:</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{formatCurrency(peer.minFees)}</span>
                      {feeDiff !== 0 && (
                        <span className={`ml-1 text-[10px] font-semibold ${feeDiff < 0 ? "text-emerald-600" : "text-amber-600"}`}>
                          ({feeDiff < 0 ? `-${formatCurrency(Math.abs(feeDiff))}` : `+${formatCurrency(feeDiff)}`})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Avg Package Comparison */}
                  {peerAvgPackage > 0 && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Avg CTC:</span>
                      <div className="text-right">
                        <span className="font-bold text-blue-800">{formatPackage(peerAvgPackage)}</span>
                        {pkgDiff !== 0 && currentAvgPackage > 0 && (
                          <span className={`ml-1 text-[10px] font-semibold ${pkgDiff > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                            ({pkgDiff > 0 ? `+${pkgDiff.toFixed(1)} LPA` : `${pkgDiff.toFixed(1)} LPA`})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Student Rating:</span>
                    <span className="font-bold text-amber-800 flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {peer.rating.toFixed(1)} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* 1-Click Compare Action */}
              <Link href={`/compare?ids=${currentCollege.id},${peer.id}`} className="w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs font-semibold gap-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 border-slate-200 shadow-2xs"
                >
                  <Scale className="h-3.5 w-3.5 text-blue-600" />
                  <span>Compare Head-to-Head</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
