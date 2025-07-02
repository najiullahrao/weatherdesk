const API_KEY = process.env.OPENWEATHER_API_KEY!;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(city: string) {
  const res = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error("Failed to fetch current weather");
  return res.json();
}

export async function get5DayForecast(city: string) {
  const res = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
}
