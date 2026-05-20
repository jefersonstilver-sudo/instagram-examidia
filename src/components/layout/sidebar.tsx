"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Radar,
  FileText,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  FolderOpen,
  BarChart3,
  Target,
  Megaphone,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/radar", label: "Radar", icon: Radar },
  { href: "/conteudos", label: "Conteudos", icon: FileText },
  { href: "/gerador", label: "Gerador IA", icon: Sparkles },
  { href: "/aprovacoes", label: "Aprovacoes", icon: CheckCircle2 },
  { href: "/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/biblioteca", label: "Biblioteca", icon: FolderOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/estrategia", label: "Estrategia", icon: Target },
  { href: "/comercial", label: "Comercial", icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();
  const [healthScore, setHealthScore] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        if (data.current && data.posts) {
          const m = data.current;
          const posts = data.posts;
          const engScore = Math.min(100, Math.round((m.engagementAvg / 5) * 100));
          const reachScore = Math.min(100, Math.round((m.reach7d / Math.max(m.followers, 1) / 3) * 100));
          const typeCount: Record<string, number> = {};
          for (const p of posts) typeCount[p.type] = (typeCount[p.type] || 0) + 1;
          const diversityScore = Math.min(100, Object.keys(typeCount).length * 33);
          const consistencyScore = Math.min(100, Math.round((posts.length / 25) * 100));
          const overall = Math.round(engScore * 0.3 + reachScore * 0.25 + diversityScore * 0.15 + consistencyScore * 0.3);
          setHealthScore(overall);
        }
      })
      .catch(() => {});
  }, []);

  const score = healthScore ?? 0;
  const scoreColor = score >= 70 ? "text-exa-green" : score >= 50 ? "text-exa-amber" : "text-exa-red";
  const barColor = score >= 70 ? "bg-exa-green" : score >= 50 ? "bg-exa-amber" : "bg-exa-red";

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50">
        <img src="/logo-exa-white.png" alt="EXA" className="h-7 w-auto" />
        <div>
          <h1 className="text-sm font-bold tracking-tight">Growth</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
            Command Center
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-exa-red/15 text-white font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <item.icon
                className={cn("w-4 h-4", isActive && "text-exa-red")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-border/50">
        <div className="glass-card p-3 rounded-lg">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            Health Score
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${scoreColor}`}>
              {healthScore !== null ? score : "..."}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <div
              className={`${barColor} h-1.5 rounded-full transition-all`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
