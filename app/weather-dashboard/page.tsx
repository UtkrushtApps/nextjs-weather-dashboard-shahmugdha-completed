'use client'

import { useState, useRef, useEffect } from "react";
import { WeatherData } from "../../types/weather";
import { useDebouncedCallback } from "use-debounce";

export default function WeatherDashboard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  //handle weather api call
  const fetchWeather = async(city: string) => {
    // Cancel the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
      const response = await fetch(url, { 
        signal: controller.signal 
      });
      
      // Check if the request was aborted
      if (controller.signal.aborted) {
        return;
      }
      
      const data = await response.json();
      if(response.ok){
        setWeather(data?.weather[0]);
      } else {
        setError(data.message);
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name !== 'AbortError') {
        setError('Failed to fetch weather data');
        console.error(error);
      }
    } finally {
      // Only stop loading if this wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
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

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <main className="max-w-xl mx-auto py-10 px-2">
      {/* Input, loading/error states, weather card go here */}
      <h3>Weather App</h3>
      <input type="text" value={city} onChange={handleCityChange} />
      {loading && <p>Loading...</p>}
      {weather && (
        <div>
          <p>{weather.description}</p>
          <p>{weather.icon}</p>
        </div>
      )}
    </main>
  );
}
