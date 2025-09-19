import { useEffect, useState, useCallback } from 'react';
import { generateInitialSoilHistory, generateInitialTankHistory } from '../utils/mockData';


export function useMockTelemetry() {
const [sensors, setSensors] = useState({
tankLevel: 78,
pumpOn: false,
flowRate: 320,
zones: [
{ id: 1, name: 'Top Zone', soil: 38, valveOpen: false },
{ id: 2, name: 'Middle Zone', soil: 26, valveOpen: false },
{ id: 3, name: 'Bottom Zone', soil: 45, valveOpen: false },
],
temp: 22.4,
humidity: 72,
connection: { cloud: true, bluetooth: false, gsm: true },
alerts: [
{ id: 1, level: 'warning', text: 'Flow drop detected in main line' },
{ id: 2, level: 'info', text: 'Next predicted rain in 6 hours' },
],
});


const [soilHistory, setSoilHistory] = useState(generateInitialSoilHistory());
const [tankHistory, setTankHistory] = useState(generateInitialTankHistory());


useEffect(() => {
const id = setInterval(() => {
setSensors((s) => {
const newZones = s.zones.map((z) => ({
...z,
soil: Math.max(8, Math.min(95, Math.round(z.soil + (Math.random() - 0.45) * 4))),
}));
const newTank = Math.max(5, Math.min(100, Math.round(s.tankLevel + (Math.random() - 0.5) * 2)));
const newFlow = Math.max(0, Math.round(s.flowRate + (Math.random() - 0.5) * 20));
return { ...s, zones: newZones, tankLevel: newTank, flowRate: newFlow };
});


setSoilHistory((h) => {
const now = new Date();
const last = h[h.length - 1] || { top: 40, mid: 30, bottom: 45 };
const newEntry = {
time: now.toLocaleTimeString().replace(/:\d+\s?/, ':'),
top: Math.max(10, Math.min(95, Math.round(last.top + (Math.random() - 0.5) * 3))),
mid: Math.max(10, Math.min(95, Math.round(last.mid + (Math.random() - 0.5) * 4))),
bottom: Math.max(10, Math.min(95, Math.round(last.bottom + (Math.random() - 0.5) * 3))),
};
return [...h.slice(-19), newEntry];
});


setTankHistory((h) => {
const now = new Date();
const last = h[h.length - 1] || { level: 75 };
const newEntry = { time: now.toLocaleTimeString().replace(/:\d+\s?/, ':'), level: Math.max(5, Math.min(100, Math.round(last.level + (Math.random() - 0.4) * 2))) };
return [...h.slice(-23), newEntry];
});
}, 2500);


return () => clearInterval(id);
}, []);


const toggleValve = useCallback((id) => {
setSensors((s) => ({ ...s, zones: s.zones.map((z) => (z.id === id ? { ...z, valveOpen: !z.valveOpen } : z)) }));
}, []);


const togglePump = useCallback(() => setSensors((s) => ({ ...s, pumpOn: !s.pumpOn })), []);


const refill = useCallback(() => setSensors((s) => ({ ...s, tankLevel: Math.min(100, s.tankLevel + 10) })), []);


const simulateSMS = useCallback(() => setSensors((s) => ({ ...s, alerts: [{ id: Date.now(), level: 'critical', text: 'Manual SMS: Low tank - please check.' }, ...s.alerts] })), []);


return { sensors, soilHistory, tankHistory, toggleValve, togglePump, refill, simulateSMS };
}