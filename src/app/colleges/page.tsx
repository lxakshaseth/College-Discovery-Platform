import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CollegeFilters } from "@/components/college/CollegeFilters";
import { CollegeListContainer } from "@/components/college/CollegeListContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

interface CollegesPageProps {
  searchParams: Promise<{
    q?: string;
    state?: string;
    type?: string;
    minRating?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function CollegesPage({ searchParams }: CollegesPageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const state = params.state && params.state !== "ALL" ? params.state : "";
  const type = params.type && params.type !== "ALL" ? (params.type as "PUBLIC" | "PRIVATE" | "DEEMED") : undefined;
  const parsedMinRating = params.minRating && params.minRating !== "ALL" ? parseFloat(params.minRating) : NaN;
  const minRating = !isNaN(parsedMinRating) ? parsedMinRating : undefined;
  const sortBy = params.sortBy || "rating";
  const page = Math.max(1, parseInt(params.page || "1") || 1);
  const limit = 12;

  // Construct Prisma query filter
  const where: Prisma.CollegeWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { location: { contains: q } },
      { state: { contains: q } },
    ];
  }

  if (state) {
    where.state = { equals: state };
  }

  if (type) {
    where.type = type;
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: "desc" };
  if (sortBy === "ranking") {
    orderBy = { ranking: "asc" };
  } else if (sortBy === "fees") {
    orderBy = { minFees: "asc" };
  } else if (sortBy === "name") {
    orderBy = { name: "asc" };
  }

  const skip = (page - 1) * limit;

  let colleges: any[] = [];
  let total = 0;

  try {
    const [fetchedColleges, fetchedTotal] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          placements: { take: 1, orderBy: { year: "desc" } },
          _count: {
            select: { reviews: true, courses: true },
          },
        },
      }),
      prisma.college.count({ where }),
    ]);
    colleges = fetchedColleges;
    total = fetchedTotal;
  } catch (e) {
    console.warn("DB notice during build/init", e);
  }

  const totalPages = Math.ceil(total / limit) || 1;

  // Build Pagination helper link
  const buildPageUrl = (pageNum: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (state) p.set("state", state);
    if (type) p.set("type", type);
    if (minRating) p.set("minRating", minRating.toString());
    if (sortBy) p.set("sortBy", sortBy);
    p.set("page", pageNum.toString());
    return `/colleges?${p.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Colleges & Universities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Found <span className="font-bold text-slate-900">{total}</span> colleges matching your query filter.
          </p>
        </div>
      </div>

      {/* Main Listing Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
            <CollegeFilters />
          </Suspense>
        </div>

        {/* Colleges Results Grid / Table View */}
        <div className="lg:col-span-3 space-y-8">
          {colleges.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
              <SlidersHorizontal className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No colleges matched your filters</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try expanding your state search or clearing your minimum rating filter to see more options.
              </p>
              <Link href="/colleges">
                <Button size="sm" variant="outline" className="mt-2 text-xs">
                  Clear All Filters
                </Button>
              </Link>
            </div>
          ) : (
            <CollegeListContainer colleges={colleges} total={total} />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2 pt-4">
              {page > 1 ? (
                <Link href={buildPageUrl(page - 1)}>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                </Link>
              ) : null}

              <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 px-3">
                Page {page} of {totalPages}
              </div>

              {page < totalPages ? (
                <Link href={buildPageUrl(page + 1)}>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
