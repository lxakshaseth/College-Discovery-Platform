import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const createQuestionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters").max(2000),
  collegeId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const collegeId = searchParams.get("collegeId");
    const q = searchParams.get("q");

    const where: any = {};
    if (collegeId && collegeId !== "ALL") {
      where.collegeId = collegeId;
    }
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
        college: { select: { id: true, name: true, slug: true, location: true } },
        answers: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { upvotes: "desc" },
        },
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Questions fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;
    const { title, content, collegeId } = parsed.data;

    const question = await prisma.question.create({
      data: {
        title,
        content,
        collegeId: collegeId || null,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        college: { select: { id: true, name: true, slug: true, location: true } },
        answers: true,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
