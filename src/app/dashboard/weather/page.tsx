"use client";
import { useEffect, useState } from "react";
import WeatherCard from "@/components/WeatherCard";
import Loader from "@/components/Loader";

export default function WeatherPage() {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Your Weather Dashboard</h1>
        <div className="flex flex-wrap gap-6 justify-center">
          {weatherList.map((data: any) => (
            <WeatherCard key={data.id} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
}
