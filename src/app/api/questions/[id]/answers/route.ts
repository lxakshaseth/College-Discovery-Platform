import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const createAnswerSchema = z.object({
  content: z.string().min(5, "Answer must be at least 5 characters").max(3000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { id: questionId } = await params;
    const body = await req.json();
    const parsed = createAnswerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const userId = (session.user as { id: string }).id;

    const answer = await prisma.answer.create({
      data: {
        questionId,
        userId,
        content: parsed.data.content,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error("Create answer error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
