"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CollegeListItem } from "@/types";

interface CompareContextType {
  compareList: CollegeListItem[];
  addToCompare: (college: CollegeListItem) => boolean;
  removeFromCompare: (collegeId: string) => void;
  clearCompare: () => void;
  isInCompare: (collegeId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<CollegeListItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("college_compare_list");
      if (saved) {
        setCompareList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load compare items", e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("college_compare_list", JSON.stringify(compareList));
    } catch (e) {
      console.error("Failed to save compare items", e);
    }
  }, [compareList]);

  const addToCompare = (college: CollegeListItem): boolean => {
    if (compareList.length >= 3) {
      return false; // Max 3 allowed
    }
    if (!compareList.some((c) => c.id === college.id)) {
      setCompareList((prev) => [...prev, college]);
      return true;
    }
    return true;
  };

  const removeFromCompare = (collegeId: string) => {
    setCompareList((prev) => prev.filter((c) => c.id !== collegeId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (collegeId: string) => {
    return compareList.some((c) => c.id === collegeId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
