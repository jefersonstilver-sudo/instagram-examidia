"use client";

import { motion } from "framer-motion";
import { Briefcase, TrendingUp, DollarSign, Users, Target, Phone, Mail, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const chartStyle = {
  background: "oklch(0.18 0.012 260)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: "8px",
  fontSize: "12px",
};

const leads = [
  { id: 1, name: "Clinica Odonto Smile", status: "quente", source: "Instagram DM", value: "R$ 2.400/mes", lastContact: "Hoje", nextAction: "Enviar proposta" },
  { id: 2, name: "Restaurante Sabor da Terra", status: "morno", source: "Indicacao", value: "R$ 1.800/mes", lastContact: "Ontem", nextAction: "Follow-up WhatsApp" },
  { id: 3, name: "Academia PowerFit", status: "quente", source: "Site", value: "R$ 3.200/mes", lastContact: "18/05", nextAction: "Reuniao agendada 22/05" },
  { id: 4, name: "Imobiliaria Iguacu", status: "frio", source: "Cold outreach", value: "R$ 4.000/mes", lastContact: "15/05", nextAction: "Segundo email" },
  { id: 5, name: "Pet Shop Amigo Fiel", status: "morno", source: "Instagram DM", value: "R$ 1.200/mes", lastContact: "17/05", nextAction: "Enviar case de sucesso" },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
  quente: { color: "text-red-400", bg: "bg-red-500/10" },
  morno: { color: "text-exa-amber", bg: "bg-exa-amber/10" },
  frio: { color: "text-blue-400", bg: "bg-blue-500/10" },
};

const monthlyRevenue = [
  { month: "Jan", receita: 18500 },
  { month: "Fev", receita: 19200 },
  { month: "Mar", receita: 21800 },
  { month: "Abr", receita: 23400 },
  { month: "Mai", receita: 25100 },
];

const kpis = [
  { label: "Receita Mensal", value: "R$ 25.100", change: 7.3, icon: DollarSign },
  { label: "Clientes Ativos", value: "23", change: 4.5, icon: Users },
  { label: "Ocupacao de Telas", value: "78%", change: 12, icon: Target },
  { label: "Ticket Medio", value: "R$ 1.091", change: -2.1, icon: TrendingUp },
];

export default function ComercialPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-exa-red" />
          Comercial
        </h1>
        <p className="text-sm text-muted-foreground">Pipeline comercial e metricas de receita</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="glass-card p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xl font-bold font-mono">{kpi.value}</span>
              <span className={`text-xs font-mono ${kpi.change >= 0 ? "text-exa-green" : "text-destructive"}`}>
                {kpi.change >= 0 ? "+" : ""}{kpi.change}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Evolucao de Receita</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "oklch(0.70 0 0)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }} />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="receita" fill="oklch(0.60 0.24 25)" radius={[4, 4, 0, 0]} name="Receita (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Occupancy */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Ocupacao por Predio</h3>
          <div className="space-y-3">
            {[
              { name: "Ed. Cataratas Premium", occ: 95 },
              { name: "Ed. Iguacu Tower", occ: 88 },
              { name: "Ed. Itaipu Business", occ: 82 },
              { name: "Cond. Vila Verde", occ: 75 },
              { name: "Ed. Centro Comercial", occ: 60 },
              { name: "Cond. Parque das Aguas", occ: 45 },
            ].map((building) => (
              <div key={building.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">{building.name}</span>
                  <span className="text-xs font-mono text-muted-foreground">{building.occ}%</span>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      building.occ >= 80 ? "bg-exa-green" : building.occ >= 60 ? "bg-exa-amber" : "bg-exa-red"
                    }`}
                    style={{ width: `${building.occ}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-exa-green/5 border border-exa-green/10">
            <p className="text-xs text-exa-green">
              Media geral: 74.2% de ocupacao. Meta: 85%. 5 slots disponiveis nos predios com menor ocupacao.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Leads pipeline */}
      <div className="glass-card p-6">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Pipeline de Leads</h3>
        <div className="space-y-2">
          {leads.map((lead, i) => {
            const config = statusConfig[lead.status];
            return (
              <motion.div
                key={lead.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Badge variant="outline" className={`text-[10px] ${config.color} ${config.bg}`}>
                  {lead.status}
                </Badge>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium">{lead.name}</h4>
                  <span className="text-[10px] text-muted-foreground">{lead.source}</span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-muted-foreground block">Valor</span>
                  <span className="text-sm font-mono font-medium text-exa-green">{lead.value}</span>
                </div>
                <div className="text-center hidden md:block">
                  <span className="text-xs text-muted-foreground block">Contato</span>
                  <span className="text-xs font-mono">{lead.lastContact}</span>
                </div>
                <div className="hidden lg:block">
                  <span className="text-xs text-muted-foreground block">Proxima acao</span>
                  <span className="text-xs">{lead.nextAction}</span>
                </div>
                <div className="flex gap-1">
                  <a href={`https://wa.me/5545998323225?text=${encodeURIComponent(`Oi! Sou da EXA Midia, gostaria de falar sobre midia indoor para ${lead.name}`)}`} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Phone className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                  <a href={`mailto:contato@examidia.com.br?subject=Proposta EXA Midia - ${encodeURIComponent(lead.name)}`} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <Mail className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
