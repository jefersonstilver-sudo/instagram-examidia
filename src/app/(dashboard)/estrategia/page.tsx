"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Users, Loader2, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, Radar as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

interface Post {
  id: string;
  type: string;
  title: string;
  likes: number;
  comments: number;
  reach: number;
  saves: number;
  shares: number;
  engagementRate: number;
}

interface Metrics {
  followers: number;
  reach7d: number;
  engagementAvg: number;
  totalLikes30d: number;
  totalComments30d: number;
  totalShares30d: number;
  totalSaves30d: number;
}

const audienceSplit = [
  { name: "Anunciantes", value: 45, color: "oklch(0.60 0.24 25)" },
  { name: "Sindicos", value: 20, color: "oklch(0.75 0.14 210)" },
  { name: "Moradores", value: 25, color: "oklch(0.72 0.19 160)" },
  { name: "Geral", value: 10, color: "oklch(0.60 0 0)" },
];

const insightIcons: Record<string, { icon: React.ElementType; color: string }> = {
  warning: { icon: AlertTriangle, color: "text-exa-amber" },
  opportunity: { icon: Lightbulb, color: "text-exa-cyan" },
  success: { icon: CheckCircle2, color: "text-exa-green" },
};

function generateInsights(posts: Post[], metrics: Metrics) {
  const insights: Array<{ type: string; title: string; desc: string }> = [];

  // Funnel analysis
  const typeCount: Record<string, number> = {};
  for (const p of posts) typeCount[p.type] = (typeCount[p.type] || 0) + 1;
  const total = posts.length || 1;
  const reelPct = ((typeCount["reel"] || 0) / total) * 100;
  const carouselPct = ((typeCount["carousel"] || 0) / total) * 100;

  if (reelPct > 50) {
    insights.push({ type: "warning", title: "Excesso de Reels", desc: `${reelPct.toFixed(0)}% dos posts sao Reels. Diversifique com carrosseis educativos para aumentar salvamentos.` });
  }
  if (carouselPct > 50) {
    insights.push({ type: "success", title: "Carrosseis dominando", desc: `${carouselPct.toFixed(0)}% dos posts sao carrosseis. Taxa de salvamento acima da media.` });
  }

  // Engagement analysis
  if (metrics.engagementAvg >= 3) {
    insights.push({ type: "success", title: "Engajamento acima da media", desc: `Taxa de ${metrics.engagementAvg}% esta acima da media do setor (1-3%). Manter cadencia.` });
  } else if (metrics.engagementAvg < 1.5) {
    insights.push({ type: "warning", title: "Engajamento abaixo do ideal", desc: `Taxa de ${metrics.engagementAvg}% pode melhorar. Foque em CTAs e conteudo interativo.` });
  }

  // Saves vs likes ratio
  if (metrics.totalSaves30d > 0 && metrics.totalLikes30d > 0) {
    const saveRatio = (metrics.totalSaves30d / metrics.totalLikes30d) * 100;
    if (saveRatio > 20) {
      insights.push({ type: "success", title: "Alto indice de salvamentos", desc: `Ratio save/like de ${saveRatio.toFixed(1)}%. Conteudo percebido como util e referencia.` });
    }
  }

  // Copa 2026 opportunity
  insights.push({ type: "opportunity", title: "Copa 2026 — janela de oportunidade", desc: "Criar serie de conteudos ligando turismo + midia indoor. Potencial de alcance 3x maior." });

  // Syndic content gap
  insights.push({ type: "opportunity", title: "Conteudo para sindicos", desc: "Sindicos decidem instalacao de telas. Priorize conteudos educativos para esse publico." });

  return insights;
}

export default function EstrategiaPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        if (data.current) setMetrics(data.current);
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-exa-red animate-spin" />
        <span className="ml-3 text-sm text-muted-foreground">Analisando estrategia...</span>
      </div>
    );
  }

  // Calculate funnel from real posts
  const typeCount: Record<string, number> = {};
  for (const p of posts) typeCount[p.type] = (typeCount[p.type] || 0) + 1;
  const total = posts.length || 1;

  const funnelData = [
    { stage: "Reels (Alcance)", target: 40, current: Math.round(((typeCount["reel"] || 0) / total) * 100), status: "" },
    { stage: "Carrosseis (Educacao)", target: 35, current: Math.round(((typeCount["carousel"] || 0) / total) * 100), status: "" },
    { stage: "Posts (Autoridade)", target: 25, current: Math.round(((typeCount["post"] || 0) / total) * 100), status: "" },
  ];
  for (const f of funnelData) {
    f.status = f.current > f.target + 10 ? "excesso" : f.current < f.target - 10 ? "atencao" : "ok";
  }

  // Calculate brand health from real data
  const m = metrics || { followers: 0, reach7d: 0, engagementAvg: 0, totalLikes30d: 0, totalComments30d: 0, totalShares30d: 0, totalSaves30d: 0 };
  const brandHealth = [
    { metric: "Alcance", value: Math.min(100, Math.round((m.reach7d / Math.max(m.followers, 1)) * 10)) },
    { metric: "Engajamento", value: Math.min(100, Math.round(m.engagementAvg * 20)) },
    { metric: "Conversao", value: Math.min(100, Math.round((m.totalSaves30d / Math.max(m.totalLikes30d, 1)) * 200)) },
    { metric: "Autoridade", value: Math.min(100, Math.round((m.totalComments30d / Math.max(posts.length, 1)) * 10)) },
    { metric: "Consistencia", value: Math.min(100, Math.round((posts.length / 25) * 100)) },
    { metric: "Diversidade", value: Math.min(100, Object.keys(typeCount).length * 33) },
  ];

  const strategicInsights = metrics ? generateInsights(posts, metrics) : [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-exa-red" />
          Estrategia
        </h1>
        <p className="text-sm text-muted-foreground">
          Diagnostico baseado em {posts.length} posts reais do @examidia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel balance */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Mix de Formatos (Real)</h3>
          <div className="space-y-4">
            {funnelData.map((item) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{item.stage}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {item.current}% (meta: {item.target}%)
                  </span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.status === "excesso" ? "bg-exa-amber" : item.status === "atencao" ? "bg-exa-red" : "bg-exa-green"
                    }`}
                    style={{ width: `${Math.min(item.current, 100)}%` }}
                  />
                </div>
                {item.status === "excesso" && (
                  <p className="text-[10px] text-exa-amber mt-1">Acima da meta — diversificar</p>
                )}
                {item.status === "atencao" && (
                  <p className="text-[10px] text-exa-red mt-1">Abaixo da meta — produzir mais</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Brand health radar */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Saude da Marca (dados reais)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={brandHealth}>
              <PolarGrid stroke="oklch(1 0 0 / 10%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "oklch(0.70 0 0)" }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <RechartsRadar dataKey="value" stroke="oklch(0.60 0.24 25)" fill="oklch(0.60 0.24 25)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Audience split + strategic insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Distribuicao de Publico-Alvo</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={audienceSplit} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                {audienceSplit.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {audienceSplit.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass-card p-6 lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Insights Estrategicos (IA)</h3>
          <div className="space-y-3">
            {strategicInsights.map((insight, i) => {
              const config = insightIcons[insight.type];
              const Icon = config.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                  <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                  <div>
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{insight.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
