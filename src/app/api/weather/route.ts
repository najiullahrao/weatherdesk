import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentWeather, get5DayForecast } from "@/lib/weather";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: { locations: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const weatherData = await Promise.all(
    user.locations.map(async (loc: { id: string; city: string; country: string }) => {
      const current = await getCurrentWeather(loc.city);
      const forecast = await get5DayForecast(loc.city);
      return {
        id: loc.id,
        city: loc.city,
        country: loc.country,
        current,
        forecast,
      };
    })
  );

  return NextResponse.json(weatherData);
}
