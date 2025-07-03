"use client";
import { useEffect, useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function WeatherPage() {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    fetch("/api/weather")
      .then((res) => res.json())
      .then(setWeatherList)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        <Loader />
      </div>
    );
  }

  // Use session subscriptionStatus for premium check
  const isPremium = session?.user?.subscriptionStatus === "active";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white p-4 relative overflow-hidden">
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="opacity-10 animate-pulse">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#60a5fa" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-800 mb-8 text-center">
          <FaMapMarkerAlt color="#60a5fa" size={28} />
          Your Weather Dashboard
        </h1>
        {/* Premium info banner */}
        <div className="mb-6">
          {isPremium ? (
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-200 via-blue-100 to-yellow-100 border border-yellow-300 rounded-xl px-4 py-3 text-yellow-900 font-semibold shadow">
              <span className="bg-gradient-to-r from-blue-400 to-yellow-300 text-white px-3 py-1 rounded-full font-bold text-xs">Premium</span>
              You have access to extended 16-day forecasts and historical weather data!
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-100 to-yellow-100 border border-blue-200 rounded-xl px-4 py-3 text-blue-800 font-medium shadow">
              <span className="bg-blue-400 text-white px-3 py-1 rounded-full font-bold text-xs">Upgrade</span>
              Unlock 16-day forecasts and historical weather data with <Link href="/pricing" className="underline font-bold text-blue-700 hover:text-blue-900">Premium</Link>.
            </div>
          )}
        </div>
        {/* Weather cards or empty state */}
        {weatherList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-blue-400 animate-fade-in">
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 4.05l-.71-.71" />
            </svg>
            <p className="text-lg font-semibold mb-2">No weather data found</p>
            <p className="text-sm">Add a location to get started!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-8 justify-center animate-fade-in">
            {weatherList.map((data: any) => (
              <WeatherCard key={data.id} data={data} />
            ))}
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
