// src/components/sidebar/WeatherPanel.jsx
import React from "react";
import Card from "../common/Card";
import { SunnyTopRight, CloudTopRight } from "../weather/WeatherEffects";

import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  CloudSun,
  Cloud,
} from "lucide-react";

export default function WeatherPanel({ weather }) {
  const getConditionIcon = (condition) => {
    switch ((condition ?? "").toLowerCase()) {
      case "sunny":
        return <Sun size={18} className="text-yellow-500" />;
      case "cloudy":
        return <Cloud size={18} className="text-gray-500" />;
      case "partly cloudy":
        return <CloudSun size={18} className="text-blue-500" />;
      case "rainy":
        return <CloudRain size={18} className="text-blue-600" />;
      default:
        return <Cloud size={18} className="text-gray-400" />;
    }
  };

  const condition = weather?.condition?.toLowerCase() ?? "";

  const bgClass = condition.includes("sunny")
    ? "weather-sunny"
    : condition.includes("rain")
    ? "weather-rainy"
    : "weather-cloudy";

  return (
    <Card
      title="Weather"
      className={`relative overflow-hidden weather-card hover:scale-[1.02] transition-transform duration-300 ${bgClass}`}
    >
      {/* TOP-RIGHT EFFECT: only the effects from WeatherEffects.jsx are rendered */}
      <div className="pointer-events-none">
        {condition.includes("sunny") && (
          <div className="effect-top-right">
            <SunnyTopRight />
          </div>
        )}
        {condition.includes("rain") && (
          <div className="effect-top-right">
            <CloudTopRight raining />
          </div>
        )}
        {condition.includes("cloud") && !condition.includes("rain") && (
          <div className="effect-top-right">
            <CloudTopRight raining={false} />
          </div>
        )}
      </div>

      {/* Card content (above effects) */}
      <div className="relative z-10">
        <h4 className="font-semibold mb-3">Weather</h4>

        <div className="flex items-center justify-between text-sm mb-2">
          <span className="flex items-center gap-2 text-gray-600">
            {getConditionIcon(weather?.condition)}
            Condition
          </span>
          <span className="font-medium">{weather?.condition ?? "—"}</span>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-600">🌡 Temperature</span>
          <span className="text-lg font-semibold text-gray-900">
            {weather?.temp ?? "--"}°C
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 mb-4">
          <span className="flex items-center gap-1">
            <Droplets size={16} className="text-blue-500" />
            Humidity: {weather?.humidity ?? "--"}%
          </span>
          <span className="flex items-center gap-1">
            <Wind size={16} className="text-gray-500" />
            Wind: {weather?.wind ?? "--"} m/s
          </span>
          <span className="flex items-center gap-1">
            ☀️ Solar: {weather?.solar ?? "--"} W/m²
          </span>
          <span className="flex items-center gap-1">
            🌧 Rain: {weather?.rainChance ?? "--"}%
          </span>
        </div>

        <div>
          <h5 className="font-semibold text-sm mb-2">Short Forecast</h5>
          <div className="grid grid-cols-4 gap-2 text-center">
            {(weather?.forecast ?? []).map((f, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-gray-50 border text-xs flex flex-col items-center"
              >
                <div className="mb-1">
                  {getConditionIcon(f.condition?.toLowerCase?.() ?? f.condition)}
                </div>
                <span className="mt-1">{f.label}</span>
                <span className="text-gray-600">{f.chance}%</span>
              </div>
            ))}

            {(weather?.forecast ?? []).length === 0 && (
              <div className="col-span-4 text-sm text-gray-500">
                No short forecast available
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
