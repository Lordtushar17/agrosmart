import { useState, useEffect } from "react";

export function useMockWeather() {
  const [weather, setWeather] = useState({
    condition: "Sunny",
    temp: 22,
    humidity: 72,
    wind: 2.4,
    solar: 650,
    rainChance: 15,
    forecast: [
      { label: "T+1h", condition: "Cloudy", chance: 40 },
      { label: "T+2h", condition: "Partly Cloudy", chance: 30 },
      { label: "T+3h", condition: "Rainy", chance: 65 },
      { label: "T+4h", condition: "Sunny", chance: 10 },
    ],
  });

  const [etValue, setEtValue] = useState(3.2);

  useEffect(() => {
    const id = setInterval(() => {
      setWeather((prev) => ({
        ...prev,
        temp: Math.round((prev.temp + (Math.random() - 0.5) * 0.6) * 10) / 10,
        humidity: Math.max(
          10,
          Math.min(95, prev.humidity + Math.round((Math.random() - 0.5) * 2))
        ),
        wind: Math.max(
          0,
          Math.round((prev.wind + (Math.random() - 0.3)) * 10) / 10
        ),
        rainChance: Math.max(
          0,
          Math.min(100, prev.rainChance + Math.round((Math.random() - 0.5) * 5))
        ),
      }));

      setEtValue((et) =>
        Math.max(
          0,
          Math.round((et + (Math.random() - 0.5) * 0.2) * 10) / 10
        )
      );
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return { weather, etValue };
}
