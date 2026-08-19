import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { saveCollegeSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            _count: {
              select: {
                reviews: true,
                courses: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Saved colleges fetch error:", error);
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
    const parsed = saveCollegeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;
    const { collegeId } = parsed.data;

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Upsert / save
    const saved = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
      update: {},
      create: {
        userId,
        collegeId,
      },
      include: {
        college: true,
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Save college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
