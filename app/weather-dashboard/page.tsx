'use client'

import { useState, useRef } from "react";
import { WeatherData } from "../../types/weather";
import { useDebouncedCallback } from "use-debounce";

export default function WeatherDashboard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<number>(0);

  // Implement debounce city search, fetch weather, handle only latest, and log search (background)

  //handle logging
  const pushLogs = async() => {
    const pushToLog = await fetch("/api/log-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city }),
    });
    if (!pushToLog.ok) {
      throw new Error("Failed to log search");
    }
  }

  //hnadle weather api call
  const fetchWeather = async(city: string) => {
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if(response.ok){
      setWeather(data?.weather[0]);
    }else{
      setError(data.message);
    }
    setLoading(false);
  }

  //handle debounce search
  const debounceSearch = useDebouncedCallback((city: string) => {
    fetchWeather(city);
    pushLogs();
  }, 500);

  //handle city input
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    debounceSearch(e.target.value);
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-2">
      {/* Input, loading/error states, weather card go here */}
      <h3>Weather App</h3>
      <input type="text" value={city} onChange={handleCityChange} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <p>{weather.description}</p>
          <p>{weather.icon}</p>
        </div>
      )}
    </main>
  );
}
