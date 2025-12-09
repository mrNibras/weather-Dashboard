import React from 'react';

const CurrentWeather = ({ data }) => {
  // Guard clause to ensure all necessary data is present before rendering
  if (!data || !data.weather) return null;

  // Correctly destructure nested properties from the API response
  const { name, main, wind, sys, weather } = data;
  const { temp, humidity } = main;
  const { speed: wind_speed } = wind;
  const { sunrise, sunset } = sys;
  const weatherInfo = weather[0];

  const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="relative flex flex-col items-center justify-center p-6 bg-black/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
      <div className="text-center mb-4">
        <h2 className="text-4xl font-bold tracking-wide">{name}, {sys.country}</h2>
        <p className="text-lg text-white/70 capitalize">{weatherInfo.description}</p>
      </div>

      {/* Circular Hub */}
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Animated Icon */}
        <div className="absolute z-20">
          <img
            src={`http://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png`}
            alt={weatherInfo.description}
            className="w-32 h-32 drop-shadow-lg"
          />
        </div>
        {/* Temperature */}
        <div className="absolute z-10 text-center">
          <p className="text-8xl font-bold tracking-tighter">{Math.round(temp)}°</p>
        </div>
      </div>

      {/* Quick Info Belt */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-6">
        <div className="bg-white/10 p-3 rounded-xl">
          <h5 className="text-sm text-white/70">Wind</h5>
          <p className="text-lg font-semibold">{wind_speed} m/s</p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl">
          <h5 className="text-sm text-white/70">Humidity</h5>
          <p className="text-lg font-semibold">{humidity}%</p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl">
          <h5 className="text-sm text-white/70">Sunrise</h5>
          <p className="text-lg font-semibold">{formatTime(sunrise)}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl">
          <h5 className="text-sm text-white/70">Sunset</h5>
          <p className="text-lg font-semibold">{formatTime(sunset)}</p>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;