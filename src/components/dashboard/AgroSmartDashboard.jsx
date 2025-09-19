// src/components/dashboard/AgroSmartDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import Header from "../header/Header";
import TopStats from "../top/TopStats";
import TerraceControls from "../terrace/TerraceControls";
import SoilLineChart from "../charts/SoilLineChart";
import TankAreaChart from "../charts/TankAreaChart";
import SensorDiagnostics from "../sidebar/SensorDiagnostics";
import WeatherET from "../sidebar/WeatherET";
import AlertsPanel from "../sidebar/AlertsPanel";
import ActionsPanel from "../sidebar/ActionsPanel";
import Card from "../common/Card";
import { useMockWeather } from "../../hooks/useMockWeather";
import Footer from "../common/Footer";
import BackgroundSlider from "../common/BackgroundSlider";

/* -------- helpers -------- */
function generateInitialSoilHistory() {
  const now = new Date();
  return Array.from({ length: 20 }, (_, i) => ({
    time: `${now.getHours()}:${(now.getMinutes() - (19 - i) + 60) % 60}`,
    top: 40 + Math.round(Math.random() * 4 - 2),
    mid: 30 + Math.round(Math.random() * 6 - 3),
    bottom: 45 + Math.round(Math.random() * 5 - 2),
  }));
}

