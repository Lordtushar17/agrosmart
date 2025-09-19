// src/components/weather/WeatherEffects.jsx
import React from "react";

/* Sun that appears top-right, with rays behind it */
export function SunnyTopRight() {
  return (
    <div className="absolute top-3 right-3 pointer-events-none">
      {/* rotating rays (behind) */}
      <svg
        className="sun-rays absolute -top-6 -right-6 opacity-0"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        width="140"
        height="140"
        aria-hidden
      >
        <g transform="translate(50,50)">
          <circle cx="0" cy="0" r="18" fill="rgba(255,230,130,0.95)" />
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-30"
              x2="0"
              y2="-42"
              stroke="rgba(255,210,80,0.95)"
              strokeWidth="3"
              transform={`rotate(${i * 30})`}
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>

      {/* main sun circle (front) */}
      
    </div>
  );
}

/* Cloud top-right with optional rain lines */
export function CloudTopRight({ raining = false }) {
  return (
    <div className="absolute top-2 right-3 pointer-events-none w-[140px] h-[80px]">
      {/* cloud illustration */}
      <svg
        className="cloud-core transform-gpu opacity-0"
        viewBox="0 0 100 60"
        xmlns="http://www.w3.org/2000/svg"
        width="140"
        height="80"
        aria-hidden
      >
        <g>
          <ellipse cx="40" cy="30" rx="28" ry="18" fill="rgba(255,255,255,0.92)" />
          <ellipse cx="62" cy="28" rx="24" ry="16" fill="rgba(255,255,255,0.92)" />
          <ellipse cx="22" cy="28" rx="18" ry="12" fill="rgba(255,255,255,0.95)" />
        </g>
      </svg>

      {/* rain lines (only if raining) */}
      {raining && (
        <svg
          className="rain-lines absolute left-0 top-10 w-full h-full opacity-0"
          viewBox="0 0 100 60"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          {[...Array(10)].map((_, i) => {
            const x = 8 + i * 9;
            const dur = (0.6 + (i % 4) * 0.15).toFixed(2);
            return (
              <line
                key={i}
                x1={x}
                y1="0"
                x2={x - 3}
                y2="18"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <animate attributeName="y1" from="-8" to="60" dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="y2" from="0" to="70" dur={`${dur}s`} repeatCount="indefinite" />
              </line>
            );
          })}
        </svg>
      )}
    </div>
  );
}
