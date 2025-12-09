const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();

// --- Middleware ---
// Security headers
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));

// In a unified app, CORS is less critical for production if the origin is the same.
// However, it's still useful for development when the frontend dev server
// (e.g., on port 5173) calls the backend server (e.g., on port 3001).
app.use(cors());

// To handle JSON payloads
app.use(express.json());

// --- API Routes ---
// It's a good practice to prefix your API routes to avoid conflicts.
app.get('/api/weather', async (req, res) => {
  const { city, lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'Weather API key is not configured on the server.' });
  }

  if (!city && !(lat && lon)) {
    return res.status(400).json({ message: 'City or coordinates must be provided.' });
  }

  try {
    let lat_to_use = lat;
    let lon_to_use = lon;

    // If only a city is provided, we first need to geocode it to get coordinates
    if (city) {
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct`;
      const geocodeResponse = await axios.get(geocodeUrl, { params: { q: city, limit: 1, appid: apiKey } });
      if (geocodeResponse.data.length === 0) {
        return res.status(404).json({ message: 'City not found.' });
      }
      lat_to_use = geocodeResponse.data[0].lat;
      lon_to_use = geocodeResponse.data[0].lon;
    }
    const baseURL = 'https://api.openweathermap.org/data/3.0/onecall';
    const params = { lat: lat_to_use, lon: lon_to_use, appid: apiKey, units: 'metric', exclude: 'minutely,alerts' };
    const response = await axios.get(baseURL, { params });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from weather API:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch weather data.';
    res.status(status).json({ message });
  }
});

// --- Static File Serving ---
// Serve the static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// --- Catch-all Route ---
// This route handles any requests that don't match the ones above.
// It sends back the main index.html file, allowing client-side routing to take over.
// We use a regular expression to match any path that wasn't already handled.
// This is a robust way to implement a catch-all for client-side routing.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});