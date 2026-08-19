import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collegeSearchSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = collegeSearchSchema.safeParse(searchParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { q, state, type, minFees, maxFees, minRating, sortBy, sortOrder, page, limit } = parsed.data;

    // Build where clause
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

    if (minFees !== undefined || maxFees !== undefined) {
      if (minFees !== undefined) {
        where.minFees = { gte: minFees };
      }
      if (maxFees !== undefined) {
        where.maxFees = { lte: maxFees };
      }
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    // Build orderBy
    let orderBy: Prisma.CollegeOrderByWithRelationInput = { rating: "desc" };
    if (sortBy) {
      const order = sortOrder || "desc";
      switch (sortBy) {
        case "rating":
          orderBy = { rating: order };
          break;
        case "fees":
          orderBy = { minFees: order };
          break;
        case "name":
          orderBy = { name: order };
          break;
        case "ranking":
          orderBy = { ranking: order === "asc" ? "asc" : "desc" };
          break;
      }
    }

    const skip = (page - 1) * limit;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              reviews: true,
              courses: true,
            },
          },
        },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      data: colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("College listing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
