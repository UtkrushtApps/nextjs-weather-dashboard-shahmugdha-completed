# Weather Dashboard – Task

## Task Overview

Your team is developing a weather dashboard feature for a travel-focused web application. The dashboard lets users search any city and view its latest weather information using a third-party API. Ensuring responsive user experience is key: rapid search inputs must not trigger excessive API requests, results should not "flicker" due to concurrent fetches, and every successful search should be logged on the backend without blocking the UI.

## Guidance

- Use Next.js (13+) with the app directory and TypeScript everywhere.
- On the dashboard, provide a single input to search for cities. Users will often type quickly—ensure only one API call is triggered per stable search (debouncing).
- Show proper loading and error states while fetching weather data asynchronously. Prevent race conditions so that only the most recent search result is shown, even if responses arrive out of order.
- When a search is successful, log the event (city, timestamp) in the background via a Next.js API route, not blocking weather display. Logging can be in-memory for this exercise.
- Use React functional components and proper typing for weather data, log events, and form state.
- Style the main dashboard minimally for clarity using either CSS Modules or Tailwind CSS.
- City weather can be fetched from a free public API (e.g., OpenWeatherMap) or a provided mock endpoint (no API key included).

## Objectives

- Implement a city search input that uses debouncing to minimize redundant API calls, properly typed with TypeScript.
- Fetch weather data asynchronously for each city search, ensuring only the latest result is rendered regardless of response order.
- Display loading and error states appropriately during fetch operations.
- Log each successful city weather lookup in the background using a Next.js API route (`/api/log-search`); logging does not block rendering.
- Use TypeScript interfaces for weather data, search log event, and form data throughout.

## How to Verify

- Launch the app and type rapidly in the search input; confirm only the final city triggers a real fetch, and earlier requests don’t update the UI out of order.
- Confirm loading indication during fetch and clear error messages for failed API calls.
- Inspect the `/api/log-search` route by hitting it via `GET` to confirm successful log events are recorded (logs are in-memory and will reset on reload).
- Ensure UI remains responsive and free of visual glitches when searching or fetching data quickly.
- Confirm strict TypeScript typechecking passes and project runs without type errors.
