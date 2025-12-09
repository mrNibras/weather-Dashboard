import React from 'react';

// Helper function to derive a 5-day forecast from the 3-hour forecast list.
// It groups items by day and finds the min/max temps.
const getDailyForecast = (list) => {
  const dailyData = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyData[date]) {
      dailyData[date] = { temp_min: item.main.temp_min, temp_max: item.main.temp_max, weather: item.weather[0], dt: item.dt };
    } else {
      dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
      dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
    }
  });
  return Object.values(dailyData).slice(0, 5);
};

const Forecast = ({ hourly, daily }) => {
  // Guard clause to ensure forecast arrays exist before trying to map over them
  if (!hourly || !daily) return null;

  const dailyForecast = getDailyForecast(daily);

  return (
    <section className="space-y-8">
      {/* Hourly Forecast */}
      <div>
        <h3 className="text-xl font-bold mb-4">Hourly Forecast</h3>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {hourly.slice(0, 24).map((hour) => (
            <div key={hour.dt} className="flex-shrink-0 text-center bg-black/10 backdrop-blur-lg border border-white/10 p-4 rounded-2xl w-28">
              <p className="font-semibold">{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <img
                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt={hour.weather[0].description}
                className="w-12 h-12 mx-auto"
              />
              <p className="text-xl">{Math.round(hour.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div>
        <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
        <div className="space-y-2">
          {dailyForecast.map((day) => (
            <div key={day.dt} className="flex items-center justify-between bg-black/10 backdrop-blur-lg border border-white/10 p-3 rounded-2xl">
              <p className="font-semibold w-1/4">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <div className="flex items-center w-1/4">
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather.icon}.png`}
                  alt={day.weather.description}
                  className="w-8 h-8 mr-2"
                />
                <span className="hidden sm:inline capitalize">{day.weather.description}</span>
              </div>
              {/* The 'pop' property might not be available in this structure, so we can hide it for now */}
                <p className="w-1/4 text-center"></p>
              <p className="w-1/4 text-right">
                <span className="font-bold">{Math.round(day.temp.max)}°</span> / <span>{Math.round(day.temp.min)}°</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Forecast;