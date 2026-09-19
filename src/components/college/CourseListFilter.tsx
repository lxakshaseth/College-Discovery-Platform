"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, Sparkles, Filter } from "lucide-react";
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

  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(courses.map((c) => c.type).filter(Boolean)));
    return ["ALL", ...types];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = !search.trim() || course.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === "ALL" || course.type.toUpperCase() === selectedType.toUpperCase();
      return matchesSearch && matchesType;
    });
  }, [courses, search, selectedType]);

  return (
    <div className="space-y-4">
      {/* Search and Type Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search programs (e.g. Computer Science, MBA)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-white border-slate-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Degree Level:
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
              {type === "ALL" ? "All Programs" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <span className="font-bold text-slate-900">{filteredCourses.length}</span> of {courses.length} academic programs
        </span>
        {(search || selectedType !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedType("ALL");
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
