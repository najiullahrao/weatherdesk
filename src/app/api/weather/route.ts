import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentWeather, get5DayForecast, get16DayForecast, getHistoricalWeather } from "@/lib/weather";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: { locations: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isPremium = user.subscriptionStatus === "active";

  const weatherData = await Promise.all(
    user.locations.map(async (loc: { id: string; city: string; country: string }) => {
      const current = await getCurrentWeather(loc.city);
      const forecast = await get5DayForecast(loc.city);
      let extendedForecast = undefined;
      let historicalData = undefined;
      if (isPremium) {
        try {
          extendedForecast = await get16DayForecast(loc.city);
        } catch {}
        try {
          // For demo: get yesterday's weather for the city (requires lat/lon)
          const lat = current.coord.lat;
          const lon = current.coord.lon;
          const yesterday = Math.floor(Date.now() / 1000) - 86400;
          historicalData = await getHistoricalWeather(lat, lon, yesterday);
        } catch {}
      }
      return {
        id: loc.id,
        city: loc.city,
        country: loc.country,
        current,
        forecast,
        extendedForecast,
        historicalData,
        premium: isPremium,
      };
    })
  );

  return NextResponse.json(weatherData);
}
