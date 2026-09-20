"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, CheckCircle2 } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How accurate are the admission rank predictions and closing cutoffs?",
    answer: "Our predictor analyzes multi-year JoSAA, CSAB, and State Counseling opening/closing rank distributions, accounting for Home State / Other State quotas and reservation categories to calculate High, Medium, and Safe admission probabilities.",
    category: "Admissions & Predictor",
  },
  {
    question: "Where does the placement CTC and salary data originate?",
    answer: "All placement statistics, average CTCs, highest packages, and top recruiters are sourced directly from verified NIRF mandatory disclosures, official university placement cell reports, and verified alumni reviews.",
    category: "Placements & Data",
  },
  {
    question: "How does the side-by-side college comparison matrix work?",
    answer: "You can select 2 to 3 colleges from any directory card or search bar. The tool generates an exhaustive side-by-side matrix comparing NIRF rank, annual tuition, 5-year ROI multiplier, top recruiters, amenities, and accepted exams with 1-click CSV export.",
    category: "Comparison Tool",
  },
  {
    question: "Is the interactive Degree ROI Calculator customizable?",
    answer: "Yes! You can adjust course duration (1-6 years), annual tuition, living & hostel expenses, scholarships (0-100%), starting salary CTC, and expected annual hike percentages to compute your exact break-even timeline and 5-year wealth creation.",
    category: "Financial Planning",
  },
  {
    question: "Can I export my shortlisted colleges and share comparisons with counselors?",
    answer: "Absolutely. You can download your full shortlisted wishlist or comparison matrices as standard CSV spreadsheets, or use the 1-click share button to generate a direct link for parents and counselors.",
    category: "Features & Sharing",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
          <HelpCircle className="h-3.5 w-3.5" />
          Got Questions? We Have Answers
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Learn how our platform helps students and parents make data-backed college decisions.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? "border-blue-300 bg-white shadow-md ring-1 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {faq.category}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`p-2 rounded-full transition-transform shrink-0 ${
                    isOpen ? "bg-blue-100 text-blue-700 rotate-180" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{faq.answer}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
