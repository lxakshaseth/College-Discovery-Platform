import Link from "next/link";
import { Search, Scale, Sparkles, Trophy, GraduationCap, Building2, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { CollegeCard } from "@/components/college/CollegeCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch top 6 NIRF ranked colleges for home highlight
  let topColleges: any[] = [];
  try {
    topColleges = await prisma.college.findMany({
      orderBy: { ranking: "asc" },
      take: 6,
      include: {
        _count: {
          select: { reviews: true, courses: true },
        },
      },
    });
  } catch (err) {
    console.warn("Database connection notice during build/init:", err);
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-semibold text-blue-200 border border-blue-400/30 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Discover • Compare • Decide with Confidence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Find Your Dream College in <span className="text-blue-400">India</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-blue-100 font-normal">
            Explore 50+ top IITs, NITs, BITS, and premier universities. Compare fees, verified placement stats, campus reviews, and predict your admission rank.
          </p>

          {/* Quick Search Card */}
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-3 sm:p-4 shadow-2xl text-slate-900 border border-blue-100 mt-8">
            <form action="/colleges" method="GET" className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search by college name, city (e.g. IIT Bombay, Mumbai, CSE)..."
                  className="w-full rounded-xl bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-12 rounded-xl shadow-md">
                Search
              </Button>
            </form>

            {/* Quick Filter Chips */}
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-gray-600 justify-center sm:justify-start px-1">
              <span className="font-semibold text-gray-500">Popular:</span>
              <Link href="/colleges?q=IIT" className="hover:text-blue-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium">IITs</Link>
              <Link href="/colleges?q=NIT" className="hover:text-blue-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium">NITs</Link>
              <Link href="/colleges?q=BITS" className="hover:text-blue-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium">BITS Pilani</Link>
              <Link href="/colleges?type=PUBLIC" className="hover:text-blue-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium">Govt Engineering</Link>
              <Link href="/colleges?state=Maharashtra" className="hover:text-blue-600 bg-gray-100 px-2.5 py-1 rounded-md font-medium">Maharashtra</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Stat Ribbon */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-white p-6 shadow-xl border border-gray-100 text-center">
          <div>
            <div className="text-3xl font-black text-blue-600">50+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Verified Colleges</div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-600">200+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Degree Programs</div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-600">₹1.68 Cr</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Highest Package</div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-600">4.8★</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Student Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Platform Feature Pillars</h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Everything you need to discover, research, and choose the right academic path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 transition space-y-3">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Advanced Listing & Filters</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Filter by location state, public vs private type, tuition fees range, minimum ratings, and NIRF rankings.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 transition space-y-3">
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Side-by-Side Comparison</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Select 2 to 3 colleges and compare fees, placement averages, NIRF rank, and top recruiters in a clean matrix.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 transition space-y-3">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Admission Rank Predictor</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Input your JEE Main or JEE Advanced rank to instantly see high, medium, and safe college match recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Top NIRF Colleges Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              Top NIRF Ranked Institutions
            </h2>
            <p className="text-xs text-gray-500 mt-1">Leading engineering and research colleges across India</p>
          </div>

          <Link href="/colleges">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50">
              View All 50+
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topColleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>

      {/* Rank Predictor Banner CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Matching Algorithm
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Know Your Admission Chances in Seconds
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Enter your JEE Main rank or percentile to generate a personalized list of recommended colleges with safety tier analysis.
            </p>
          </div>

          <Link href="/predictor">
            <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-8 h-14 rounded-2xl shadow-lg whitespace-nowrap">
              Try Predictor Tool
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
