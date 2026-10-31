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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  Edit,
  Play,
  Search,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

type RuleStatus = "Active" | "Inactive";
type RuleType = "Cleaning" | "Enrichment" | "Aggregation";

type RuleRow = {
  id: string;
  name: string;
  status: RuleStatus;
  target: string;
  lastRun: string;
  records: string;
  successRate: number;
  type: RuleType;
  code: string;
};

const initialRules: RuleRow[] = [
  { id: "r1", name: "Clean Email Addresses", status: "Active", target: "customers", lastRun: "2026-10-31 09:10", records: "1.2M", successRate: 98.2, type: "Cleaning", code: "SELECT LOWER(TRIM(email)) FROM customers;" },
  { id: "r2", name: "Enrich Company Data", status: "Active", target: "accounts", lastRun: "2026-10-31 08:55", records: "340k", successRate: 96.4, type: "Enrichment", code: "UPDATE accounts SET company_size = lookup(size) WHERE company_size IS NULL;" },
  { id: "r3", name: "Aggregate Daily Sales", status: "Inactive", target: "orders", lastRun: "2026-10-30 22:00", records: "845k", successRate: 99.1, type: "Aggregation", code: "SELECT date, SUM(total) FROM orders GROUP BY date;" },
  { id: "r4", name: "Normalize Phone Numbers", status: "Active", target: "customers", lastRun: "2026-10-31 08:30", records: "1.2M", successRate: 97.8, type: "Cleaning", code: "REGEXP_REPLACE(phone, '[^0-9]', '')" },
  { id: "r5", name: "Enrich Geo Location", status: "Active", target: "events", lastRun: "2026-10-31 08:10", records: "4.5M", successRate: 95.6, type: "Enrichment", code: "GEOCODE(ip_address) -> country, city" },
  { id: "r6", name: "Deduplicate Records", status: "Active", target: "inventory", lastRun: "2026-10-31 07:45", records: "540k", successRate: 99.5, type: "Cleaning", code: "ROW_NUMBER() OVER (PARTITION BY key)" },
];

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const typeData = [
  { name: "Cleaning", value: 3, color: "#3B82F6" },
  { name: "Enrichment", value: 2, color: "#8B5CF6" },
  { name: "Aggregation", value: 1, color: "#14B8A6" },
];

const gaugeData = [{ name: "Success", value: 97.4, fill: "#FF6B00" }];

export default function TransformationsPage() {
  const [rules, setRules] = useState<RuleRow[]>(initialRules);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [modalRule, setModalRule] = useState<RuleRow | null>(null);

  const filtered = useMemo(() => {
    return rules.filter((r) => {
      if (search && !`${r.name} ${r.target}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [rules, search]);

  const toggleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r))
    );
  };

  const columns: ColumnDef<typeof features, RuleRow>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Rule Name" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: RuleRow } }) => {
          const r = row.original;
          return (
            <button
              onClick={() => toggleStatus(r.id)}
              className={
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors " +
                (r.status === "Active" ? "bg-green-500" : "bg-gray-600")
              }
            >
              <span
                className={
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform " +
                  (r.status === "Active" ? "translate-x-4" : "translate-x-0.5")
                }
              />
            </button>
          );
        },
      },
      { accessorKey: "target", header: "Applied To" },
      { accessorKey: "lastRun", header: "Last Run" },
      { accessorKey: "records", header: "Records Processed" },
      {
        accessorKey: "successRate",
        header: "Success Rate",
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const v = getValue() as number;
          return <span>{v.toFixed(1)}%</span>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: RuleRow } }) => {
          const r = row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalRule(r)}
                className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700"
                title="Edit"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700" title="Test">
                <Play className="h-3.5 w-3.5" />
              </button>
              <button className="rounded-lg border border-gray-800 bg-[#0B0F19] p-1.5 text-gray-300 hover:border-gray-700" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
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

  const activeRules = rules.filter((r) => r.status === "Active").length;
  const failed = rules.filter((r) => r.successRate < 97).length;

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-300 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Wand2 className="h-5 w-5 text-orange-500" />
            <h1 className="text-xl font-semibold text-white">Transformations Dashboard</h1>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Active Transformation Rules</p>
            <p className="text-xl font-semibold text-white">{activeRules}</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Total Rules Applied (24h)</p>
            <p className="text-xl font-semibold text-white">18.4K</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Records Enriched</p>
            <p className="text-xl font-semibold text-white">6.2M</p>
          </div>
          <div className="bg-[#0F1523] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Failed Transformations</p>
            <p className="text-xl font-semibold text-red-500">{failed}</p>
          </div>
        </div>

        <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Transformation Rules</h2>
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-[#0B0F19] px-3 py-1.5">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rules..."
                className="bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-600 w-40"
              />
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
              <p className="py-6 text-center text-gray-500 text-sm">No rules found.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Transformation Success Rate
            </h2>
            <div className="h-64 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={180} endAngle={0}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={10} fill="#FF6B00" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-2xl font-bold text-white">97.4%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F1523] border border-gray-800 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Rules Applied by Type
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeData} innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                    {typeData.map((entry) => (
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

        {modalRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-[600px] rounded-lg border border-gray-800 bg-[#0F1523] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Edit Rule: {modalRule.name}</h3>
                <button onClick={() => setModalRule(null)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="rounded-lg bg-[#0B0F19] border border-gray-800 p-4 font-mono text-sm text-gray-300 h-48 overflow-auto">
                {modalRule.code}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setModalRule(null)} className="rounded-lg border border-gray-800 px-4 py-1.5 text-sm text-gray-300 hover:border-gray-700">
                  Cancel
                </button>
                <button onClick={() => setModalRule(null)} className="rounded-lg bg-orange-500 px-4 py-1.5 text-sm text-white hover:bg-orange-600">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
