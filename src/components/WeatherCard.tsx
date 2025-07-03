export default function WeatherCard({ data }: { data: any }) {
    const current = data.current;
    const isPremium = !!data.premium;
  
    // Group forecast by day
    function groupForecastByDay(forecastList: any[], days: number = 5) {
      const grouped: Record<string, any[]> = {};
      forecastList.forEach((item: any) => {
        const date = item.dt_txt?.split(" ")[0] || item.dt; // fallback for daily
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });
      return Object.entries(grouped).slice(0, days);
    }
  
    const forecastByDay = data.forecast?.list ? groupForecastByDay(data.forecast.list, 5) : [];
    const extendedByDay = isPremium && data.extendedForecast?.list ? groupForecastByDay(data.extendedForecast.list, 16) : [];
    const historical = isPremium && data.historicalData;
  
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-[320px] border border-blue-100 transition-transform duration-200 hover:scale-105 flex flex-col items-center relative">
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
        {/* 16-Day Forecast for Premium */}
        {isPremium && (
          <div className="w-full mt-6">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">16-Day Extended Forecast</h4>
            {extendedByDay.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {extendedByDay.map(([date, items]: [string, any[]]) => {
                  const midday = items[Math.floor(items.length / 2)];
                  return (
                    <div
                      key={date}
                      className="bg-yellow-50 rounded-xl p-3 min-w-[120px] flex flex-col items-center shadow border border-yellow-200 transition-transform duration-200 hover:scale-105 snap-center"
                    >
                      <span className="font-semibold text-yellow-600 mb-1 text-xs">{date}</span>
                      <img
                        src={`https://openweathermap.org/img/wn/${midday.weather[0].icon || "01d"}@2x.png`}
                        alt="icon"
                        className="w-10 h-10 mb-1"
                      />
                      <span className="text-lg font-bold text-yellow-700 drop-shadow">{Math.round(midday.main?.temp || midday.temp?.day || 0)}°C</span>
                      <span className="capitalize text-yellow-700 text-xs mt-1 text-center">{midday.weather?.[0]?.description || "-"}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-yellow-700 text-sm">No extended forecast available.</div>
            )}
          </div>
        )}
        {/* Historical Data for Premium */}
        {isPremium && (
          <div className="w-full mt-6">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">Historical Weather (Yesterday)</h4>
            {historical ? (
              <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow border border-blue-100">
                <span className="text-blue-700 font-bold mb-1">{new Date((historical.current?.dt || 0) * 1000).toLocaleDateString()}</span>
                <span className="text-2xl font-extrabold text-blue-700">{Math.round(historical.current?.temp || 0)}°C</span>
                <span className="capitalize text-blue-500 mt-1">{historical.current?.weather?.[0]?.description || "-"}</span>
                <span className="text-blue-400 text-xs mt-1">Humidity: {historical.current?.humidity || "-"}%</span>
                <span className="text-blue-400 text-xs">Wind: {historical.current?.wind_speed || "-"} m/s</span>
              </div>
            ) : (
              <div className="text-blue-400 text-sm">No historical data available.</div>
            )}
          </div>
        )}
      </div>
    );
  }
  