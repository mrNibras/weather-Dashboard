const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

// --- Middleware ---
// Security headers
app.use(helmet());

// In a unified app, CORS is less critical for production if the origin is the same.
// However, it's still useful for development when the frontend dev server
// (e.g., on port 5173) calls the backend server (e.g., on port 3001).
app.use(cors());

// To handle JSON payloads
app.use(express.json());

// --- API Routes ---
// It's a good practice to prefix your API routes to avoid conflicts.
app.get('/api/weather', (req, res) => {
  // Your existing weather API logic would go here.
  // For example, fetching from another service with axios.
  res.json({ temp: '75F', condition: 'Sunny' });
});

// --- Static File Serving ---
// Serve the static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// --- Catch-all Route ---
// This route handles any requests that don't match the ones above.
// It sends back the main index.html file, allowing client-side routing to take over.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});