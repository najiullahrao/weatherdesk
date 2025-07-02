"use client";
import { useState, useEffect } from "react";
import { Loader2, Sun, CloudRain, Cloud, CloudSnow, Wind, Calendar, MapPin, RefreshCw } from "lucide-react";

function getWeatherIcon(code: number, size: number = 32) {
  const iconProps = { size, className: "inline-block align-middle mr-1 drop-shadow" };
  if (code >= 200 && code < 300) return <CloudRain {...iconProps} />;
  if (code >= 300 && code < 600) return <CloudRain {...iconProps} />;
  if (code >= 600 && code < 700) return <CloudSnow {...iconProps} />;
  if (code >= 700 && code < 800) return <Wind {...iconProps} />;
  if (code === 800) return <Sun {...iconProps} />;
  if (code > 800) return <Cloud {...iconProps} />;
  return <Sun {...iconProps} />;
}

function groupForecastByDay(forecastList: any[]) {
  const days: Record<string, any[]> = {};
  forecastList.forEach((item: any) => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });
  return Object.entries(days).slice(0, 5); // Only 5 days
}

export default function Dashboard() {
  const [currentWeather, setCurrentWeather] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ city: string; country: string }>({ city: "", country: "" });
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY || '';
      const resCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const resForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      if (!resCurrent.ok || !resForecast.ok) throw new Error("Failed to fetch weather data");
      const current = await resCurrent.json();
      const forecastData = await resForecast.json();
      setCurrentWeather(current);
      setForecast(forecastData.list);
      setLocation({ city: current.name, country: current.sys.country });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getAndFetchWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError("Location access denied or unavailable.");
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAndFetchWeather();
    // eslint-disable-next-line
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getAndFetchWeather();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        <div className="text-center text-blue-700">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white">
        <div className="text-center text-blue-700 max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-lg p-6 border border-red-200">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors duration-200 text-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Today's weather (current)
  const today = currentWeather;
  // 5-day forecast (grouped by day)
  const forecastByDay = groupForecastByDay(forecast);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 text-center flex-1">Weather in Your Current Location</h1>
          <button
            onClick={handleRefresh}
            className={`ml-0 md:ml-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors shadow ${refreshing ? "animate-spin" : ""}`}
            title="Refresh Weather"
            aria-label="Refresh Weather"
          >
            <RefreshCw className="w-6 h-6 text-blue-500" />
          </button>
        </div>
        <div className="text-right text-xs text-blue-400 mb-2">Location accuracy depends on your device/browser.</div>
        {/* Today's Weather Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center gap-8 border border-blue-100">
          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold text-blue-800 drop-shadow">{location.city}, {location.country}</span>
            </div>
            <div className="flex items-center gap-4 mb-2">
              {getWeatherIcon(today.weather[0].id, 56)}
              <span className="text-6xl font-extrabold text-blue-700 drop-shadow">{Math.round(today.main.temp)}°C</span>
            </div>
            <div className="text-lg text-blue-500 capitalize mb-2 font-medium">{today.weather[0].description}</div>
            <div className="flex gap-6 text-blue-400 text-sm">
              <span>Feels like: {Math.round(today.main.feels_like)}°C</span>
              <span>Humidity: {today.main.humidity}%</span>
              <span>Wind: {today.wind.speed} m/s</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center md:items-end">
            <div className="text-blue-400 text-sm mb-2">High: {Math.round(today.main.temp_max)}°C / Low: {Math.round(today.main.temp_min)}°C</div>
            <div className="text-blue-400 text-sm">Pressure: {today.main.pressure} hPa</div>
            <div className="text-blue-400 text-sm">Visibility: {today.visibility / 1000} km</div>
          </div>
        </div>
        {/* 5-Day Forecast */}
        <h2 className="text-2xl font-bold text-blue-700 mb-4">5-Day Forecast</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {forecastByDay.map(([date, items]) => {
            const midday = items[Math.floor(items.length / 2)];
            return (
              <div
                key={date}
                className="bg-white rounded-xl p-4 min-w-[200px] flex flex-col items-center shadow border border-blue-100 transition-transform duration-200 hover:scale-105 snap-center"
              >
                <span className="font-semibold text-blue-400 mb-2">{date}</span>
                {getWeatherIcon(midday.weather[0].id, 40)}
                <span className="text-3xl font-bold text-blue-700 mt-2 drop-shadow">{Math.round(midday.main.temp)}°C</span>
                <span className="capitalize text-blue-500 mt-1 font-medium">{midday.weather[0].description}</span>
                <span className="text-blue-400 text-xs mt-1">Humidity: {midday.main.humidity}%</span>
                <span className="text-blue-400 text-xs">Wind: {midday.wind.speed} m/s</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
