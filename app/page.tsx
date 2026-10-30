"use client";

import {
  LayoutDashboard,
  GitBranch,
  Database,
  SlidersHorizontal,
  Server,
  Activity,
  Bell,
  ShieldCheck,
  ChevronDown,
  Zap,
  Globe,
  Code,
  Star,
  MessageSquare,
  Filter,
  Sparkles,
  Layers,
  HardDrive,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Pipelines", icon: GitBranch, active: false },
  { label: "Sources", icon: Database, active: false },
  { label: "Transformations", icon: SlidersHorizontal, active: false },
  { label: "Destinations", icon: Server, active: false },
  { label: "Monitoring", icon: Activity, active: false },
  { label: "Alerts", icon: Bell, active: false },
  { label: "Data Quality", icon: ShieldCheck, active: false },
];

const metrics = [
  { label: "Pipeline Status", value: "Healthy", change: null, valueColor: "text-green-500", changeColor: "text-green-500" },
  { label: "Total Records", value: "2.4M", change: "+12.5%", valueColor: "text-white", changeColor: "text-green-500" },
  { label: "Success Rate", value: "98.7%", change: "+2.1%", valueColor: "text-white", changeColor: "text-green-500" },
  { label: "Processing Time", value: "4m 32s", change: "-8.3%", valueColor: "text-white", changeColor: "text-red-500" },
  { label: "Data Quality", value: "95.4%", change: "+3.2%", valueColor: "text-white", changeColor: "text-green-500" },
  { label: "Cost (This Month)", value: "$284.62", change: "-6.7%", valueColor: "text-white", changeColor: "text-green-500" },
];

const pipelineColumns = [
  {
    header: "Sources",
    nodes: [
      { icon: Globe, name: "Web Scraper", value: "125.4k", sub: "Product Data" },
      { icon: Code, name: "API Scraper", value: "89.7k", sub: "Price Data" },
      { icon: Star, name: "Review Scraper", value: "456.2k", sub: "Review Data" },
      { icon: MessageSquare, name: "Social Media Scraper", value: "1.2M", sub: "Social Data" },
    ],
  },
  {
    header: "Extraction",
    nodes: [
      { icon: Filter, name: "Data Extraction" },
      { icon: ShieldCheck, name: "Schema Validation" },
    ],
  },
  {
    header: "Transformation",
    nodes: [
      { icon: SlidersHorizontal, name: "Data Cleaning" },
      { icon: Sparkles, name: "Data Enrichment" },
      { icon: Layers, name: "Data Normalization" },
    ],
  },
  {
    header: "Destination",
    nodes: [
      { icon: Database, name: "Cleaned Dataset" },
      { icon: Server, name: "Analytics Warehouse" },
      { icon: HardDrive, name: "Data Lake" },
    ],
  },
];

const pipelines = [
  { name: "E-Commerce Pipeline", color: "bg-green-500" },
  { name: "Marketing Pipeline", color: "bg-green-500" },
  { name: "Analytics Pipeline", color: "bg-orange-500" },
  { name: "ML Pipeline", color: "bg-green-500" },
  { name: "Backup Pipeline", color: "bg-red-500" },
];

const dataQualityData = [
  { name: "Jan", value: 88 },
  { name: "Feb", value: 89 },
  { name: "Mar", value: 90 },
  { name: "Apr", value: 91 },
  { name: "May", value: 92.5 },
  { name: "Jun", value: 93.5 },
  { name: "Jul", value: 94.2 },
  { name: "Aug", value: 95 },
];

const recordsData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 180 },
  { name: "Wed", value: 150 },
  { name: "Thu", value: 210 },
  { name: "Fri", value: 175 },
  { name: "Sat", value: 95 },
  { name: "Sun", value: 130 },
];

const pieData = [
  { name: "Valid", value: 95.4 },
  { name: "Invalid", value: 2.1 },
  { name: "Missing", value: 1.5 },
  { name: "Duplicate", value: 1.0 },
];

const pieColors = ["#FF6B00", "#3B82F6", "#10B981", "#A855F7"];

const vizData = [
  { name: "Sources", value: 40 },
  { name: "Extraction", value: 20 },
  { name: "Transform", value: 25 },
  { name: "Destination", value: 15 },
];

const vizColors = ["#FF6B00", "#3B82F6", "#10B981", "#A855F7"];

const recentRuns = [
  { pipeline: "E-Commerce Sync", status: "Success", records: "1.2M", duration: "4m 12s" },
  { pipeline: "Inventory Update", status: "Success", records: "845k", duration: "2m 45s" },
  { pipeline: "Customer Events", status: "Failed", records: "320k", duration: "1m 10s" },
  { pipeline: "Order Processing", status: "Success", records: "2.1M", duration: "6m 02s" },
];

