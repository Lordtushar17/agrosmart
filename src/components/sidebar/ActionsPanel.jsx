import React, { useState, useMemo } from "react";
import Card from "../common/Card";
import LogsModal from "../common/LogsModal";

/**
 * Creates a snapshot based on current sensors (with small random variation)
 */
function makeSnapshot(base, variance = 2) {
  const rnd = (v) => Math.max(0, Math.round(v + (Math.random() - 0.5) * variance));
  return {
    top: rnd(base.zones?.[0]?.soil ?? 40),
    mid: rnd(base.zones?.[1]?.soil ?? 30),
    bottom: rnd(base.zones?.[2]?.soil ?? 45),
    et: Math.round(((base.etValue ?? 3.5) + (Math.random() - 0.5) * 1) * 10) / 10,
    temp: Math.round(((base.temp ?? 22) + (Math.random() - 0.5) * 2) * 10) / 10,
    humidity: Math.max(0, Math.round((base.humidity ?? 65) + (Math.random() - 0.5) * 6)),
    tankLevel: Math.round((base.tankLevel ?? 75) + (Math.random() - 0.5) * 4),
  };
}

/**
 * Generate N demo logs spread within the last `minutesWindow` minutes.
 * The `baseSensors` object is used to make snapshots realistic.
 */
function generateDemoLogs(baseSensors = {}, count = 12, minutesWindow = 60) {
  const now = Date.now();
  const logsTemplates = [
    "Pump turned ON",
    "Pump turned OFF",
    "Valve opened (Top Zone)",
    "Valve opened (Middle Zone)",
    "Valve opened (Bottom Zone)",
    "Valve closed (Top Zone)",
    "Tank refill +10%",
    "Bluetooth paired successfully",
    "Cloud disconnected",
    "Cloud reconnected",
    "Alert: Flow drop detected",
    "Alert cleared: Flow stabilized",
  ];

  const result = [];
  for (let i = 0; i < count; i++) {
    const offsetMin = Math.round((i / count) * minutesWindow * (0.6 + Math.random() * 0.8)); // spread but random
    const ts = new Date(now - offsetMin * 60 * 1000);
    const message = logsTemplates[Math.floor(Math.random() * logsTemplates.length)];
    result.push({
      message,
      ts,
      snapshot: makeSnapshot(baseSensors),
    });
  }

  // sort newest first
  return result.sort((a, b) => b.ts - a.ts);
}

export default function ActionsPanel({ onPair = () => {}, sensors = {} }) {
  const [showLogs, setShowLogs] = useState(false);

  // Generate demo logs (memoized so identity is stable)
  const demoLogs = useMemo(() => generateDemoLogs({ ...sensors, etValue: sensors.etValue ?? 3.5 }, 14, 60), [sensors]);

  return (
    <>
      <Card title="Connectivity & Actions">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-gray-500">Bluetooth</div>
            <div className={`font-medium ${sensors.connection?.bluetooth ? "text-orange-600" : "text-gray-500"}`}>
              {sensors.connection?.bluetooth ? "Paired" : "Not paired"}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-gray-500">GSM</div>
            <div className={`font-medium ${sensors.connection?.gsm ? "text-green-600" : "text-red-600"}`}>
              {sensors.connection?.gsm ? "SIM OK" : "No SIM"}
            </div>
          </div>

          <div className="pt-2 flex space-x-2">
            <button onClick={onPair} className="flex-1 px-3 py-2 border rounded hover:shadow-md">
              Pair Bluetooth
            </button>
            <button onClick={() => setShowLogs(true)} className="flex-1 px-3 py-2 bg-gray-800 text-white rounded hover:shadow-md">
              View Logs
            </button>
          </div>
        </div>
      </Card>

      <LogsModal isOpen={showLogs} onClose={() => setShowLogs(false)} logs={demoLogs} />
    </>
  );
}
