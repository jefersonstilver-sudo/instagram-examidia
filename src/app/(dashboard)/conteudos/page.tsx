"use client";

import { motion } from "framer-motion";
import { mockContentPipeline, statusLabels, statusColors } from "@/data/mock-content";
import { FileText, Plus, Filter, LayoutGrid, List, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatIcons: Record<string, string> = {
  reel: "🎬",
  carousel: "📑",
  stories: "📱",
  post: "📝",
};

const funnelColors: Record<string, string> = {
  topo: "bg-blue-500/20 text-blue-400",
  meio: "bg-purple-500/20 text-purple-400",
  fundo: "bg-exa-red/20 text-exa-red",
  autoridade: "bg-exa-cyan/20 text-exa-cyan",
};

export default function ConteudosPage() {
  const columns = [
    { key: "pending", label: "Pendente", statuses: ["pending_theme", "pending_script", "pending_creative"] },
    { key: "progress", label: "Em Producao", statuses: ["theme_approved", "script_building", "script_approved", "creative_generating"] },
    { key: "scheduled", label: "Agendado", statuses: ["creative_approved", "scheduled"] },
    { key: "published", label: "Publicado", statuses: ["published", "analyzed"] },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-exa-red" />
            Pipeline Editorial
          </h1>
          <p className="text-sm text-muted-foreground">
            {mockContentPipeline.length} conteudos no pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><LayoutGrid className="w-3.5 h-3.5" /></Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><List className="w-3.5 h-3.5" /></Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Calendar className="w-3.5 h-3.5" /></Button>
          </div>
          <Button size="sm" variant="outline" className="gap-2 text-xs">
            <Filter className="w-3.5 h-3.5" /> Filtrar
          </Button>
          <Button size="sm" className="gap-2 text-xs bg-exa-red hover:bg-exa-red/90 text-white">
            <Plus className="w-3.5 h-3.5" /> Novo Conteudo
          </Button>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = mockContentPipeline.filter((c) =>
            col.statuses.includes(c.status)
          );
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {col.label}
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((content, i) => (
                  <motion.div
                    key={content.id}
                    className="glass-card p-4 cursor-pointer hover:border-border transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span>{formatIcons[content.format]}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${statusColors[content.status]}`}>
                        {statusLabels[content.status]}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium mb-2 line-clamp-2">
                      {content.title}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className={`text-[9px] ${funnelColors[content.funnel]}`}>
                        {content.funnel}
                      </Badge>
                      <Badge variant="outline" className="text-[9px]">
                        {content.audience}
                      </Badge>
                      {content.priority === "alta" && (
                        <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20">
                          alta
                        </Badge>
                      )}
                    </div>
                    {content.scheduledAt && (
                      <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                        Agendado: {content.scheduledAt}
                      </p>
                    )}
                  </motion.div>
                ))}
                {items.length === 0 && (
                  <div className="glass-card p-6 text-center">
                    <p className="text-xs text-muted-foreground">Nenhum conteudo</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
