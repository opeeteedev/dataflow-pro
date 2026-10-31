"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  useTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Eye,
  Filter,
  Search,
  ShieldCheck,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

type QualityRow = {
  ruleName: string;
  tableAsset: string;
  dimension: string;
  status: "Failed" | "Passed";
  severity: "High" | "Medium" | "Low";
  failedRecords: number;
  lastChecked: string;
};

const kpis = [
  { title: "Overall Health Score", value: "95.4%", icon: ShieldCheck, color: "text-orange-500" },
  { title: "Completeness", value: "96.7%", icon: ShieldCheck, color: "text-blue-500" },
  { title: "Accuracy", value: "94.1%", icon: ShieldCheck, color: "text-purple-500" },
  { title: "Consistency", value: "95.7%", icon: ShieldCheck, color: "text-teal-500" },
  { title: "Timeliness", value: "95.8%", icon: ShieldCheck, color: "text-yellow-500" },
];

const trendData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: 90 + Math.round(Math.sin(i / 4) * 3 + i * 0.15 + (i % 3 === 0 ? 1 : 0)),
  };
});

const radarData = [
  { dimension: "Completeness", score: 96.7 },
  { dimension: "Accuracy", score: 94.1 },
  { dimension: "Consistency", score: 95.7 },
  { dimension: "Timeliness", score: 95.8 },
  { dimension: "Validity", score: 95.2 },
];

const violations: QualityRow[] = [
  { ruleName: "No null customer_id", tableAsset: "orders", dimension: "Completeness", status: "Failed", severity: "High", failedRecords: 1240, lastChecked: "2026-10-31 09:12" },
  { ruleName: "Valid email format", tableAsset: "customers", dimension: "Accuracy", status: "Failed", severity: "Medium", failedRecords: 312, lastChecked: "2026-10-31 09:10" },
  { ruleName: "Unique order_id", tableAsset: "orders", dimension: "Consistency", status: "Passed", severity: "Low", failedRecords: 0, lastChecked: "2026-10-31 09:08" },
  { ruleName: "Freshness < 24h", tableAsset: "events", dimension: "Timeliness", status: "Failed", severity: "High", failedRecords: 880, lastChecked: "2026-10-31 08:55" },
  { ruleName: "Valid status enum", tableAsset: "orders", dimension: "Validity", status: "Passed", severity: "Low", failedRecords: 0, lastChecked: "2026-10-31 08:50" },
  { ruleName: "No duplicate rows", tableAsset: "inventory", dimension: "Consistency", status: "Failed", severity: "Medium", failedRecords: 56, lastChecked: "2026-10-31 08:44" },
  { ruleName: "Non-negative quantity", tableAsset: "order_items", dimension: "Validity", status: "Passed", severity: "Low", failedRecords: 0, lastChecked: "2026-10-31 08:40" },
  { ruleName: "Customer exists", tableAsset: "orders", dimension: "Accuracy", status: "Failed", severity: "High", failedRecords: 204, lastChecked: "2026-10-31 08:35" },
  { ruleName: "Required fields present", tableAsset: "products", dimension: "Completeness", status: "Passed", severity: "Low", failedRecords: 0, lastChecked: "2026-10-31 08:30" },
  { ruleName: "Price > 0", tableAsset: "products", dimension: "Validity", status: "Failed", severity: "Medium", failedRecords: 18, lastChecked: "2026-10-31 08:25" },
  { ruleName: "Updated within SLA", tableAsset: "customers", dimension: "Timeliness", status: "Passed", severity: "Low", failedRecords: 0, lastChecked: "2026-10-31 08:20" },
  { ruleName: "Valid currency code", tableAsset: "orders", dimension: "Accuracy", status: "Passed", severity: "Low", failedRecords: 0, lastChecked: "2026-10-31 08:15" },
];

const dimensions = ["All", "Completeness", "Accuracy", "Consistency", "Timeliness", "Validity"];
const severities = ["All", "High", "Medium", "Low"];

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

export default function DataQualityPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [dimension, setDimension] = useState("All");
  const [severity, setSeverity] = useState("All");

  const filtered = useMemo(() => {
    return violations.filter((r) => {
      if (dimension !== "All" && r.dimension !== dimension) return false;
      if (severity !== "All" && r.severity !== severity) return false;
      if (search && !`${r.ruleName} ${r.tableAsset}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, dimension, severity]);

  const columns: ColumnDef<typeof features, QualityRow>[] = useMemo(
    () => [
      { accessorKey: "ruleName", header: "Rule Name" },
      { accessorKey: "tableAsset", header: "Table/Asset" },
      { accessorKey: "dimension", header: "Dimension" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as string;
          return (
            <span
              className={
                "rounded-full px-2 py-0.5 text-xs font-medium border " +
                (v === "Passed"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20")
              }
            >
              {v}
            </span>
          );
        },
      },
      {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as string;
          const color =
            v === "High" ? "text-red-500" : v === "Medium" ? "text-yellow-500" : "text-gray-400";
          return <span className={color}>{v}</span>;
        },
      },
      { accessorKey: "failedRecords", header: "Failed Records" },
      { accessorKey: "lastChecked", header: "Last Checked" },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <button className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-xs font-medium text-orange-500 hover:bg-orange-500/20">
            <Eye className="h-3.5 w-3.5" />
            View Details
          </button>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useTable({
    features,
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-300 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-orange-500" />
            <h1 className="text-xl font-semibold text-white">Data Quality Dashboard</h1>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.title} className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={"h-4 w-4 " + k.color} />
                  <p className="text-xs text-gray-500">{k.title}</p>
                </div>
                <p className="text-xl font-semibold text-white">{k.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Data Quality Trend (30 Days)
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="date" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} domain={[85, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} labelStyle={{ color: "#9CA3AF" }} />
                  <Area type="monotone" dataKey="score" stroke="#FF6B00" strokeWidth={2} fill="url(#scoreGradient)" />
                  <Line type="monotone" dataKey="score" stroke="#FF6B00" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Quality Dimensions Breakdown
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="dimension" stroke="#9CA3AF" fontSize={11} />
                  <PolarRadiusAxis stroke="#4B5563" fontSize={10} domain={[90, 100]} />
                  <Radar name="Score" dataKey="score" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Quality Rule Violations
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rules..."
                  className="bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-600 w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={dimension}
                  onChange={(e) => setDimension(e.target.value)}
                  className="rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5 text-sm text-gray-300"
                >
                  {dimensions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5 text-sm text-gray-300"
                >
                  {severities.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="text-gray-500 text-xs uppercase tracking-wider">
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left pb-3 font-medium cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? " ▲" : header.column.getIsSorted() === "desc" ? " ▼" : ""}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t border-gray-800">
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="py-3 text-gray-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {table.getRowModel().rows.length === 0 && (
              <p className="py-6 text-center text-gray-500 text-sm">No violations found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
