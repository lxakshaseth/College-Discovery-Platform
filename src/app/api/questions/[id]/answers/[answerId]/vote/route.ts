import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answerId } = await params;

    const answer = await prisma.answer.update({
      where: { id: answerId },
      data: {
        upvotes: { increment: 1 },
      },
    });

    return NextResponse.json({ upvotes: answer.upvotes });
  } catch (error) {
    console.error("Upvote answer error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