export default function Home() {
  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-300 font-sans overflow-hidden">
      <aside className="w-64 bg-[#0F1523] flex flex-col border-r border-gray-800">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
            <Zap className="h-5 w-5 text-orange-500" />
          </div>
          <span className="text-lg font-semibold text-white">DataFlow Pro</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href="#"
                className={
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
                  (item.active
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200")
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-gray-800">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Pipelines
          </p>
          <ul className="space-y-1">
            {pipelines.map((p) => (
              <li
                key={p.name}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 cursor-pointer"
              >
                <span className={"h-2 w-2 rounded-full " + p.color} />
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">E-Commerce Data Pipeline</h1>
            <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500 border border-green-500/20">
              Running
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0F1523] px-3 py-1.5 text-sm text-gray-300 hover:border-gray-700">
              Environment: Production
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0F1523] px-3 py-1.5 text-sm text-gray-300 hover:border-gray-700">
              Last 24 Hours
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 min-w-0">
            <div className="grid grid-cols-6 gap-4">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-[#0F1523] p-4 rounded-lg border border-gray-800"
                >
                  <p className="text-xs text-gray-500 mb-2">{m.label}</p>
                  <p className={"text-xl font-semibold " + m.valueColor}>
                    {m.value}
                  </p>
                  {m.change && (
                    <p className={"text-xs mt-1 " + m.changeColor}>{m.change}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 mb-0">
              <h2 className="text-sm font-semibold text-gray-300 mb-6 uppercase tracking-wider">
                Pipeline Flow
              </h2>
              <div className="grid grid-cols-4 gap-4 relative">
                {pipelineColumns.map((col, colIndex) => (
                  <div key={col.header} className="flex flex-col gap-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider text-center mb-2">
                      {col.header}
                    </p>
                    {col.nodes.map((node) => {
                      const Icon = node.icon;
                      return (
                        <div
                          key={node.name}
                          className="bg-[#131A2A] border border-gray-700 rounded-lg p-3 flex items-center gap-3 text-sm relative"
                        >
                          <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-200 truncate">{node.name}</p>
                            {(node as { sub?: string }).sub && (
                              <p className="text-xs text-gray-500 truncate">
                                {(node as { sub?: string }).sub}
                              </p>
                            )}
                          </div>
                          {"value" in node && (node as { value?: string }).value && (
                            <span className="text-xs text-gray-500">{(node as { value?: string }).value}</span>
                          )}
                          <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                          <ChevronRight className="w-4 h-4 text-orange-500 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Data Quality Over Time
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataQualityData}>
                      <defs>
                        <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} domain={[80, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }}
                        labelStyle={{ color: "#9CA3AF" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#FF6B00"
                        strokeWidth={2}
                        fill="url(#qualityGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Records Processed
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recordsData}>
                      <XAxis dataKey="name" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }}
                        labelStyle={{ color: "#9CA3AF" }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 col-span-2">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Recent Pipeline Runs
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left pb-3 font-medium">Pipeline</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                    <th className="text-left pb-3 font-medium">Records</th>
                    <th className="text-left pb-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRuns.map((run) => (
                    <tr key={run.pipeline} className="border-t border-gray-800">
                      <td className="py-3 text-gray-200">{run.pipeline}</td>
                      <td className="py-3">
                        <span
                          className={
                            "rounded-full px-2 py-0.5 text-xs font-medium border " +
                            (run.status === "Success"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20")
                          }
                        >
                          {run.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">{run.records}</td>
                      <td className="py-3 text-gray-400">{run.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

              <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 h-full">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Data Quality Breakdown
              </h2>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-2xl font-semibold text-white">95.4%</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                Data Visualization
              </h2>
              <div className="w-full h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vizData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {vizData.map((entry, index) => (
                        <Cell key={entry.name} fill={vizColors[index % vizColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                  <span className="text-2xl font-semibold text-white">2.4M</span>
                  <span className="text-xs text-gray-500">Total Records</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  AI Insights
                </h2>
                <button className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-xs font-medium text-orange-500 hover:bg-orange-500/20">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Generate Insights
                </button>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Data Quality Improvement</p>
                    <p className="text-xs text-gray-500">Quality score improved by 3.2% over the last 7 days.</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Volume Trend</p>
                    <p className="text-xs text-gray-500">Record volume up 12.5% week over week.</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Anomaly Detection</p>
                    <p className="text-xs text-gray-500">No critical anomalies detected in the last 24 hours.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                Data Quality Alerts
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-200">Missing values in customer_id column</p>
                    <p className="text-xs text-gray-500">Detected 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-red-500/5 border border-red-500/20 p-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-200">Duplicate records in orders table</p>
                    <p className="text-xs text-gray-500">Detected 5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
