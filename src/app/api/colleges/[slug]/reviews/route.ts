import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const college = await prisma.college.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { collegeId: college.id },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where: { collegeId: college.id } }),
    ]);

    return NextResponse.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const userId = (session.user as { id: string }).id;

    const review = await prisma.review.create({
      data: {
        ...parsed.data,
        collegeId: college.id,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Update college average rating
    const avgResult = await prisma.review.aggregate({
      where: { collegeId: college.id },
      _avg: { rating: true },
    });

    if (avgResult._avg.rating) {
      await prisma.college.update({
        where: { id: college.id },
        data: { rating: Math.round(avgResult._avg.rating * 10) / 10 },
      });
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
