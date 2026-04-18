/**
 * Open-Meteo Weather Service
 * Completely free, no API key required.
 * Docs: https://open-meteo.com/en/docs
 */

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather Code → human-readable label + emoji
export const WMO_CODES = {
  0:  { label: 'Clear Sky',        emoji: '☀️',  icon: 'sun' },
  1:  { label: 'Mainly Clear',     emoji: '🌤️',  icon: 'sun-cloud' },
  2:  { label: 'Partly Cloudy',    emoji: '⛅',  icon: 'cloud-sun' },
  3:  { label: 'Overcast',          emoji: '☁️',  icon: 'cloud' },
  45: { label: 'Foggy',            emoji: '🌫️',  icon: 'fog' },
  48: { label: 'Icy Fog',          emoji: '🌫️',  icon: 'fog' },
  51: { label: 'Light Drizzle',    emoji: '🌦️',  icon: 'drizzle' },
  53: { label: 'Drizzle',          emoji: '🌦️',  icon: 'drizzle' },
  55: { label: 'Heavy Drizzle',    emoji: '🌧️',  icon: 'rain' },
  61: { label: 'Slight Rain',      emoji: '🌧️',  icon: 'rain' },
  63: { label: 'Moderate Rain',    emoji: '🌧️',  icon: 'rain' },
  65: { label: 'Heavy Rain',       emoji: '🌧️',  icon: 'rain-heavy' },
  71: { label: 'Slight Snow',      emoji: '🌨️',  icon: 'snow' },
  73: { label: 'Moderate Snow',    emoji: '❄️',  icon: 'snow' },
  75: { label: 'Heavy Snow',       emoji: '❄️',  icon: 'snow-heavy' },
  80: { label: 'Rain Showers',     emoji: '🌦️',  icon: 'showers' },
  81: { label: 'Heavy Showers',    emoji: '🌧️',  icon: 'showers' },
  82: { label: 'Violent Showers',  emoji: '⛈️',  icon: 'storm' },
  95: { label: 'Thunderstorm',     emoji: '⛈️',  icon: 'storm' },
  96: { label: 'Thunderstorm',     emoji: '⛈️',  icon: 'storm' },
  99: { label: 'Heavy Thunderstorm', emoji: '⛈️', icon: 'storm' },
};

export function getWeatherDescription(code) {
  return WMO_CODES[code] ?? { label: 'Unknown', emoji: '🌡️', icon: 'thermometer' };
}

/**
 * Fetch current weather + next 6 hours for a given lat/lon.
 * Returns a clean, normalized object.
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
    ].join(','),
    wind_speed_unit: 'kmh',
    forecast_days: 1,
    timezone: 'auto',
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  const c = data.current;
  const desc = getWeatherDescription(c.weather_code);

  // Build 6-hour forecast from the current hour onward
  const nowHourIndex = new Date().getHours();
  const hourly = data.hourly.time
    .slice(nowHourIndex, nowHourIndex + 6)
    .map((time, i) => ({
      time: new Date(time).toLocaleTimeString([], { hour: '2-digit', hour12: true }),
      temp: Math.round(data.hourly.temperature_2m[nowHourIndex + i]),
      code: data.hourly.weather_code[nowHourIndex + i],
      emoji: getWeatherDescription(data.hourly.weather_code[nowHourIndex + i]).emoji,
    }));

  return {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: Math.round(c.wind_speed_10m),
    uvIndex: c.uv_index ?? 0,
    precipitation: c.precipitation,
    code: c.weather_code,
    ...desc,
    hourly,
  };
}
