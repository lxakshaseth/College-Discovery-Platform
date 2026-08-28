import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatPackage, safeJsonParse } from "@/lib/utils";
import { Star, MapPin, Building2, Globe, Award, CheckCircle2, TrendingUp, IndianRupee, ArrowLeft, BookOpen, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveButton } from "@/components/college/SaveButton";
import { ReviewSection } from "@/components/college/ReviewSection";
import { RoiCalculator } from "@/components/college/RoiCalculator";
import { ShareCollegeButton } from "@/components/college/ShareCollegeButton";

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
        questions: {
          include: {
            user: { select: { id: true, name: true, image: true } },
            answers: {
              include: { user: { select: { id: true, name: true, image: true } } },
              orderBy: { upvotes: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: true, savedBy: true, questions: true } },
      },
    });
  } catch (e) {
    console.warn("DB notice during build/init", e);
  }

  if (!college) {
    notFound();
  }

  const latestPlacement = college.placements[0];
  const approvals: string[] = safeJsonParse<string[]>(college.approvals, []);
  const facilities: string[] = safeJsonParse<string[]>(college.facilities, []);
  const examsAccepted: string[] = safeJsonParse<string[]>(college.examsAccepted, []);
  const topRecruiters: string[] = latestPlacement
    ? safeJsonParse<string[]>(latestPlacement.topRecruiters, [])
    : [];

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
              {approvals.map((appr: string, idx: number) => (
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

          <div className="flex items-center gap-2 self-start">
            <ShareCollegeButton collegeName={college.name} />
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
        <TabsList className="w-full sm:w-auto bg-white border border-slate-200 p-1.5 rounded-xl h-auto flex flex-wrap gap-1">
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
          <TabsTrigger value="discussions" className="px-5 py-2.5 text-sm font-semibold rounded-lg">
            Q&A Forum ({college.questions?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">About {college.name}</h3>
              <p className="text-slate-700 leading-relaxed font-normal">{college.description}</p>
            </div>

            {/* Accepted Entrance Exams */}
            {examsAccepted.length > 0 && (
              <div className="rounded-xl bg-slate-50 p-5 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Entrance Exams Accepted for Admissions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {examsAccepted.map((exam: string, idx: number) => (
                    <Badge key={idx} variant="default" className="bg-blue-600 text-white font-semibold text-xs px-3 py-1">
                      {exam}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Campus Facilities & Infrastructure */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Campus Amenities & Facilities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(facilities.length > 0 ? facilities : [
                  "Wi-Fi Campus", "Central Library", "Hostels", "Sports Complex",
                  "Incubation Cell", "Computer Labs", "Cafeteria", "Medical Center"
                ]).map((fac: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Courses */}
        <TabsContent value="courses">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 overflow-x-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Offered Academic Programs & Tuition
            </h3>

            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase font-bold text-slate-500 tracking-wider">
                  <th className="p-3.5">Course Name</th>
                  <th className="p-3.5">Degree Level</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Annual Tuition Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {college.courses?.map((course: any) => (
                  <tr key={course.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3.5 font-bold text-slate-900">{course.name}</td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-xs font-semibold">
                        {course.type}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-slate-600">{course.duration}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(course.fees)} / yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 3: Placements */}
        <TabsContent value="placements">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Campus Placement Statistics & Records
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
                  <h4 className="font-bold text-sm text-slate-900 mb-3">Top Corporate Recruiters</h4>
                  <div className="flex flex-wrap gap-2">
                    {topRecruiters.map((company: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <RoiCalculator
                    minFees={college.minFees}
                    averagePackage={latestPlacement?.averagePackage || 6.5}
                    highestPackage={latestPlacement?.highestPackage || 12.0}
                    collegeName={college.name}
                  />
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Placement data currently being updated for this institution.</p>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: Reviews */}
        <TabsContent value="reviews">
          <ReviewSection collegeSlug={college.slug} initialReviews={college.reviews} />
        </TabsContent>

        {/* Tab 5: Community Q&A */}
        <TabsContent value="discussions">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Community Q&A for {college.name}
                </h3>
                <p className="text-xs text-slate-500">Ask senior students and alumni about life and admissions at this campus.</p>
              </div>

              <Link href="/discussions">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5">
                  Ask Question on Forum
                </Button>
              </Link>
            </div>

            {college.questions && college.questions.length > 0 ? (
              <div className="space-y-4">
                {college.questions.map((q: any) => (
                  <div key={q.id} className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{q.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        {new Date(q.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{q.content}</p>

                    {q.answers && q.answers.length > 0 && (
                      <div className="pl-3 border-l-2 border-blue-400 space-y-2 pt-1">
                        <div className="text-[11px] font-bold text-blue-800">
                          Answer by {q.answers[0].user?.name || "Student"}:
                        </div>
                        <p className="text-xs text-slate-700">{q.answers[0].content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <p className="text-sm">No questions asked yet for this college.</p>
                <Link href="/discussions">
                  <Button size="sm" variant="outline" className="text-xs font-semibold">
                    Be the First to Ask a Question
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
