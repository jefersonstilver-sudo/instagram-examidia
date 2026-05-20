"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Users, Megaphone, BarChart3, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, Radar as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const funnelData = [
  { stage: "Topo (Alcance)", target: 3, current: 2, status: "atencao" },
  { stage: "Meio (Educacao)", target: 4, current: 3, status: "ok" },
  { stage: "Fundo (Conversao)", target: 2, current: 4, status: "excesso" },
  { stage: "Autoridade", target: 1, current: 1, status: "ok" },
];

const audienceSplit = [
  { name: "Anunciantes", value: 45, color: "oklch(0.60 0.24 25)" },
  { name: "Sindicos", value: 20, color: "oklch(0.75 0.14 210)" },
  { name: "Moradores", value: 25, color: "oklch(0.72 0.19 160)" },
  { name: "Geral", value: 10, color: "oklch(0.60 0 0)" },
];

const brandHealth = [
  { metric: "Alcance", value: 65 },
  { metric: "Engajamento", value: 72 },
  { metric: "Conversao", value: 45 },
  { metric: "Autoridade", value: 58 },
  { metric: "Consistencia", value: 80 },
  { metric: "Inovacao", value: 40 },
];

const strategicInsights = [
  { type: "warning", title: "Funil desequilibrado", desc: "60% do conteudo e fundo de funil (conversao). Falta conteudo de topo para atrair novos seguidores." },
  { type: "opportunity", title: "Copa 2026 - janela de oportunidade", desc: "Criar serie de conteudos ligando turismo + midia indoor. Potencial de alcance 3x maior." },
  { type: "success", title: "Carrosseis educativos performando bem", desc: "Taxa de salvamento 41.5% acima da media. Manter cadencia de 2/semana." },
  { type: "warning", title: "Gap de conteudo para sindicos", desc: "Apenas 12% dos conteudos falam com sindicos. Esse publico decide instalacao." },
  { type: "opportunity", title: "Reels com dados impactantes", desc: "Reels com estatisticas no hook tem 2.3x mais alcance. Priorizar formato dado + provocacao." },
];

const insightIcons: Record<string, { icon: React.ElementType; color: string }> = {
  warning: { icon: AlertTriangle, color: "text-exa-amber" },
  opportunity: { icon: Lightbulb, color: "text-exa-cyan" },
  success: { icon: CheckCircle2, color: "text-exa-green" },
};

export default function EstrategiaPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-exa-red" />
          Estrategia
        </h1>
        <p className="text-sm text-muted-foreground">Diagnostico estrategico e recomendacoes IA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel balance */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Equilibrio do Funil</h3>
          <div className="space-y-4">
            {funnelData.map((item) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{item.stage}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {item.current}/{item.target} posts/sem
                  </span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.status === "excesso" ? "bg-exa-amber" : item.status === "atencao" ? "bg-exa-red" : "bg-exa-green"
                    }`}
                    style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                  />
                </div>
                {item.status === "excesso" && (
                  <p className="text-[10px] text-exa-amber mt-1">Excesso - reduzir para equilibrar</p>
                )}
                {item.status === "atencao" && (
                  <p className="text-[10px] text-exa-red mt-1">Abaixo da meta</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-exa-cyan/5 border border-exa-cyan/10">
            <p className="text-xs text-exa-cyan">
              Mix ideal: 30% topo, 40% meio, 20% fundo, 10% autoridade. Atualmente: 20/30/40/10.
            </p>
          </div>
        </motion.div>

        {/* Brand health radar */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Saude da Marca</h3>
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

      {/* Audience split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Distribuicao de Publico</h3>
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

        {/* Strategic insights */}
        <motion.div className="glass-card p-6 lg:col-span-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Insights Estrategicos IA</h3>
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
