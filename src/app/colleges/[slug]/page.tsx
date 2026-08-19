import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatPackage } from "@/lib/utils";
import { Star, MapPin, Building2, Globe, Award, CheckCircle2, TrendingUp, IndianRupee, ArrowLeft, BookOpen, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveButton } from "@/components/college/SaveButton";
import { ReviewSection } from "@/components/college/ReviewSection";

export const dynamic = "force-dynamic";

interface CollegeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollegeDetailPage({ params }: CollegeDetailPageProps) {
  const { slug } = await params;

  let college: any = null;

  try {
    college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: { orderBy: { type: "asc" } },
        placements: { orderBy: { year: "desc" } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: true, savedBy: true } },
      },
    });
  } catch (e) {
    console.warn("DB notice during build/init", e);
  }

  if (!college) {
    notFound();
  }

  const latestPlacement = college.placements[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link href="/colleges" className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-blue-600">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to All Colleges
      </Link>

      {/* College Header Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {college.ranking ? (
                <Badge variant="default" className="bg-blue-600 text-white font-bold gap-1">
                  <Award className="h-3.5 w-3.5" />
                  NIRF #{college.ranking} Rank
                </Badge>
              ) : null}
              <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold">
                {college.type} Institute
              </Badge>
              {college.approvals?.map((appr: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {appr}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {college.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="h-4 w-4 text-blue-600" />
                {college.location}, {college.state}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="h-4 w-4 text-gray-500" />
                Estd. {college.establishedYear}
              </span>
              {college.website ? (
                <>
                  <span>•</span>
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
                  >
                    <Globe className="h-4 w-4" />
                    Official Website
                  </a>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start">
            <SaveButton collegeId={college.id} />
          </div>
        </div>

        {/* Top Summary Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">Student Rating</span>
            <div className="flex items-center gap-1.5 mt-0.5 font-bold text-gray-900 text-lg">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span>{college.rating.toFixed(1)} / 5.0</span>
            </div>
            <span className="text-[11px] text-gray-400">Based on {college._count.reviews} reviews</span>
          </div>

          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">Annual Tuition Fees</span>
            <div className="font-bold text-gray-900 text-lg flex items-center mt-0.5">
              <IndianRupee className="h-4 w-4 text-gray-700" />
              {formatCurrency(college.minFees)} / yr
            </div>
            <span className="text-[11px] text-gray-400">Up to {formatCurrency(college.maxFees)}</span>
          </div>

          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">Average Placement</span>
            <div className="font-bold text-blue-700 text-lg mt-0.5">
              {latestPlacement ? formatPackage(latestPlacement.averagePackage) : "N/A"}
            </div>
            <span className="text-[11px] text-gray-400">{latestPlacement?.year || 2024} Drive Batch</span>
          </div>

          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">Highest Package</span>
            <div className="font-bold text-emerald-700 text-lg mt-0.5">
              {latestPlacement ? formatPackage(latestPlacement.highestPackage) : "N/A"}
            </div>
            <span className="text-[11px] text-gray-400">{latestPlacement ? `${latestPlacement.placementRate}% Placed` : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Deep Features */}
      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList className="w-full sm:w-auto bg-white border border-gray-200 p-1.5 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="px-5 py-2.5 text-sm font-semibold rounded-lg">
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="px-5 py-2.5 text-sm font-semibold rounded-lg">
            Courses & Fees ({college.courses.length})
          </TabsTrigger>
          <TabsTrigger value="placements" className="px-5 py-2.5 text-sm font-semibold rounded-lg">
            Placements & Salary
          </TabsTrigger>
          <TabsTrigger value="reviews" className="px-5 py-2.5 text-sm font-semibold rounded-lg">
            Reviews ({college._count.reviews})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-gray-900">About {college.name}</h3>
            <p className="text-gray-700 leading-relaxed font-normal">{college.description}</p>
          </div>
        </TabsContent>

        {/* Tab 2: Courses */}
        <TabsContent value="courses">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 overflow-x-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Offered Academic Programs
            </h3>

            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase font-bold text-gray-500 tracking-wider">
                  <th className="p-3.5">Course Name</th>
                  <th className="p-3.5">Degree Level</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Annual Tuition Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {college.courses?.map((course: any) => (
                  <tr key={course.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3.5 font-bold text-gray-900">{course.name}</td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-xs">
                        {course.type}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-gray-600">{course.duration}</td>
                    <td className="p-3.5 font-bold text-gray-900">{formatCurrency(course.fees)} / yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 3: Placements */}
        <TabsContent value="placements">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Campus Placement Statistics
            </h3>

            {latestPlacement ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                    <span className="block text-xs font-semibold text-blue-600 uppercase">Average CTC</span>
                    <span className="text-2xl font-black text-blue-900 mt-1 block">
                      {formatPackage(latestPlacement.averagePackage)}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                    <span className="block text-xs font-semibold text-emerald-600 uppercase">Highest CTC</span>
                    <span className="text-2xl font-black text-emerald-900 mt-1 block">
                      {formatPackage(latestPlacement.highestPackage)}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center">
                    <span className="block text-xs font-semibold text-purple-600 uppercase">Placement Success</span>
                    <span className="text-2xl font-black text-purple-900 mt-1 block">
                      {latestPlacement.placementRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-3">Top Corporate Recruiters</h4>
                  <div className="flex flex-wrap gap-2">
                    {latestPlacement.topRecruiters?.map((company: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800 border border-gray-200"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Placement data currently being updated for this institution.</p>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: Reviews */}
        <TabsContent value="reviews">
          <ReviewSection collegeSlug={college.slug} initialReviews={college.reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
