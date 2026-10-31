"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Info,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

type AlertSeverity = "Critical" | "Warning" | "Info";
type AlertStatus = "Active" | "Resolved";

type AlertItem = {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  status: AlertStatus;
};

const initialAlerts: AlertItem[] = [
  { id: "a1", severity: "Critical", title: "High Latency Detected in E-Commerce Sync", description: "Pipeline latency exceeded 5s threshold for 3 consecutive runs.", timestamp: "2 hours ago", status: "Active" },
  { id: "a2", severity: "Warning", title: "Missing values in customer_id column", description: "Detected 1,240 null values in the last batch.", timestamp: "3 hours ago", status: "Active" },
  { id: "a3", severity: "Info", title: "Scheduled maintenance window", description: "Planned downtime for node-transform-01 at 02:00 UTC.", timestamp: "5 hours ago", status: "Active" },
  { id: "a4", severity: "Critical", title: "Node node-queue-01 is Offline", description: "No heartbeat received for 10 minutes.", timestamp: "6 hours ago", status: "Active" },
  { id: "a5", severity: "Warning", title: "Duplicate records in orders table", description: "56 duplicate rows detected in last sync.", timestamp: "8 hours ago", status: "Resolved" },
  { id: "a6", severity: "Info", title: "New source connected: Stripe API", description: "Stripe API source successfully onboarded.", timestamp: "1 day ago", status: "Resolved" },
];

const alertVolume = [
  { day: "Mon", alerts: 4 },
  { day: "Tue", alerts: 6 },
  { day: "Wed", alerts: 3 },
  { day: "Thu", alerts: 8 },
  { day: "Fri", alerts: 5 },
  { day: "Sat", alerts: 2 },
  { day: "Sun", alerts: 7 },
];

const tabs = ["All", "Critical", "Warning", "Resolved"] as const;

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const resolve = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a)));
  };

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (tab === "All") return true;
      if (tab === "Resolved") return a.status === "Resolved";
      return a.severity === tab && a.status === "Active";
    });
  }, [alerts, tab]);

  const activeCount = alerts.filter((a) => a.status === "Active").length;
  const criticalCount = alerts.filter((a) => a.severity === "Critical" && a.status === "Active").length;
  const resolvedCount = alerts.filter((a) => a.status === "Resolved").length;

  const borderColor = (s: AlertSeverity) =>
    s === "Critical" ? "border-l-red-500" : s === "Warning" ? "border-l-yellow-500" : "border-l-blue-500";

  const iconFor = (s: AlertSeverity) => {
    if (s === "Critical") return AlertTriangle;
    if (s === "Warning") return AlertTriangle;
    return Info;
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-300 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-orange-500" />
            <h1 className="text-xl font-semibold text-white">Alerts Dashboard</h1>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Active Alerts</p>
            <p className="text-xl font-semibold text-white">{activeCount}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Critical Alerts</p>
            <p className="text-xl font-semibold text-red-500">{criticalCount}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Resolved (24h)</p>
            <p className="text-xl font-semibold text-green-500">{resolvedCount}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">MTTR</p>
            <p className="text-xl font-semibold text-white">42m</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "rounded-lg px-3 py-1.5 text-sm transition-colors " +
                (tab === t ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "text-gray-400 hover:text-gray-200")
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {filtered.map((a) => {
            const Icon = iconFor(a.severity);
            return (
              <div
                key={a.id}
                className={
                  "flex items-start gap-4 rounded-lg border border-gray-800 bg-[#0F1523] p-4 border-l-4 " +
                  borderColor(a.severity) +
                  (a.status === "Resolved" ? " opacity-50" : "")
                }
              >
                <Icon
                  className={
                    "h-5 w-5 shrink-0 mt-0.5 " +
                    (a.severity === "Critical" ? "text-red-500" : a.severity === "Warning" ? "text-yellow-500" : "text-blue-500")
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <span className="text-xs text-gray-500">{a.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{a.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="text-xs text-orange-500 hover:underline">View Details</button>
                    {a.status === "Active" && (
                      <button
                        onClick={() => resolve(a.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-xs font-medium text-green-500 hover:bg-green-500/20"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-gray-500 text-sm">No alerts found.</p>
          )}
        </div>

        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
            Alert Volume Over Time
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="day" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} />
                <Bar dataKey="alerts" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
