// src/components/top/TopStats.jsx
import React from 'react';
import { Droplet, Gauge, Wind, Power } from 'lucide-react';
import StatCard from './StatCard';

export default function TopStats({ sensors, onRefill, onTogglePump }) {
  const avg = sensors.zones?.length
    ? Math.round(sensors.zones.reduce((a, b) => a + b.soil, 0) / sensors.zones.length)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatCard title="Soil Moisture" subtitle={`${avg}% average`} icon={<Droplet className="text-green-600" />}>
        <div className="flex space-x-3">
          {sensors.zones.map((z) => (
            <div key={z.id} className="flex-1 text-center">
              <div className="text-sm text-gray-500">{z.name}</div>
              <div className="text-lg font-semibold">{z.soil}%</div>
            </div>
          ))}
        </div>
      </StatCard>

      <StatCard title="Tank Level" subtitle={`${sensors.tankLevel}%`} icon={<Gauge className="text-blue-600" />}>
        <div className="flex items-center justify-between">
          <div className="w-2/3">
            <div className="w-full bg-gray-200 h-3 rounded overflow-hidden">
              <div className="h-3 rounded bg-blue-500" style={{ width: `${sensors.tankLevel}%` }} />
            </div>
            <div className="mt-2 text-sm text-gray-500">Last refill: 4 days ago</div>
          </div>
          <div className="w-1/3 text-right">
            <button
              onClick={onRefill}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              +10%
            </button>
          </div>
        </div>
      </StatCard>

      <StatCard title="ET (ETo)" subtitle="Evapotranspiration" icon={<Wind className="text-teal-600" />}>
        <div className="text-xl font-semibold mt-1">
          {Math.round((sensors.etValue || 0) * 10) / 10} mm/day
        </div>
      </StatCard>

      <StatCard title="Pump" subtitle={sensors.pumpOn ? 'ON' : 'OFF'} icon={<Power className="text-red-600" />}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Master Pump</div>
          <button
            onClick={onTogglePump}
            className={`px-3 py-1 rounded ${
              sensors.pumpOn ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
            } transition`}
          >
            {sensors.pumpOn ? 'Turn Off' : 'Turn On'}
          </button>
        </div>
      </StatCard>
    </div>
  );
}
