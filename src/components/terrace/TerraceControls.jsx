import React from "react";
import Card from "../common/Card";
import ZoneRow from "./ZoneRow";

export default function TerraceControls({ zones = [], onToggleValve, mlSuggestion }) {
  return (
    <Card className="space-y-4">
      {/* Header with ML suggestion */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Terrace Map & Controls</h3>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">ML Suggestion:</div>
          <div
            className={`px-2 py-1 rounded text-sm ${
              mlSuggestion.severity === "action"
                ? "bg-green-50 text-green-700"
                : mlSuggestion.severity === "warning"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {mlSuggestion.text}
          </div>
        </div>
      </div>

      {/* Zones */}
      <div className="space-y-3">
        {zones.map((z) => (
          <ZoneRow key={z.id} zone={z} onToggle={onToggleValve} />
        ))}
      </div>
    </Card>
  );
}
