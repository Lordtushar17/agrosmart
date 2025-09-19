import React from "react";

/**
 * LogsModal
 * - isOpen: boolean
 * - onClose: function
 * - logs: array of { message, ts (Date), snapshot: { top, mid, bottom, et, temp, humidity, tankLevel } }
 */
function formatClock(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function relativeTimeFromNow(date) {
  const secs = Math.round((Date.now() - date.getTime()) / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  return `${hrs}h ago`;
}

export default function LogsModal({ isOpen, onClose, logs = [] }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      <div
        className="relative z-10 w-[95%] sm:w-[80%] md:w-[820px] max-h-[86vh] bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-200"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-800">System Logs</h3>
          <button
            onClick={onClose}
            aria-label="Close logs"
            className="text-gray-500 hover:text-gray-700 rounded p-1"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto text-sm space-y-3" style={{ maxHeight: "68vh" }}>
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs available.</div>
          ) : (
            logs.map((log, idx) => {
              const ts = log.ts instanceof Date ? log.ts : new Date(log.ts);
              return (
                <div key={idx} className="flex flex-col gap-2 pb-2 border-b last:border-b-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-gray-800 font-medium">{log.message}</div>
                    <div className="text-gray-400 text-xs text-right">
                      <div>{formatClock(ts)}</div>
                      <div className="text-xs text-gray-400">{relativeTimeFromNow(ts)}</div>
                    </div>
                  </div>

                  {/* Snapshot row */}
                  {log.snapshot && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600 mt-1">
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-xxs text-gray-500">Soil (top)</div>
                        <div className="font-medium">{log.snapshot.top}%</div>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-xxs text-gray-500">Soil (mid)</div>
                        <div className="font-medium">{log.snapshot.mid}%</div>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-xxs text-gray-500">Soil (bottom)</div>
                        <div className="font-medium">{log.snapshot.bottom}%</div>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-xxs text-gray-500">ET</div>
                        <div className="font-medium">{log.snapshot.et} mm/day</div>
                      </div>

                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-xxs text-gray-500">Temp</div>
                        <div className="font-medium">{log.snapshot.temp}°C</div>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-xxs text-gray-500">Humidity</div>
                        <div className="font-medium">{log.snapshot.humidity}%</div>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1 col-span-2 md:col-span-1">
                        <div className="text-xxs text-gray-500">Tank</div>
                        <div className="font-medium">{log.snapshot.tankLevel}%</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-3 border-t text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