function generateInitialTankHistory() {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${now.getHours()}:${(now.getMinutes() - (23 - i) + 60) % 60}`,
    level: 70 + Math.round(Math.random() * 6 - 3),
  }));
}

/* -------- component -------- */
export default function AgroSmartDashboard() {
  // core telemetry state (self-contained so this file runs without extra hooks)
  const [sensors, setSensors] = useState({
    tankLevel: 78,
    pumpOn: false,
    flowRate: 320,
    zones: [
      { id: 1, name: "Top Zone", soil: 38, valveOpen: false, temp: 22 },
      { id: 2, name: "Middle Zone", soil: 26, valveOpen: false, temp: 22 },
      { id: 3, name: "Bottom Zone", soil: 45, valveOpen: false, temp: 22 },
    ],
    temp: 22.4,
    humidity: 72,
    connection: { cloud: true, bluetooth: false, gsm: true },
    alerts: [
      { id: 1, level: "warning", text: "Flow drop detected in main line" },
      { id: 2, level: "info", text: "Next predicted rain in 6 hours" },

    ],
      battery: 92,               // battery percent (simulated)
      signalStrength: -68,       // signal in dBm (simulated)
      lastSync: new Date().toLocaleTimeString(),
  });

  const [soilHistory, setSoilHistory] = useState(generateInitialSoilHistory());
  const [tankHistory, setTankHistory] = useState(generateInitialTankHistory());

  // Use centralized mock weather hook (provides forecast + ET)
  const { weather, etValue } = useMockWeather();

  // Simulate live updates every 2.5s.
  // We update sensors and immediately append to histories using the freshly computed newSensors
  useEffect(() => {
    const id = setInterval(() => {
      setSensors((prev) => {
        const newZones = prev.zones.map((z) => ({
          ...z,
          soil: Math.max(5, Math.min(95, Math.round(z.soil + (Math.random() - 0.45) * 4))),
        }));
        const newTank = Math.max(3, Math.min(100, Math.round(prev.tankLevel + (Math.random() - 0.5) * 2)));
        const newFlow = Math.max(0, Math.round(prev.flowRate + (Math.random() - 0.5) * 20));

        const newBattery = Math.max(5, Math.min(100, Math.round(prev.battery + (Math.random() - 0.5) * 1))); // small drift
        const newSignal = (typeof prev.signalStrength === "number") ? Math.round(prev.signalStrength + (Math.random() - 0.5) * 2) : -70;
        const nowSync = new Date().toLocaleTimeString();

        const newSensors = {
          ...prev,
          zones: newZones,
          tankLevel: newTank,
          flowRate: newFlow,
          temp: Math.round((prev.temp + (Math.random() - 0.5) * 0.6) * 10) / 10,
          humidity: Math.max(10, Math.min(95, prev.humidity + Math.round((Math.random() - 0.5) * 2))),
          battery: newBattery,
          signalStrength: newSignal,
          lastSync: nowSync,
          pumpOn: prev.pumpOn, // keep pump state
        };

        // append soil entry using newSensors
        setSoilHistory((h) => {
          const now = new Date();
          const newEntry = {
            time: now.toLocaleTimeString().replace(/:\d+\s?/, ":"),
            top: newZones[0]?.soil ?? 0,
            mid: newZones[1]?.soil ?? 0,
            bottom: newZones[2]?.soil ?? 0,
          };
          return [...h.slice(-19), newEntry];
        });

        // append tank entry using newSensors
        setTankHistory((h) => {
          const now = new Date();
          const newEntry = { time: now.toLocaleTimeString().replace(/:\d+\s?/, ":"), level: newTank };
          return [...h.slice(-23), newEntry];
        });

        // NOTE: ET drift and weather drift are handled by useMockWeather() now.
        return newSensors;
      });
    }, 2500);

    return () => clearInterval(id);
  }, []);

  // handlers
  const toggleValve = (zoneId) =>
    setSensors((s) => ({ ...s, zones: s.zones.map((z) => (z.id === zoneId ? { ...z, valveOpen: !z.valveOpen } : z)) }));

  const togglePump = () => {
  setSensors((s) => {
    console.log('[togglePump] before:', s.pumpOn);
    const updated = { ...s, pumpOn: !s.pumpOn };
    console.log('[togglePump] after:', updated.pumpOn);
    return updated;
  });
};
  const refill = () => setSensors((s) => ({ ...s, tankLevel: Math.min(100, s.tankLevel + 10) }));
  const simulateSMS = () =>
    setSensors((s) => ({ ...s, alerts: [{ id: Date.now(), level: "critical", text: "Manual SMS: Low tank - please check." }, ...s.alerts] }));

  // ML suggestion logic (simple demo)
  const mlSuggestion = useMemo(() => {
    const dryZones = (sensors.zones ?? []).filter((z) => z.soil < 30).map((z) => z.name);
    if (dryZones.length === 0) return { text: "No immediate watering needed", severity: "ok" };
    if (sensors.tankLevel < 25) return { text: `Low tank — avoid watering (${dryZones.join(", ")})`, severity: "warning" };
    return { text: `Suggest watering: ${dryZones.join(", ")}`, severity: "action" };
  }, [sensors.zones, sensors.tankLevel]);

  const sensorsWithEt = { ...sensors, etValue };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">


      <BackgroundSlider showControls={true} pauseOnHover={true} />

      <div className="max-w-7xl mx-auto p-6">
        <Header connection={sensors.connection} />

        {/* Hero stats */}
        <TopStats sensors={sensorsWithEt} onRefill={refill} onTogglePump={togglePump} />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-10">
            <TerraceControls zones={sensors.zones} onToggleValve={toggleValve} mlSuggestion={mlSuggestion} />

            <section>
              <h3 className="text-lg font-bold mb-4">📊 Analytics</h3>

              <Card variant="glass" className="!p-4 mb-6">
                <h4 className="font-semibold mb-2">Soil Moisture History</h4>
                <SoilLineChart data={soilHistory} />
              </Card>

              <Card  variant="glass" className="!p-4">
                <h4 className="font-semibold mb-2">Tank Level History</h4>
                <TankAreaChart data={tankHistory} />
              </Card>
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-8">
            <WeatherET weather={weather} etValue={etValue} />
            <SensorDiagnostics sensors={sensors} />
            <AlertsPanel alerts={sensors.alerts} onSimulate={simulateSMS} />
            <ActionsPanel onPair={() => alert("Pairing (simulate)")} sensors={sensors} />
          </aside>
        </div>

        {/* Footer inline (safe fallback if you haven't created Footer.jsx) */}
        <Footer />
      </div>
    </div>
  );
}
