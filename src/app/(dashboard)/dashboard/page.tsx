"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { currentMetrics as fallbackMetrics, mockMetrics as fallbackDailyMetrics, healthScore as fallbackHealthScore } from "@/data/mock-instagram";
import { mockInsights } from "@/data/mock-radar";
import { mockContentPipeline, statusLabels, statusColors } from "@/data/mock-content";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  delay?: number;
}) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        {change !== undefined && (
          <div
            className={`flex items-center gap-0.5 text-xs ${
              isPositive ? "text-exa-green" : "text-destructive"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(change)}
            {changeLabel && (
              <span className="text-muted-foreground ml-0.5">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function HealthScoreWidget() {
  const statusColorMap: Record<string, string> = {
    acelerando: "text-exa-green",
    saudavel: "text-exa-green",
    estavel: "text-exa-cyan",
    atencao: "text-exa-amber",
    estagnado: "text-destructive",
    critico: "text-destructive",
  };
  const ringColor = statusColorMap[fallbackHealthScore.status] || "text-exa-amber";

  return (
    <motion.div className="glass-card p-6" {...fadeIn} transition={{ delay: 0.2 }}>
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        Health Score do Instagram
      </h3>
      <div className="flex items-center gap-6">
        {/* Score circle */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              className="text-muted/50"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              className={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${fallbackHealthScore.overall * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{fallbackHealthScore.overall}</span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {[
            { label: "Crescimento", value: fallbackHealthScore.growth },
            { label: "Engajamento", value: fallbackHealthScore.engagement },
            { label: "Consistencia", value: fallbackHealthScore.consistency },
            { label: "Diversidade", value: fallbackHealthScore.diversity },
            { label: "Comercial", value: fallbackHealthScore.commercial },
            { label: "Tendencias", value: fallbackHealthScore.trends },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-24">
                {item.label}
              </span>
              <div className="flex-1 bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    item.value >= 70
                      ? "bg-exa-green"
                      : item.value >= 50
                      ? "bg-exa-amber"
                      : "bg-destructive"
                  }`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="text-[11px] font-mono w-8 text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 p-3 rounded-lg bg-exa-amber/5 border border-exa-amber/10">
        <p className="text-xs text-exa-amber">
          {fallbackHealthScore.statusDescription}
        </p>
      </div>
    </motion.div>
  );
}

function InsightCard({
  insight,
  delay,
}: {
  insight: (typeof mockInsights)[0];
  delay: number;
}) {
  const typeConfig = {
    warning: { icon: AlertTriangle, color: "text-exa-amber", bg: "bg-exa-amber/10", border: "border-exa-amber/20" },
    opportunity: { icon: Lightbulb, color: "text-exa-green", bg: "bg-exa-green/10", border: "border-exa-green/20" },
    insight: { icon: Zap, color: "text-exa-cyan", bg: "bg-exa-cyan/10", border: "border-exa-cyan/20" },
  };
  const config = typeConfig[insight.type];

  return (
    <motion.div
      className={`glass-card p-4 border ${config.border}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <config.icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium truncate">{insight.title}</h4>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono uppercase ${
                insight.priority === "alta"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {insight.priority}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {insight.description}
          </p>
          <p className="text-xs text-foreground/80">
            <span className="text-muted-foreground">Acao: </span>
            {insight.recommendation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function GrowthChart() {
  const data = fallbackDailyMetrics.slice(-14);
  return (
    <motion.div className="glass-card p-6" {...fadeIn} transition={{ delay: 0.3 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
          Crescimento de Seguidores (14 dias)
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          {fallbackMetrics.followers} total
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradFollowers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.60 0.24 25)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="oklch(0.60 0.24 25)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="dateLabel"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }}
            domain={["dataMin - 5", "dataMax + 5"]}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.18 0.012 260)",
              border: "1px solid oklch(1 0 0 / 10%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="followers"
            stroke="oklch(0.60 0.24 25)"
            strokeWidth={2}
            fill="url(#gradFollowers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function EngagementChart() {
  const data = fallbackDailyMetrics.slice(-14);
  return (
    <motion.div className="glass-card p-6" {...fadeIn} transition={{ delay: 0.35 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
          Alcance Diario (14 dias)
        </h3>
        <span className="text-xs text-exa-green font-mono">
          +{fallbackMetrics.reach7d.toLocaleString()} 7d
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            dataKey="dateLabel"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.18 0.012 260)",
              border: "1px solid oklch(1 0 0 / 10%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="reach" fill="oklch(0.75 0.14 210)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function ContentPipeline() {
  const pending = mockContentPipeline.filter(
    (c) =>
      c.status === "pending_theme" ||
      c.status === "pending_script" ||
      c.status === "pending_creative"
  );
  const inProgress = mockContentPipeline.filter(
    (c) =>
      c.status === "script_building" ||
      c.status === "creative_generating" ||
      c.status === "script_approved"
  );
  const scheduled = mockContentPipeline.filter((c) => c.status === "scheduled");
  const published = mockContentPipeline.filter((c) => c.status === "published");

  const sections = [
    { label: "Pendente", count: pending.length, color: "bg-exa-amber" },
    { label: "Em producao", count: inProgress.length, color: "bg-exa-cyan" },
    { label: "Agendado", count: scheduled.length, color: "bg-blue-500" },
    { label: "Publicado", count: published.length, color: "bg-exa-green" },
  ];

  return (
    <motion.div className="glass-card p-6" {...fadeIn} transition={{ delay: 0.4 }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
          Pipeline Editorial
        </h3>
        <span className="text-xs text-muted-foreground">
          {mockContentPipeline.length} conteudos
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {sections.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-bold mb-1">{s.count}</div>
            <div className="flex items-center justify-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-[10px] text-muted-foreground">
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {mockContentPipeline.slice(0, 4).map((content) => (
          <div
            key={content.id}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                statusColors[content.status]
              }`}
            >
              {statusLabels[content.status]}
            </div>
            <span className="text-sm flex-1 truncate">{content.title}</span>
            <span className="text-[10px] text-muted-foreground uppercase">
              {content.format}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RadarTicker() {
  return (
    <motion.div className="glass-card p-4 overflow-hidden" {...fadeIn} transition={{ delay: 0.45 }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-exa-red animate-pulse" />
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
          Radar ao Vivo
        </h3>
      </div>
      <div className="space-y-2">
        {[
          { text: "Copa 2026 impacta hotelaria de Foz - reservas +40%", tag: "HYPE", tagColor: "text-exa-red" },
          { text: "Cataratas batem recorde de visitantes em maio", tag: "LOCAL", tagColor: "text-exa-cyan" },
          { text: "Google lanca IA que cria anuncios automaticamente", tag: "TREND", tagColor: "text-exa-amber" },
          { text: "Eletromidia lanca AR em elevadores de SP", tag: "CONCORRENTE", tagColor: "text-purple-400" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span className={`font-mono text-[10px] ${item.tagColor}`}>
              [{item.tag}]
            </span>
            <span className="truncate">{item.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [dataSource, setDataSource] = useState<string>("loading");

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        setDataSource(data.source || "mock");
        if (data.current) {
          setMetrics(data.current);
        }
      })
      .catch(() => setDataSource("mock"));
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Data source indicator */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        {dataSource === "instagram_api" ? (
          <>
            <Wifi className="w-3 h-3 text-exa-green" />
            <span className="text-exa-green">Dados reais do Instagram @examidia</span>
          </>
        ) : dataSource === "loading" ? (
          <>
            <Clock className="w-3 h-3 animate-spin" />
            <span>Carregando dados...</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-exa-amber" />
            <span className="text-exa-amber">Dados simulados — configure a Instagram API para dados reais</span>
          </>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard
          label="Seguidores"
          value={metrics.followers.toLocaleString()}
          change={metrics.followersGrowth7d}
          changeLabel="7d"
          icon={Users}
          delay={0}
        />
        <StatCard
          label="Alcance 7d"
          value={metrics.reach7d.toLocaleString()}
          change={12}
          changeLabel="%"
          icon={Eye}
          delay={0.05}
        />
        <StatCard
          label="Engajamento"
          value={`${metrics.engagementAvg}%`}
          change={0.8}
          changeLabel="pp"
          icon={Heart}
          delay={0.1}
        />
        <StatCard
          label="Salvamentos"
          value={metrics.totalSaves30d}
          change={18}
          changeLabel="%"
          icon={Bookmark}
          delay={0.15}
        />
        <StatCard
          label="Compartilhamentos"
          value={metrics.totalShares30d}
          change={-5}
          changeLabel="%"
          icon={Share2}
          delay={0.2}
        />
        <StatCard
          label="Comentarios"
          value={metrics.totalComments30d}
          change={23}
          changeLabel="%"
          icon={MessageCircle}
          delay={0.25}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Health + Insights */}
        <div className="space-y-6">
          <HealthScoreWidget />
          <RadarTicker />
        </div>

        {/* Center - Charts */}
        <div className="space-y-6">
          <GrowthChart />
          <EngagementChart />
        </div>

        {/* Right column - Pipeline + Insights */}
        <div className="space-y-6">
          <ContentPipeline />
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-exa-red" />
          Insights da IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockInsights.slice(0, 5).map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}
