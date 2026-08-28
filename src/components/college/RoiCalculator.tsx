"use client";

import { useState } from "react";
import { Calculator, TrendingUp, DollarSign, Clock, Award, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatPackage } from "@/lib/utils";

interface RoiCalculatorProps {
  minFees: number;
  averagePackage: number;
  highestPackage: number;
  collegeName: string;
}

export function RoiCalculator({
  minFees,
  averagePackage,
  highestPackage,
  collegeName,
}: RoiCalculatorProps) {
  const [durationYears, setDurationYears] = useState(4);
  const [annualTuition, setAnnualTuition] = useState(minFees || 150000);
  const [annualLivingCost, setAnnualLivingCost] = useState(120000);
  const [scholarshipPercent, setScholarshipPercent] = useState(0);

  const effectiveAnnualTuition = annualTuition * (1 - scholarshipPercent / 100);
  const totalTuitionCost = effectiveAnnualTuition * durationYears;
  const totalLivingCost = annualLivingCost * durationYears;
  const totalInvestment = totalTuitionCost + totalLivingCost;

  // Placement CTC in Rupees
  const avgSalaryRupees = (averagePackage || 6.5) * 100000;
  // Estimated in-hand net annual salary ~80% of CTC
  const estimatedInHandSalary = avgSalaryRupees * 0.8;

  // Payback period in years
  const paybackYears = estimatedInHandSalary > 0 ? (totalInvestment / estimatedInHandSalary).toFixed(1) : "N/A";
  
  // 5-Year Net ROI Multiple = (5 * InHand - Investment) / Investment * 100
  const fiveYearEarnings = estimatedInHandSalary * 5;
  const roiMultiplier = totalInvestment > 0 ? (fiveYearEarnings / totalInvestment).toFixed(1) : "0";

  return (
    <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-blue-100 bg-white/70 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600 text-white">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Interactive ROI & Degree Cost Estimator
            </CardTitle>
            <p className="text-xs text-slate-500">
              Calculate total 4-year expenditure vs expected salary return for {collegeName}.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Course Duration (Years)</Label>
            <Input
              type="number"
              min={1}
              max={6}
              value={durationYears}
              onChange={(e) => setDurationYears(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-white text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Annual Tuition Fee (₹)</Label>
            <Input
              type="number"
              step={5000}
              min={0}
              value={annualTuition}
              onChange={(e) => setAnnualTuition(Math.max(0, parseInt(e.target.value) || 0))}
              className="bg-white text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Annual Hostel & Living (₹)</Label>
            <Input
              type="number"
              step={5000}
              min={0}
              value={annualLivingCost}
              onChange={(e) => setAnnualLivingCost(Math.max(0, parseInt(e.target.value) || 0))}
              className="bg-white text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Scholarship / Fee Waiver (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={scholarshipPercent}
              onChange={(e) => setScholarshipPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              className="bg-white text-sm"
            />
          </div>
        </div>

        {/* Results Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Card 1: Total Investment */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Total {durationYears}-Year Investment</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {formatCurrency(totalInvestment)}
            </div>
            <p className="text-[11px] text-slate-500">
              Tuition ({formatCurrency(totalTuitionCost)}) + Living ({formatCurrency(totalLivingCost)})
            </p>
          </div>

          {/* Card 2: Estimated Payback Time */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1 shadow-sm">
            <span className="text-xs font-medium text-emerald-800 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Payback Duration
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700">
              ~{paybackYears} {parseFloat(paybackYears) === 1 ? "Year" : "Years"}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              Based on {formatPackage(averagePackage || 6.5)} avg CTC
            </p>
          </div>

          {/* Card 3: 5-Year ROI Return */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-1 shadow-sm">
            <span className="text-xs font-medium text-indigo-800 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              5-Year Wealth Multiplier
            </span>
            <div className="text-xl sm:text-2xl font-black text-indigo-700">
              {roiMultiplier}x Return
            </div>
            <p className="text-[11px] text-indigo-600 font-medium">
              ~{formatCurrency(fiveYearEarnings)} 5-yr estimated earnings
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
