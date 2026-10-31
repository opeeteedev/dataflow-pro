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
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Cloud,
  Database,
  Filter,
  RefreshCw,
  Search,
  Server,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

type DestType = "Warehouse" | "Data Lake";
type SyncStatus = "Synced" | "Syncing" | "Error";

type DestRow = {
  id: string;
  name: string;
  type: DestType;
  region: string;
  status: SyncStatus;
  lastSync: string;
  records: string;
};

const initialDests: DestRow[] = [
  { id: "d1", name: "Snowflake", type: "Warehouse", region: "us-east-1", status: "Synced", lastSync: "2026-10-31 09:12", records: "12.4M" },
  { id: "d2", name: "BigQuery", type: "Warehouse", region: "us-central1", status: "Syncing", lastSync: "2026-10-31 09:05", records: "8.9M" },
  { id: "d3", name: "AWS S3", type: "Data Lake", region: "us-west-2", status: "Synced", lastSync: "2026-10-31 08:50", records: "45.2M" },
  { id: "d4", name: "Redshift", type: "Warehouse", region: "eu-west-1", status: "Error", lastSync: "2026-10-31 07:30", records: "6.1M" },
  { id: "d5", name: "Databricks", type: "Warehouse", region: "us-east-1", status: "Synced", lastSync: "2026-10-31 09:00", records: "18.7M" },
  { id: "d6", name: "Azure Data Lake", type: "Data Lake", region: "eastus", status: "Synced", lastSync: "2026-10-31 08:40", records: "22.3M" },
];

const statuses: Array<SyncStatus | "All"> = ["All", "Synced", "Syncing", "Error"];

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const storageData = [
  { month: "Jan", Snowflake: 120, BigQuery: 90, S3: 200 },
  { month: "Feb", Snowflake: 140, BigQuery: 110, S3: 230 },
  { month: "Mar", Snowflake: 160, BigQuery: 130, S3: 260 },
  { month: "Apr", Snowflake: 180, BigQuery: 150, S3: 290 },
  { month: "May", Snowflake: 200, BigQuery: 170, S3: 320 },
];

const syncDurationData = [
  { day: "Mon", Snowflake: 120, BigQuery: 95 },
  { day: "Tue", Snowflake: 135, BigQuery: 100 },
  { day: "Wed", Snowflake: 110, BigQuery: 88 },
  { day: "Thu", Snowflake: 150, BigQuery: 105 },
  { day: "Fri", Snowflake: 125, BigQuery: 92 },
];

const typeIcon = (t: DestType) => (t === "Warehouse" ? Database : Cloud);

export default function DestinationsPage() {
  const [dests] = useState<DestRow[]>(initialDests);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SyncStatus | "All">("All");

  const filtered = useMemo(() => {
    return dests.filter((d) => {
      if (statusFilter !== "All" && d.status !== statusFilter) return false;
      if (search && !`${d.name} ${d.type} ${d.region}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [dests, search, statusFilter]);

  const columns: ColumnDef<typeof features, DestRow>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Destination Name" },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as DestType;
          const Icon = typeIcon(v);
          return (
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-400" />
              {v}
            </span>
          );
        },
      },
      { accessorKey: "region", header: "Region" },
      {
        accessorKey: "status",
        header: "Sync Status",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as SyncStatus;
          const color =
            v === "Synced"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : v === "Syncing"
              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20";
          return <span className={"rounded-full px-2 py-0.5 text-xs font-medium border " + color}>{v}</span>;
        },
      },
      { accessorKey: "lastSync", header: "Last Sync" },
      { accessorKey: "records", header: "Records Synced" },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700" title="Sync Now">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700" title="View Logs">
              <Server className="h-3.5 w-3.5" />
            </button>
          </div>
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

  const total = dests.length;
  const synced = dests.filter((d) => d.status === "Synced").length;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-300 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-white">Destinations Dashboard</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Total Destinations</p>
            <p className="text-xl font-semibold text-white">{total}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Total Storage Used</p>
            <p className="text-xl font-semibold text-white">1.2TB</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Warehouses Connected</p>
            <p className="text-xl font-semibold text-green-500">{dests.filter((d) => d.type === "Warehouse").length}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Sync Health</p>
            <p className="text-xl font-semibold text-green-500">{Math.round((synced / total) * 100)}%</p>
          </div>
        </div>

        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Destination Status</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search destinations..."
                  className="bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-600 w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as SyncStatus | "All")}
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
              <p className="py-6 text-center text-gray-500 text-sm">No destinations found.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Storage Usage by Destination
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="month" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Snowflake" stackId="a" fill="#FF6B00" />
                  <Bar dataKey="BigQuery" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="S3" stackId="a" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Sync Duration Trend
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={syncDurationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="day" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="Snowflake" stroke="#FF6B00" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="BigQuery" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
