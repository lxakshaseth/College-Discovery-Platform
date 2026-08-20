import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const exam = searchParams.get("exam") || "JEE Main";
    const rank = parseInt(searchParams.get("rank") || "10000");
    const category = searchParams.get("category") || "GENERAL";
    const homeState = searchParams.get("homeState") || "";

    if (isNaN(rank) || rank <= 0) {
      return NextResponse.json({ error: "Valid positive rank is required" }, { status: 400 });
    }

    // Category multiplier factor (e.g. OBC/EWS/SC/ST have effectively higher opening rank thresholds)
    let categoryMultiplier = 1.0;
    if (category === "OBC_NCL" || category === "EWS") categoryMultiplier = 1.25;
    if (category === "SC") categoryMultiplier = 1.8;
    if (category === "ST") categoryMultiplier = 2.4;

    const adjustedRank = Math.round(rank / categoryMultiplier);

    let whereClause: any = {};

    if (exam === "JEE Advanced") {
      whereClause = {
        OR: [
          { name: { contains: "IIT" } },
          { type: "PUBLIC", ranking: { lte: 20 } },
        ],
      };
    } else if (exam === "BITSAT") {
      whereClause = {
        OR: [
          { name: { contains: "BITS" } },
          { type: { in: ["PRIVATE", "DEEMED"] } },
        ],
      };
    } else if (exam === "GATE") {
      whereClause = {
        courses: { some: { type: "PG" } },
      };
    } else if (exam === "CAT") {
      whereClause = {
        courses: { some: { name: { contains: "MBA" } } },
      };
    } else {
      // JEE Main
      whereClause = {};
    }

    const colleges = await prisma.college.findMany({
      where: whereClause,
      take: 24,
      orderBy: { ranking: "asc" },
      include: {
        courses: { take: 3 },
        placements: { take: 1, orderBy: { year: "desc" } },
        _count: { select: { reviews: true } },
      },
    });

    const results = colleges.map((college) => {
      let admissionChance: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
      const baseEstimate = (college.ranking || 25) * 850;
      const isHomeState = homeState && college.state.toLowerCase() === homeState.toLowerCase();
      const cutoffEstimate = Math.round(baseEstimate * (isHomeState ? 1.3 : 1.0) * categoryMultiplier);

      if (rank <= cutoffEstimate * 0.75) {
        admissionChance = "HIGH";
      } else if (rank <= cutoffEstimate * 1.2) {
        admissionChance = "MEDIUM";
      } else {
        admissionChance = "LOW";
      }

      return {
        ...college,
        matchDetails: {
          exam,
          userRank: rank,
          category,
          isHomeState,
          cutoffEstimate,
          admissionChance,
        },
      };
    });

    return NextResponse.json({
      exam,
      userRank: rank,
      category,
      totalRecommendations: results.length,
      recommendations: results,
    });
  } catch (error) {
    console.error("Predictor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
