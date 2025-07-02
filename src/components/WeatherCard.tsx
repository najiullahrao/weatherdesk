export default function WeatherCard({ data }: { data: any }) {
    const current = data.current;
  
    // Group forecast by day
    function groupForecastByDay(forecastList: any[]) {
      const days: Record<string, any[]> = {};
      forecastList.forEach((item: any) => {
        const date = item.dt_txt.split(" ")[0];
        if (!days[date]) days[date] = [];
        days[date].push(item);
      });
      return Object.entries(days).slice(0, 5); // Only 5 days
    }
  
    const forecastByDay = data.forecast?.list ? groupForecastByDay(data.forecast.list) : [];
  
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-[320px] border border-blue-100 transition-transform duration-200 hover:scale-105 flex flex-col items-center">
        <h3 className="text-xl font-bold mb-2 text-blue-800 drop-shadow flex items-center gap-2">
          <span>{data.city}</span>
          <span className="text-base text-blue-400 font-normal">{data.country}</span>
        </h3>
        <div className="flex items-center gap-4 mb-2">
          <img
            src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
            alt="icon"
            className="w-20 h-20 drop-shadow"
          />
          <div>
            <p className="text-4xl font-extrabold text-blue-700 drop-shadow">{Math.round(current.main.temp)}°C</p>
            <p className="capitalize text-blue-400 font-medium text-lg">{current.weather[0].description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center text-blue-500 text-sm mt-2">
          <span>Feels like: {Math.round(current.main.feels_like)}°C</span>
          <span>Humidity: {current.main.humidity}%</span>
          <span>Wind: {current.wind.speed} m/s</span>
        </div>
        <div className="flex flex-wrap gap-4 justify-center text-blue-400 text-xs mt-2">
          <span>High: {Math.round(current.main.temp_max)}°C</span>
          <span>Low: {Math.round(current.main.temp_min)}°C</span>
          <span>Pressure: {current.main.pressure} hPa</span>
          <span>Visibility: {current.visibility / 1000} km</span>
        </div>
        {/* 5-Day Forecast */}
        {forecastByDay.length > 0 && (
          <div className="w-full mt-6">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">5-Day Forecast</h4>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {forecastByDay.map(([date, items]: [string, any[]]) => {
                const midday = items[Math.floor(items.length / 2)];
                return (
                  <div
                    key={date}
                    className="bg-blue-50 rounded-xl p-3 min-w-[120px] flex flex-col items-center shadow border border-blue-100 transition-transform duration-200 hover:scale-105 snap-center"
                  >
                    <span className="font-semibold text-blue-400 mb-1 text-xs">{date}</span>
                    <img
                      src={`https://openweathermap.org/img/wn/${midday.weather[0].icon}@2x.png`}
                      alt="icon"
                      className="w-10 h-10 mb-1"
                    />
                    <span className="text-lg font-bold text-blue-700 drop-shadow">{Math.round(midday.main.temp)}°C</span>
                    <span className="capitalize text-blue-500 text-xs mt-1 text-center">{midday.weather[0].description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
  