// src/components/sidebar/AlertsPanel.jsx
import React, { useMemo, useState } from "react";
import Card from "../common/Card";
import { Bell, AlertTriangle, Info, Zap } from "lucide-react";
import clsx from "clsx";

/**
 * AlertsPanel
 *
 * Props:
 * - alerts: Array<{ id, level: 'critical'|'warning'|'info'|'manual' , text, ts? }>
 * - onSimulate: function() -> triggers a simulated alert (optional)
 * - onAcknowledge: function(id) -> optional callback to remove/acknowledge alert upstream
 */
export default function AlertsPanel({ alerts = [], onSimulate, onAcknowledge }) {
  // local dismissed set (so dismiss doesn't require parent mutation)
  const [dismissed, setDismissed] = useState(new Set());

  // compute active alerts (reverse chronological)
  const activeAlerts = useMemo(() => {
    const arr = Array.from(alerts ?? []);
    arr.sort((a, b) => {
      const aT = typeof a.id === "number" && a.id > 1e10 ? a.id : 0;
      const bT = typeof b.id === "number" && b.id > 1e10 ? b.id : 0;
      return bT - aT || 0;
    });
    return arr.filter((a) => !dismissed.has(a.id));
  }, [alerts, dismissed]);

  const severityMap = {
    critical: { color: "bg-red-600", icon: <AlertTriangle size={14} className="text-white" /> },
    warning: { color: "bg-amber-500", icon: <Zap size={14} className="text-white" /> },
    info: { color: "bg-blue-500", icon: <Info size={14} className="text-white" /> },
    manual: { color: "bg-purple-600", icon: <Bell size={14} className="text-white" /> },
  };

  function dismiss(id) {
    // optimistic local hide
    setDismissed((s) => new Set([...s, id]));

    if (typeof onAcknowledge === "function") {
      onAcknowledge(id); // call parent handler if provided
    }
  }

  const formatTs = (a) => {
    if (a.ts) {
      const d = new Date(a.ts);
      if (!Number.isNaN(d.getTime())) return d.toLocaleString();
    }
    if (typeof a.id === "number" && a.id > 1e10) {
      return new Date(a.id).toLocaleTimeString();
    }
    return "just now";
  };

  return (
    <Card title="Alerts" variant="glass" className="p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-gray-700" />
          <div className="text-sm font-semibold">System Alerts</div>
        </div>

        <button
          onClick={() => {
            if (typeof onSimulate === "function") onSimulate();
          }}
          className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Simulate
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {activeAlerts.length === 0 ? (
          <div className="text-sm text-gray-600">No active alerts</div>
        ) : (
          activeAlerts.map((a) => {
            const level = (a.level ?? "info").toLowerCase();
            const sev = severityMap[level] ?? severityMap.info;
            return (
              <div
                key={a.id}
                className="flex items-start gap-3 p-2 rounded-md bg-white/30 backdrop-blur-sm border border-white/10"
              >
                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", sev.color)}>
                  {sev.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-gray-900">{a.text}</div>
                    <div className="text-xs text-gray-600">{formatTs(a)}</div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => dismiss(a.id)}
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
                    >
                      Dismiss
                    </button>

                    <button
                      onClick={() => dismiss(a.id)}
                      className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">Latest system messages & warnings</div>
    </Card>
  );
}
