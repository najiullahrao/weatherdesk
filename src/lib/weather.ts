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

// Premium: 16-day forecast (requires OWM paid plan)
export async function get16DayForecast(city: string) {
  // You may need to use city coordinates for the One Call API
  // This is a placeholder for the 16-day/daily forecast endpoint
  const res = await fetch(`${BASE_URL}/forecast/daily?q=${city}&cnt=16&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error("Failed to fetch 16-day forecast");
  return res.json();
}

// Premium: Historical weather (requires OWM paid plan)
export async function getHistoricalWeather(lat: number, lon: number, dt: number) {
  // dt = unix timestamp (seconds)
  const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error("Failed to fetch historical weather");
  return res.json();
}
