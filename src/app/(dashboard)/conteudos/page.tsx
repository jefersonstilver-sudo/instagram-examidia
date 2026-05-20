"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { mockContentPipeline, statusLabels, statusColors } from "@/data/mock-content";
import { FileText, Plus, Filter, LayoutGrid, List, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

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

type ViewMode = "kanban" | "list" | "calendar";

export default function ConteudosPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [filterFunnel, setFilterFunnel] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = filterFunnel
    ? mockContentPipeline.filter((c) => c.funnel === filterFunnel)
    : mockContentPipeline;

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
            {filtered.length} conteudos no pipeline
            {filterFunnel && <span className="text-exa-cyan"> — filtro: {filterFunnel}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
            <Button size="sm" variant={viewMode === "kanban" ? "default" : "ghost"} className="h-7 w-7 p-0" onClick={() => setViewMode("kanban")}><LayoutGrid className="w-3.5 h-3.5" /></Button>
            <Button size="sm" variant={viewMode === "list" ? "default" : "ghost"} className="h-7 w-7 p-0" onClick={() => setViewMode("list")}><List className="w-3.5 h-3.5" /></Button>
            <Button size="sm" variant={viewMode === "calendar" ? "default" : "ghost"} className="h-7 w-7 p-0" onClick={() => router.push("/calendario")}><Calendar className="w-3.5 h-3.5" /></Button>
          </div>
          <div className="relative">
            <Button size="sm" variant="outline" className="gap-2 text-xs" onClick={() => setShowFilter(!showFilter)}>
              <Filter className="w-3.5 h-3.5" /> Filtrar
              {filterFunnel && <X className="w-3 h-3 ml-1" onClick={(e) => { e.stopPropagation(); setFilterFunnel(null); }} />}
            </Button>
            {showFilter && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg p-2 shadow-xl space-y-1 min-w-[140px]">
                {["topo", "meio", "fundo", "autoridade"].map((f) => (
                  <button key={f} onClick={() => { setFilterFunnel(f); setShowFilter(false); }} className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-muted/50 capitalize">
                    {f}
                  </button>
                ))}
                <button onClick={() => { setFilterFunnel(null); setShowFilter(false); }} className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-muted/50 text-muted-foreground">
                  Limpar filtro
                </button>
              </div>
            )}
          </div>
          <Button size="sm" className="gap-2 text-xs bg-exa-red hover:bg-exa-red/90 text-white" onClick={() => router.push("/gerador")}>
            <Plus className="w-3.5 h-3.5" /> Novo Conteudo
          </Button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const items = filtered.filter((c) => col.statuses.includes(c.status));
            return (
              <div key={col.key} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{col.label}</h3>
                  <span className="text-xs font-mono text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((content, i) => (
                    <motion.div
                      key={content.id}
                      className="glass-card p-4 cursor-pointer hover:border-border transition-all"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => router.push("/aprovacoes")}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span>{formatIcons[content.format]}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${statusColors[content.status]}`}>
                          {statusLabels[content.status]}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium mb-2 line-clamp-2">{content.title}</h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className={`text-[9px] ${funnelColors[content.funnel]}`}>{content.funnel}</Badge>
                        <Badge variant="outline" className="text-[9px]">{content.audience}</Badge>
                        {content.priority === "alta" && (
                          <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20">alta</Badge>
                        )}
                      </div>
                      {content.scheduledAt && (
                        <p className="text-[10px] text-muted-foreground mt-2 font-mono">Agendado: {content.scheduledAt}</p>
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
      ) : (
        /* List view */
        <div className="glass-card divide-y divide-border/30">
          {filtered.map((content, i) => (
            <motion.div
              key={content.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => router.push("/aprovacoes")}
            >
              <span>{formatIcons[content.format]}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${statusColors[content.status]}`}>
                {statusLabels[content.status]}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{content.title}</h4>
              </div>
              <Badge variant="outline" className={`text-[9px] ${funnelColors[content.funnel]}`}>{content.funnel}</Badge>
              <Badge variant="outline" className="text-[9px]">{content.audience}</Badge>
              {content.scheduledAt && <span className="text-[10px] font-mono text-muted-foreground">{content.scheduledAt}</span>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
