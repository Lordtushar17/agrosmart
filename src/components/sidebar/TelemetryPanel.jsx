import React from "react";
import Card from "../common/Card";

export default function TelemetryPanel({ sensors = {} }) {
  const { temp = "--", humidity = "--", flowRate = "--", tankLevel = "--" } = sensors;

  return (
    <Card title="Live Telemetry">
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <div className="text-gray-500">Temperature</div>
          <div className="font-medium">{temp}°C</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-500">Humidity</div>
          <div className="font-medium">{humidity}%</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-500">Flow rate</div>
          <div className="font-medium">{flowRate} ml/min</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-500">Tank level</div>
          <div className="font-medium">{tankLevel}%</div>
        </div>
      </div>
    </Card>
  );
}
