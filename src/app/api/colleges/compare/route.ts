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

    if (collegeIds.length < 1 || collegeIds.length > 3) {
      return NextResponse.json(
        { error: "Please provide 1 to 3 college IDs for comparison" },
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

    if (colleges.length === 0) {
      return NextResponse.json(
        { error: "No matching colleges found" },
        { status: 404 }
      );
    }

    const formattedColleges = colleges.map((c) => ({
      ...c,
      approvals: typeof c.approvals === "string" ? JSON.parse(c.approvals || "[]") : c.approvals,
      placements: c.placements.map((p) => ({
        ...p,
        topRecruiters: typeof p.topRecruiters === "string" ? JSON.parse(p.topRecruiters || "[]") : p.topRecruiters,
      })),
    }));

    return NextResponse.json(formattedColleges);
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
