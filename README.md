[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://weather-dashboard-jeh1.onrender.com)

A clean, modern, and responsive weather dashboard application that provides real-time weather information for any city in the world. It also includes hourly and 5-day forecasts.

## ✨ Features

- **City Search**: Find weather information for any city.
- **Geolocation**: Automatically fetch weather for your current location with one click.
- **Current Weather**: Get up-to-date conditions, temperature, wind speed, humidity, sunrise, and sunset times.
- **Detailed Forecasts**: View hourly forecasts for the next 24 hours and a daily forecast for the next 5 days.
- **Dynamic Background**: The UI background changes based on the current weather conditions and time of day.
- **Responsive Design**: Looks great on desktop, tablets, and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **API**: OpenWeatherMap API
- **Deployment**: Render

## 🚀 How to Run Locally

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mrNIbras/weather-Dashboard.git
    cd weather-Dashboard
    ```

2.  **Install dependencies:**
    Run `npm install` from the root directory. This will install dependencies for both the frontend and backend.

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file inside the `/backend` directory and add your OpenWeatherMap API key:

    ```
    WEATHER_API_KEY="your_api_key_here"
    ```

4.  **Run the application:**
    Use the `deploy` script from the root directory to build the frontend and start the server.

    ```bash
    npm run deploy
    ```

5.  Open your browser and navigate to `http://localhost:3001`.
