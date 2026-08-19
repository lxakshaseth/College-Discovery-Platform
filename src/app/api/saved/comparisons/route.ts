import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { saveComparisonSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const savedComparisons = await prisma.savedComparison.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Populate college details for each saved comparison
    const populated = await Promise.all(
      savedComparisons.map(async (comp) => {
        const colleges = await prisma.college.findMany({
          where: { id: { in: comp.collegeIds } },
          select: {
            id: true,
            name: true,
            slug: true,
            location: true,
            state: true,
            type: true,
            rating: true,
            minFees: true,
            maxFees: true,
          },
        });
        return {
          ...comp,
          colleges,
        };
      })
    );

    return NextResponse.json(populated);
  } catch (error) {
    console.error("Saved comparisons fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = saveComparisonSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;
    const { name, collegeIds } = parsed.data;

    const comparison = await prisma.savedComparison.create({
      data: {
        userId,
        name,
        collegeIds,
      },
    });

    return NextResponse.json(comparison, { status: 201 });
  } catch (error) {
    console.error("Save comparison error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
