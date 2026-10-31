"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  RefreshCw,
  Server,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

type NodeStatus = "Healthy" | "Degraded" | "Offline";

type NodeRow = {
  id: string;
  name: string;
  status: NodeStatus;
  cpu: number;
  memory: number;
  disk: string;
  uptime: string;
};

const initialNodes: NodeRow[] = [
  { id: "n1", name: "node-ingest-01", status: "Healthy", cpu: 42, memory: 61, disk: "120 MB/s", uptime: "14d 3h" },
  { id: "n2", name: "node-transform-01", status: "Healthy", cpu: 68, memory: 74, disk: "85 MB/s", uptime: "14d 3h" },
  { id: "n3", name: "node-dest-01", status: "Degraded", cpu: 89, memory: 92, disk: "40 MB/s", uptime: "2d 1h" },
  { id: "n4", name: "node-api-01", status: "Healthy", cpu: 35, memory: 48, disk: "200 MB/s", uptime: "30d 12h" },
  { id: "n5", name: "node-queue-01", status: "Offline", cpu: 0, memory: 0, disk: "0 MB/s", uptime: "0d 0h" },
  { id: "n6", name: "node-cache-01", status: "Healthy", cpu: 27, memory: 39, disk: "60 MB/s", uptime: "21d 5h" },
];

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const latencyData = Array.from({ length: 30 }, (_, i) => ({
  t: `${i}:00`,
  latency: 90 + Math.round(Math.sin(i / 4) * 40 + (i % 5 === 0 ? 30 : 0)),
}));

const services = [
  { name: "API Gateway", status: "Healthy" },
  { name: "Data Ingestion", status: "Healthy" },
  { name: "Transformation Service", status: "Degraded" },
  { name: "Storage Layer", status: "Healthy" },
];

export default function MonitoringPage() {
  const [nodes, setNodes] = useState<NodeRow[]>(initialNodes);
  const [sorting, setSorting] = useState<SortingState>([]);

  const refresh = useCallback(() => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.status === "Offline") return n;
        const cpu = Math.max(5, Math.min(99, n.cpu + Math.round((Math.random() - 0.5) * 10)));
        const memory = Math.max(5, Math.min(99, n.memory + Math.round((Math.random() - 0.5) * 8)));
        const status: NodeStatus = cpu > 85 || memory > 90 ? "Degraded" : "Healthy";
        return { ...n, cpu, memory, status };
      })
    );
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, 10000);
    return () => clearInterval(id);
  }, [refresh]);

  const columns: ColumnDef<typeof features, NodeRow>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Node Name" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as NodeStatus;
          const color =
            v === "Healthy"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : v === "Degraded"
              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20";
          return <span className={"rounded-full px-2 py-0.5 text-xs font-medium border " + color}>{v}</span>;
        },
      },
      {
        accessorKey: "cpu",
        header: "CPU Usage",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as number;
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${v}%` }} />
              </div>
              <span className="text-xs text-gray-400">{v}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: "memory",
        header: "Memory Usage",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as number;
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${v}%` }} />
              </div>
              <span className="text-xs text-gray-400">{v}%</span>
            </div>
          );
        },
      },
      { accessorKey: "disk", header: "Disk I/O" },
      { accessorKey: "uptime", header: "Uptime" },
    ],
    []
  );

  const table = useTable({
    features,
    data: nodes,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  });

  const healthy = nodes.filter((n) => n.status === "Healthy").length;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-300 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-orange-500" />
            <h1 className="text-xl font-semibold text-white">Monitoring Dashboard</h1>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0F1523] px-3 py-1.5 text-sm text-gray-300 hover:border-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">System Uptime</p>
            <p className="text-xl font-semibold text-green-500">99.98%</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Avg. Latency</p>
            <p className="text-xl font-semibold text-white">120ms</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Active Nodes</p>
            <p className="text-xl font-semibold text-white">{healthy}/{nodes.length}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Throughput</p>
            <p className="text-xl font-semibold text-white">3.2 GB/s</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Error Rate</p>
            <p className="text-xl font-semibold text-red-500">0.02%</p>
          </div>
        </div>

        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
            Latency Over Time
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="t" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} />
                <Area type="monotone" dataKey="latency" stroke="#10B981" strokeWidth={2} fill="url(#latencyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Node Status</h2>
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
          </div>
        </div>

        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Service Dependency Map</h2>
          <div className="flex items-center justify-between gap-4">
            {services.map((s, i) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-800 bg-[#0B0F19] p-4 min-w-[140px]">
                  <Server className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-200 text-center">{s.name}</span>
                  <span
                    className={
                      "h-2 w-2 rounded-full " +
                      (s.status === "Healthy" ? "bg-green-500" : s.status === "Degraded" ? "bg-yellow-500" : "bg-red-500")
                    }
                  />
                </div>
                {i < services.length - 1 && (
                  <div className="flex-1 h-px bg-gray-700 min-w-[40px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
