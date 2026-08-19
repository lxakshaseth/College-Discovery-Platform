import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as { id: string }).id;

    // Check if matching by saved item id or collegeId
    const existing = await prisma.savedCollege.findFirst({
      where: {
        userId,
        OR: [{ id }, { collegeId: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Saved college not found" }, { status: 404 });
    }

    await prisma.savedCollege.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ message: "Removed successfully", id: existing.id });
  } catch (error) {
    console.error("Delete saved college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
