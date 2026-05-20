"use client";

import { motion } from "framer-motion";
import { mockNews } from "@/data/mock-radar";
import {
  Radar,
  Globe,
  TrendingUp,
  Building2,
  Briefcase,
  Flame,
  ExternalLink,
  Sparkles,
  Image,
  Film,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  local: { label: "Local", icon: Globe, color: "text-exa-cyan" },
  hype: { label: "Hype", icon: Flame, color: "text-exa-red" },
  sindicos: { label: "Sindicos", icon: Building2, color: "text-purple-400" },
  empresarios: { label: "Empresarios", icon: Briefcase, color: "text-exa-amber" },
  concorrentes: { label: "Concorrentes", icon: Radar, color: "text-orange-400" },
  turismo: { label: "Turismo", icon: Globe, color: "text-exa-green" },
};

function NewsCard({ item, index }: { item: (typeof mockNews)[0]; index: number }) {
  const config = categoryConfig[item.category];
  return (
    <motion.div
      className="glass-card p-5 hover:border-border transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <config.icon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-xs font-mono uppercase ${config.color}`}>{config.label}</span>
          <span className="text-[10px] text-muted-foreground">{item.source}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">Hype</span>
          <span className={`text-xs font-mono font-bold ${
            item.hypeScore >= 80 ? "text-exa-red" : item.hypeScore >= 60 ? "text-exa-amber" : "text-muted-foreground"
          }`}>
            {item.hypeScore}
          </span>
        </div>
      </div>

      <h3 className="text-sm font-medium mb-2">{item.title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{item.summary}</p>

      <div className="p-3 rounded-lg bg-muted/30 mb-3">
        <p className="text-xs text-muted-foreground mb-1">
          <span className="text-exa-cyan">Angulo sugerido:</span>
        </p>
        <p className="text-xs">{item.suggestedAngle}</p>
      </div>

      <div className="p-3 rounded-lg bg-exa-green/5 border border-exa-green/10 mb-4">
        <p className="text-xs text-exa-green">
          Por que importa: {item.whyMatters}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-[10px] gap-1">
          <span className="uppercase">{item.suggestedFormat}</span>
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          {item.audience}
        </Badge>
        <div className="flex-1" />
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
          <Film className="w-3 h-3" /> Reel
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
          <Image className="w-3 h-3" /> Carrossel
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
          <MessageSquare className="w-3 h-3" /> Stories
        </Button>
        <Button size="sm" className="h-7 text-xs gap-1 bg-exa-red hover:bg-exa-red/90 text-white">
          <Sparkles className="w-3 h-3" /> Criar
        </Button>
      </div>
    </motion.div>
  );
}

export default function RadarPage() {
  const categories = ["todos", "turismo", "local", "hype", "empresarios", "sindicos", "concorrentes"];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Radar className="w-5 h-5 text-exa-red" />
            Radar de Inteligencia
          </h1>
          <p className="text-sm text-muted-foreground">
            Noticias, tendencias e oportunidades de conteudo
          </p>
        </div>
        <Button size="sm" variant="outline" className="gap-2 text-xs">
          <TrendingUp className="w-3.5 h-3.5" /> Atualizar Radar
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={cat === "todos" ? "default" : "outline"}
            className="h-7 text-xs capitalize"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* News grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockNews.map((item, i) => (
          <NewsCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
