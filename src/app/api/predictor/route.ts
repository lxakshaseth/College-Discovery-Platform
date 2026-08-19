import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const exam = searchParams.get("exam") || "JEE Main";
    const rank = parseInt(searchParams.get("rank") || "10000");

    if (isNaN(rank) || rank <= 0) {
      return NextResponse.json({ error: "Valid positive rank is required" }, { status: 400 });
    }

    // Dynamic rank tier matching based on NIRF ranking & college type
    // Top rank (<2500): Top IITs & NITs
    // Mid rank (2500 - 15000): Mid IITs, Top NITs, Top IIITs, BITS
    // Moderate rank (15000 - 50000): Mid NITs, Top Private (VIT, SRM, Thapar)
    // High rank (>50000): Deemed/Private Universities
    let whereClause = {};

    if (exam === "JEE Advanced") {
      if (rank <= 3000) {
        whereClause = { ranking: { lte: 10 }, type: "PUBLIC" };
      } else if (rank <= 10000) {
        whereClause = { type: "PUBLIC", name: { contains: "IIT" } };
      } else {
        whereClause = { type: "PUBLIC" };
      }
    } else if (exam === "JEE Main") {
      if (rank <= 5000) {
        whereClause = { ranking: { lte: 15 } };
      } else if (rank <= 25000) {
        whereClause = { OR: [{ type: "PUBLIC" }, { name: { contains: "NIT" } }, { name: { contains: "IIIT" } }] };
      } else if (rank <= 75000) {
        whereClause = { minFees: { lte: 400000 } };
      } else {
        whereClause = {};
      }
    } else {
      whereClause = {};
    }

    const colleges = await prisma.college.findMany({
      where: whereClause,
      take: 12,
      orderBy: { rating: "desc" },
      include: {
        courses: { take: 3 },
        placements: { take: 1, orderBy: { year: "desc" } },
        _count: { select: { reviews: true } },
      },
    });

    const results = colleges.map((college) => {
      let admissionChance: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
      const collegeRankEst = (college.ranking || 30) * 800;

      if (rank <= collegeRankEst * 0.8) {
        admissionChance = "HIGH";
      } else if (rank <= collegeRankEst * 1.3) {
        admissionChance = "MEDIUM";
      } else {
        admissionChance = "LOW";
      }

      return {
        ...college,
        matchDetails: {
          exam,
          userRank: rank,
          cutoffEstimate: Math.round(collegeRankEst * 1.1),
          admissionChance,
        },
      };
    });

    return NextResponse.json({
      exam,
      userRank: rank,
      totalRecommendations: results.length,
      recommendations: results,
    });
  } catch (error) {
    console.error("Predictor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
