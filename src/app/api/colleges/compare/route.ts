import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const ids = req.nextUrl.searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        { error: "College IDs are required. Use ?ids=id1,id2,id3" },
        { status: 400 }
      );
    }

    const collegeIds = ids.split(",").map((id) => id.trim()).filter(Boolean);

    if (collegeIds.length < 2 || collegeIds.length > 3) {
      return NextResponse.json(
        { error: "Please provide 2-3 college IDs for comparison" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      include: {
        courses: {
          orderBy: { type: "asc" },
        },
        placements: {
          orderBy: { year: "desc" },
          take: 2,
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (colleges.length !== collegeIds.length) {
      return NextResponse.json(
        { error: "One or more colleges not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(colleges);
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
