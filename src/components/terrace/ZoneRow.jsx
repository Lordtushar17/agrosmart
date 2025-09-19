import React from "react";

export default function ZoneRow({ zone, onToggle }) {
  return (
    <div className="card-base flex items-center justify-between">
      {/* Left side: Zone info */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded bg-green-50 flex items-center justify-center text-green-700 font-semibold">
          Z{zone.id}
        </div>
        <div>
          <div className="font-semibold">{zone.name}</div>
          <div className="text-sm text-gray-500">
            Soil: <span className="font-bold">{zone.soil}%</span> • Temp: {zone.temp ?? 22}°C
          </div>
        </div>
      </div>

      {/* Right side: Valve button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onToggle(zone.id)}
          className={`px-3 py-1 rounded transition ${
            zone.valveOpen
              ? "bg-red-600 text-white hover:bg-red-800"
              : "bg-green-400 text-gray-900 hover:bg-gray-500"
          }`}
        >
          {zone.valveOpen ? "Close" : "Open"}
        </button>
        <div className="text-sm text-gray-700">Valve</div>
      </div>
    </div>
  );
}
