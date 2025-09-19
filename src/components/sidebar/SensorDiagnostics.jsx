// src/components/sidebar/SensorDiagnostics.jsx
import React from "react";
import Card from "../common/Card";
import { Battery, Signal, Clock3, Activity } from "lucide-react";

export default function SensorDiagnostics({ sensors = {} }) {
  const battery = typeof sensors.battery === "number" ? sensors.battery : null;
  const signal = typeof sensors.signalStrength === "number" ? sensors.signalStrength : null;
  const lastSync = sensors.lastSync ?? "--";
  const probesOk = (sensors.zones ?? []).every((z) => typeof z.soil === "number");

  return (
    <Card title="Sensor Diagnostics" variant="glass">
      <div className="space-y-3 text-sm text-gray-700">
        {/* Battery */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-2">
              <Battery size={16} className="text-green-600" />
              Battery
            </span>
            <span className="font-medium">{battery ?? "--"}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
            <div
              style={{ width: `${battery ?? 0}%` }}
              className={`h-2 rounded ${battery >= 50 ? "bg-gradient-to-r from-green-400 to-green-600" : battery >= 25 ? "bg-yellow-400" : "bg-red-400"}`}
            />
          </div>
        </div>

        {/* Signal Strength */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Signal size={16} className="text-blue-600" />
            Signal
          </span>
          <span className="font-medium">{signal ?? "--"} dBm</span>
        </div>

        {/* Last sync */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock3 size={16} className="text-gray-500" />
            Last sync
          </span>
          <span className="font-medium">{lastSync}</span>
        </div>

        {/* Probe health */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity size={16} className="text-purple-600" />
            Probes
          </span>
          <span className={`font-medium ${probesOk ? "text-green-600" : "text-amber-600"}`}>
            {probesOk ? "OK" : "Check"}
          </span>
        </div>
      </div>
    </Card>
  );
}
