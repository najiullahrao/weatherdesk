import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all locations for the authenticated user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const locations = await prisma.location.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json(locations);
}

// POST create a new location for the authenticated user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { city, country, isPrimary } = await req.json();
  if (!city || !country) {
    return NextResponse.json({ error: "City and country are required" }, { status: 400 });
  }
  const location = await prisma.location.create({
    data: {
      city,
      country,
      isPrimary: !!isPrimary,
      user: { connect: { id: session.user.id } },
    },
  });
  return NextResponse.json(location);
} 