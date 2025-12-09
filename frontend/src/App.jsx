import React, { useState, useEffect } from 'react';
import { getWeatherDataByCity, getWeatherDataByCoords } from './services/weatherService';
import { MapPin } from 'lucide-react'; // A nice icon for the location button
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Favorites from './components/Favorites';
import WeatherMap from './components/Map';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentCities, setRecentCities] = useState(() => JSON.parse(localStorage.getItem('recentCities')) || []);
  const [favoriteCity, setFavoriteCity] = useState(() => localStorage.getItem('favoriteCity') || null);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const dataByCoords = await getWeatherDataByCoords(latitude, longitude);
            setWeatherData(dataByCoords);
          } catch (err) {
            setError('Could not fetch weather for your location.');
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError('Location access denied. Search for a city manually.');
          setLoading(false);
        }
      );
    }
  };

  // Auto-detect location on initial load
  useEffect(() => {
    handleGeolocation();
  }, []);

  // Update localStorage when recent/favorite cities change
    useEffect(() => {
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
  }, [recentCities]);

  useEffect(() => {
    if (favoriteCity) {
      localStorage.setItem('favoriteCity', favoriteCity);
    } else {
      localStorage.removeItem('favoriteCity');
    }
  }, [favoriteCity]);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherDataByCity(city);
      setWeatherData(data);
      // Add to recent cities, avoiding duplicates and managing length
      if (!recentCities.includes(city)) {
        const updatedRecent = [city, ...recentCities.filter(c => c !== city)].slice(0, 5);
        setRecentCities(updatedRecent);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinCity = (city) => {
    setFavoriteCity(city);
  };

  // Function to determine the background style based on weather
  const getBackgroundStyle = () => {
    if (!weatherData) return 'from-slate-800 to-gray-900'; // Default background
    const weatherCondition = weatherData.weather[0].main;
    const isNight = weatherData.dt > weatherData.sys.sunset || weatherData.dt < weatherData.sys.sunrise;

    if (isNight) return 'from-indigo-900 via-slate-900 to-gray-900';

    switch (weatherCondition) {
      case 'Clear':
        return 'from-sky-400 to-blue-600';
      case 'Clouds':
        return 'from-slate-400 to-gray-600';
      case 'Rain':
      case 'Drizzle':
        return 'from-blue-700 to-gray-800';
      case 'Thunderstorm':
        return 'from-gray-800 to-indigo-900';
      case 'Snow':
        return 'from-blue-200 to-cyan-400';
      default:
        return 'from-slate-800 to-gray-900';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-all duration-1000 ${getBackgroundStyle()}`}>
      {/* Map as a living background layer */}
      <div className="absolute inset-0 z-0 opacity-20 blur-sm">
        <WeatherMap coords={weatherData?.coord} />
      </div>
      
      <div className="relative z-10 w-full max-w-4xl">
        <main className="font-body">
          <div className="flex items-center gap-2">
            <SearchBar onSearch={handleSearch} />
            <button onClick={handleGeolocation} className="bg-white/20 backdrop-blur-lg p-3 rounded-lg hover:bg-white/30 transition-colors" title="Use my location">
              <MapPin size={20} />
            </button>
          </div>
          <Favorites
            recent={recentCities}
            favorite={favoriteCity}
            onSelect={handleSearch}
            onPin={handlePinCity}
          />

          {loading && (
            <div className="text-center mt-8">
              <p className="text-xl">Seeking the elements...</p>
            </div>
          )}

          {error && (
            <div className="text-center mt-8 bg-red-500/30 backdrop-blur-lg p-4 rounded-2xl border border-red-400/30">
              <p className="font-bold text-red-300">Error</p>
              <p>{error}</p>
            </div>
          )}

          {weatherData && !loading && !error && (
            <div className="mt-8 grid grid-cols-1 gap-8 animate-fade-in">
              <CurrentWeather data={weatherData} />
              <Forecast
                hourly={weatherData.hourly}
                daily={weatherData.daily}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;