"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Eye, Heart, Bookmark, Share2, MessageCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockMetrics, currentMetrics, mockPosts } from "@/data/mock-instagram";

const chartStyle = {
  background: "oklch(0.18 0.012 260)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: "8px",
  fontSize: "12px",
};

function MetricRow({ label, value, change, icon: Icon }: { label: string; value: string | number; change: number; icon: React.ElementType }) {
  const positive = change >= 0;
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono font-medium">{value}</span>
        <span className={`text-xs flex items-center gap-0.5 ${positive ? "text-exa-green" : "text-destructive"}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
}

const formatPerformance = [
  { name: "Reels", alcance: 4900, engajamento: 10.3, salvamentos: 43 },
  { name: "Carrosseis", alcance: 2115, engajamento: 6.95, salvamentos: 41.5 },
  { name: "Posts", alcance: 780, engajamento: 2.1, salvamentos: 5 },
];

const audienceData = [
  { name: "Anunciantes", value: 45 },
  { name: "Sindicos", value: 20 },
  { name: "Moradores", value: 25 },
  { name: "Geral", value: 10 },
];
const COLORS = ["oklch(0.60 0.24 25)", "oklch(0.75 0.14 210)", "oklch(0.72 0.19 160)", "oklch(0.60 0 0)"];

export default function AnalyticsPage() {
  const data14 = mockMetrics.slice(-14);
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-exa-red" />
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">Metricas detalhadas e diagnosticos</p>
      </div>

      {/* Overview metrics */}
      <div className="glass-card p-6">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Visao Geral - 30 dias</h3>
        <div className="divide-y divide-border/30">
          <MetricRow label="Seguidores" value={currentMetrics.followers} change={currentMetrics.followersGrowth30d > 0 ? 8 : -3} icon={Users} />
          <MetricRow label="Alcance Total" value={currentMetrics.reach7d.toLocaleString()} change={12} icon={Eye} />
          <MetricRow label="Engajamento Medio" value={`${currentMetrics.engagementAvg}%`} change={5} icon={Heart} />
          <MetricRow label="Salvamentos" value={currentMetrics.totalSaves30d} change={18} icon={Bookmark} />
          <MetricRow label="Compartilhamentos" value={currentMetrics.totalShares30d} change={-5} icon={Share2} />
          <MetricRow label="Comentarios" value={currentMetrics.totalComments30d} change={23} icon={MessageCircle} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth chart */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Evolucao de Seguidores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data14}>
              <defs>
                <linearGradient id="gradF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.60 0.24 25)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.60 0.24 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip contentStyle={chartStyle} />
              <Area type="monotone" dataKey="followers" stroke="oklch(0.60 0.24 25)" strokeWidth={2} fill="url(#gradF)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Format comparison */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Performance por Formato</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={formatPerformance}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "oklch(0.70 0 0)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }} />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="alcance" fill="oklch(0.60 0.24 25)" radius={[4, 4, 0, 0]} name="Alcance" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 rounded-lg bg-exa-cyan/5 border border-exa-cyan/10">
            <p className="text-xs text-exa-cyan">
              Reels superam carrosseis em 2.3x no alcance. Mas carrosseis geram 3x mais salvamentos. Mix ideal: Reels para topo de funil, carrosseis para meio.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Top posts */}
      <div className="glass-card p-6">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Melhores Posts</h3>
        <div className="space-y-3">
          {mockPosts.sort((a, b) => b.engagementRate - a.engagementRate).map((post, i) => (
            <div key={post.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{post.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-muted-foreground uppercase">{post.type}</span>
                  <span className="text-[10px] text-muted-foreground">{post.publishedAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="text-center"><span className="block text-muted-foreground">Alcance</span><span className="font-mono">{post.reach.toLocaleString()}</span></div>
                <div className="text-center"><span className="block text-muted-foreground">Eng.</span><span className="font-mono text-exa-green">{post.engagementRate}%</span></div>
                <div className="text-center"><span className="block text-muted-foreground">Saves</span><span className="font-mono">{post.saves}</span></div>
                <div className="text-center"><span className="block text-muted-foreground">Shares</span><span className="font-mono">{post.shares}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
