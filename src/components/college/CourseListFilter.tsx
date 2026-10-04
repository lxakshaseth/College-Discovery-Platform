"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, Sparkles, Filter, Download, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface CourseItem {
  id: string;
  name: string;
  type: string;
  duration: string;
  fees: number;
}

interface CourseListFilterProps {
  courses: CourseItem[];
  collegeSlug: string;
  primaryExam?: string;
  collegeState?: string;
}

export function CourseListFilter({ courses, collegeSlug, primaryExam = "JEE Main", collegeState = "" }: CourseListFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"default" | "fees_asc" | "fees_desc" | "name" | "duration">("default");

  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(courses.map((c) => c.type).filter(Boolean)));
    return ["ALL", ...types];
  }, [courses]);

  const exportCoursesCSV = () => {
    if (typeof window === "undefined" || courses.length === 0) return;

    const headers = ["Program Name", "Degree Level", "Duration", "Annual Tuition Fee (₹)", "Total Estimated Fees (₹)"];
    const rows = filteredCourses.map((c) => {
      const durationYears = parseInt(c.duration) || (c.type === "UG" ? 4 : 2);
      const totalEstimatedFees = c.fees * durationYears;
      return [
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.type}"`,
        `"${c.duration}"`,
        `"${c.fees}"`,
        `"${totalEstimatedFees}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${collegeSlug}_courses_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredCourses = useMemo(() => {
    let list = courses.filter((course) => {
      const matchesSearch = !search.trim() || course.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === "ALL" || course.type.toUpperCase() === selectedType.toUpperCase();
      return matchesSearch && matchesType;
    });

    return list.sort((a, b) => {
      if (sortBy === "fees_asc") return a.fees - b.fees;
      if (sortBy === "fees_desc") return b.fees - a.fees;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "duration") return parseInt(b.duration || "0") - parseInt(a.duration || "0");
      return 0;
    });
  }, [courses, search, selectedType, sortBy]);

  const avgAnnualFees = useMemo(() => {
    if (filteredCourses.length === 0) return 0;
    const total = filteredCourses.reduce((acc, c) => acc + (c.fees || 0), 0);
    return Math.round(total / filteredCourses.length);
  }, [filteredCourses]);

  return (
    <div className="space-y-4">
      {/* Search and Type Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search programs (e.g. Computer Science, MBA)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-white border-slate-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Degree Level Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Degree:
            </span>
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {type === "ALL" ? "All" : type}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort courses by"
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer h-8"
            >
              <option value="default">Default Order</option>
              <option value="fees_asc">Lowest Fees</option>
              <option value="fees_desc">Highest Fees</option>
              <option value="name">Name (A-Z)</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>

          {/* Export CSV Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportCoursesCSV}
            className="h-8 text-xs font-semibold gap-1 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shrink-0"
            title="Download programs curriculum and fees matrix as CSV spreadsheet"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Results Count & Avg Tuition Strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>
            Showing <span className="font-bold text-slate-900">{filteredCourses.length}</span> of {courses.length} academic programs
          </span>
          {avgAnnualFees > 0 && (
            <span className="text-[11px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
              Avg Tuition: {formatCurrency(avgAnnualFees)} / yr
            </span>
          )}
        </div>
        {(search || selectedType !== "ALL" || sortBy !== "default") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedType("ALL");
              setSortBy("default");
            }}
            className="text-blue-600 hover:underline font-semibold text-[11px]"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Courses Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
        {filteredCourses.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <BookOpen className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No matching programs found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or degree level filter.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="p-3.5">Program Name</th>
                <th className="p-3.5">Degree Level</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Annual Tuition</th>
                <th className="p-3.5">Total Estimated Fees</th>
                <th className="p-3.5 text-right">Admission Shortcut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCourses.map((course) => {
                const durationYears = parseInt(course.duration) || (course.type === "UG" ? 4 : 2);
                const totalEstimatedFees = course.fees * durationYears;

                return (
                  <tr key={course.id} className="hover:bg-blue-50/30 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{course.name}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-xs font-semibold bg-slate-50">
                        {course.type}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-slate-600 text-xs font-medium">{course.duration}</td>
                    <td className="p-3.5 font-bold text-slate-900 text-xs">
                      {formatCurrency(course.fees)} <span className="text-slate-400 font-normal">/ yr</span>
                    </td>
                    <td className="p-3.5 font-bold text-blue-700 text-xs">
                      {formatCurrency(totalEstimatedFees)}
                      <span className="text-[10px] font-normal text-slate-400 block">
                        ({durationYears} yrs program)
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/predictor?exam=${encodeURIComponent(primaryExam)}&homeState=${encodeURIComponent(collegeState)}`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1 px-2.5"
                        >
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          Predict
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
