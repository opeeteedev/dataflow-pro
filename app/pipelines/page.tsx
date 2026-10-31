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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Filter,
  Pause,
  Play,
  Search,
  Settings,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

type PipelineStatus = "Running" | "Success" | "Failed" | "Paused";

type PipelineRow = {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: PipelineStatus;
  lastRun: string;
  duration: string;
  records: string;
};

const initialPipelines: PipelineRow[] = [
  { id: "p1", name: "E-Commerce Sync", source: "Shopify", destination: "Snowflake", status: "Running", lastRun: "2026-10-31 09:12", duration: "4m 12s", records: "1.2M" },
  { id: "p2", name: "User Events Ingestion", source: "Segment", destination: "BigQuery", status: "Success", lastRun: "2026-10-31 08:45", duration: "2m 45s", records: "845k" },
  { id: "p3", name: "Marketing Attribution", source: "Google Ads", destination: "Redshift", status: "Failed", lastRun: "2026-10-31 08:30", duration: "1m 10s", records: "320k" },
  { id: "p4", name: "Order Processing", source: "Stripe", destination: "Postgres", status: "Success", lastRun: "2026-10-31 08:15", duration: "6m 02s", records: "2.1M" },
  { id: "p5", name: "Inventory Update", source: "ERP", destination: "Elasticsearch", status: "Paused", lastRun: "2026-10-30 23:10", duration: "3m 18s", records: "540k" },
  { id: "p6", name: "Customer 360", source: "Salesforce", destination: "Databricks", status: "Running", lastRun: "2026-10-31 09:05", duration: "5m 33s", records: "980k" },
  { id: "p7", name: "Log Aggregation", source: "Kafka", destination: "S3", status: "Success", lastRun: "2026-10-31 07:50", duration: "1m 55s", records: "4.5M" },
  { id: "p8", name: "ML Feature Pipeline", source: "S3", destination: "Feature Store", status: "Failed", lastRun: "2026-10-31 07:20", duration: "8m 12s", records: "1.1M" },
];

const statuses: Array<PipelineStatus | "All"> = ["All", "Running", "Success", "Failed", "Paused"];

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const durationTrend = Array.from({ length: 10 }, (_, i) => ({
  run: `Run ${i + 1}`,
  duration: 120 + Math.round(Math.sin(i / 2) * 40 + i * 8),
}));

const successFailureData = [
  { name: "Success", value: 74, color: "#10B981" },
  { name: "Failed", value: 26, color: "#EF4444" },
];

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<PipelineRow[]>(initialPipelines);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PipelineStatus | "All">("All");
  const [selectedId, setSelectedId] = useState<string>(initialPipelines[0].id);

  const filtered = useMemo(() => {
    return pipelines.filter((p) => {
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (search && !`${p.name} ${p.source} ${p.destination}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [pipelines, search, statusFilter]);

  const toggleStatus = (id: string) => {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next: PipelineStatus =
          p.status === "Running" ? "Paused" : p.status === "Paused" ? "Running" : "Running";
        return { ...p, status: next };
      })
    );
  };

  const columns: ColumnDef<typeof features, PipelineRow>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Pipeline Name" },
      { accessorKey: "source", header: "Source" },
      { accessorKey: "destination", header: "Destination" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as PipelineStatus;
          const color =
            v === "Running"
              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
              : v === "Success"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : v === "Failed"
              ? "bg-red-500/10 text-red-500 border-red-500/20"
              : "bg-gray-500/10 text-gray-400 border-gray-500/20";
          return (
            <span className={"rounded-full px-2 py-0.5 text-xs font-medium border " + color}>{v}</span>
          );
        },
      },
      { accessorKey: "lastRun", header: "Last Run" },
      { accessorKey: "duration", header: "Duration" },
      { accessorKey: "records", header: "Records" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: PipelineRow } }) => {
          const p = row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleStatus(p.id)}
                className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700"
                title="Run/Pause"
              >
                {p.status === "Running" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700" title="Settings">
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        },
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

  const total = pipelines.length;
  const active = pipelines.filter((p) => p.status === "Running").length;
  const failed = pipelines.filter((p) => p.status === "Failed").length;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-300 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-white">Pipelines Dashboard</h1>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Total Pipelines</p>
            <p className="text-xl font-semibold text-white">{total}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Active</p>
            <p className="text-xl font-semibold text-green-500">{active}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Failed</p>
            <p className="text-xl font-semibold text-red-500">{failed}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Avg. Run Duration</p>
            <p className="text-xl font-semibold text-white">4m 32s</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Total Records (24h)</p>
            <p className="text-xl font-semibold text-white">12.4M</p>
          </div>
        </div>

        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Pipelines</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pipelines..."
                  className="bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-600 w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PipelineStatus | "All")}
                  className="rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5 text-sm text-gray-300"
                >
                  {statuses.map((s) => (
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
                  <tr
                    key={row.id}
                    className="border-t border-gray-800 cursor-pointer hover:bg-gray-800/30"
                    onClick={() => setSelectedId(row.original.id)}
                  >
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
              <p className="py-6 text-center text-gray-500 text-sm">No pipelines found.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Run Duration Trend (Last 10 Runs) — {pipelines.find((p) => p.id === selectedId)?.name}
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={durationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="run" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="duration" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Success vs. Failure (30 Days)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={successFailureData} innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                    {successFailureData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
