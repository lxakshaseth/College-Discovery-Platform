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

    const existing = await prisma.savedComparison.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
    }

    await prisma.savedComparison.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ message: "Removed successfully", id: existing.id });
  } catch (error) {
    console.error("Delete saved comparison error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
