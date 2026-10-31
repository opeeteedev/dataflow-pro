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
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  AlertCircle,
  Database,
  FileText,
  Filter,
  Globe,
  Search,
  Settings,
  Webhook,
  Zap,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

type SourceType = "Database" | "API" | "Webhook" | "File";
type SourceStatus = "Connected" | "Disconnected" | "Error";

type SourceRow = {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  lastSync: string;
  records: string;
  error?: string;
};

const initialSources: SourceRow[] = [
  { id: "s1", name: "PostgreSQL", type: "Database", status: "Connected", lastSync: "2026-10-31 09:10", records: "1.2M" },
  { id: "s2", name: "Stripe API", type: "API", status: "Connected", lastSync: "2026-10-31 09:05", records: "340k" },
  { id: "s3", name: "Shopify Webhook", type: "Webhook", status: "Error", lastSync: "2026-10-31 08:20", records: "120k", error: "Webhook endpoint timed out after 30s" },
  { id: "s4", name: "CSV Import", type: "File", status: "Connected", lastSync: "2026-10-30 23:00", records: "45k" },
  { id: "s5", name: "MySQL Replica", type: "Database", status: "Disconnected", lastSync: "2026-10-30 18:40", records: "890k", error: "Connection refused: ECONNREFUSED" },
  { id: "s6", name: "Salesforce API", type: "API", status: "Connected", lastSync: "2026-10-31 08:55", records: "210k" },
  { id: "s7", name: "Kafka Stream", type: "Webhook", status: "Connected", lastSync: "2026-10-31 09:12", records: "4.5M" },
  { id: "s8", name: "S3 Bucket", type: "File", status: "Connected", lastSync: "2026-10-31 07:30", records: "1.8M" },
];

const types: Array<SourceType | "All"> = ["All", "Database", "API", "Webhook", "File"];

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const barData = initialSources.map((s) => ({
  name: s.name,
  value: parseFloat(s.records.replace(/[^\d.]/g, "")) * (s.records.includes("M") ? 1000 : 1),
}));

export default function SourcesPage() {
  const [sources] = useState<SourceRow[]>(initialSources);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<SourceType | "All">("All");

  const filtered = useMemo(() => {
    return sources.filter((s) => {
      if (typeFilter !== "All" && s.type !== typeFilter) return false;
      if (search && !`${s.name} ${s.type}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [sources, search, typeFilter]);

  const typeIcon = (t: SourceType) => {
    if (t === "Database") return Database;
    if (t === "API") return Globe;
    if (t === "Webhook") return Webhook;
    return FileText;
  };

  const columns: ColumnDef<typeof features, SourceRow>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Source Name" },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as SourceType;
          const Icon = typeIcon(v);
          return (
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-400" />
              {v}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as SourceStatus;
          const color =
            v === "Connected"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : v === "Error"
              ? "bg-red-500/10 text-red-500 border-red-500/20"
              : "bg-gray-500/10 text-gray-400 border-gray-500/20";
          return <span className={"rounded-full px-2 py-0.5 text-xs font-medium border " + color}>{v}</span>;
        },
      },
      { accessorKey: "lastSync", header: "Last Sync" },
      { accessorKey: "records", header: "Records Ingested" },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700" title="Test Connection">
              <Zap className="h-3.5 w-3.5" />
            </button>
            <button className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700" title="Settings">
              <Settings className="h-3.5 w-3.5" />
            </button>
            <button className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700" title="Logs">
              <FileText className="h-3.5 w-3.5" />
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

  const activeSources = sources.filter((s) => s.status === "Connected").length;
  const errors = sources.filter((s) => s.status === "Error" || s.status === "Disconnected").length;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-300 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-white">Sources Dashboard</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Total Active Sources</p>
            <p className="text-xl font-semibold text-white">{activeSources}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Total Data Ingested (24h)</p>
            <p className="text-xl font-semibold text-white">12.4M</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Active Connectors</p>
            <p className="text-xl font-semibold text-green-500">{activeSources}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Connection Errors</p>
            <p className="text-xl font-semibold text-red-500">{errors}</p>
          </div>
        </div>

        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Source Inventory</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sources..."
                  className="bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-600 w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as SourceType | "All")}
                  className="rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5 text-sm text-gray-300"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
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
              <p className="py-6 text-center text-gray-500 text-sm">No sources found.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Data Ingested by Source (7 Days)
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis type="number" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F1523", border: "1px solid #374151", borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Connection Health
            </h2>
            <ul className="space-y-3">
              {sources.map((s) => (
                <li key={s.id} className="flex items-start gap-3 rounded-lg bg-[#0B0F19] border border-gray-800 p-3">
                  {s.status === "Connected" ? (
                    <Zap className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-gray-200">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.status}</p>
                    {s.error && <p className="text-xs text-red-400 mt-1">{s.error}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
