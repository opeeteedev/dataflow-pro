"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  GitBranch,
  Database,
  SlidersHorizontal,
  Server,
  Activity,
  Bell,
  ShieldCheck,
  Zap,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true, href: "/" },
  { label: "Pipelines", icon: GitBranch, active: false, href: "/pipelines" },
  { label: "Sources", icon: Database, active: false, href: "/sources" },
  { label: "Transformations", icon: SlidersHorizontal, active: false, href: "/transformations" },
  { label: "Destinations", icon: Server, active: false, href: "/destinations" },
  { label: "Monitoring", icon: Activity, active: false, href: "/monitoring" },
  { label: "Alerts", icon: Bell, active: false, href: "/alerts" },
  { label: "Data Quality", icon: ShieldCheck, active: false, href: "/data-quality" },
];

const pipelines = [
  { name: "E-Commerce Pipeline", color: "bg-green-500" },
  { name: "Marketing Pipeline", color: "bg-green-500" },
  { name: "Analytics Pipeline", color: "bg-orange-500" },
  { name: "ML Pipeline", color: "bg-green-500" },
  { name: "Backup Pipeline", color: "bg-red-500" },
];

export default function Sidebar() {
  return (
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
            <Link
              key={item.label}
              href={item.href}
              className={
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
                (item.active
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200")
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
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
  );
}