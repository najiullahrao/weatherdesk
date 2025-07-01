import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = params;
  // Only allow deleting locations belonging to the user
  const location = await prisma.location.findUnique({ where: { id } });
  if (!location || location.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }
  await prisma.location.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 