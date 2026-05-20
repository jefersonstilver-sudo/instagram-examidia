"use client";

import { motion } from "framer-motion";
import { mockContentPipeline, statusLabels, statusColors } from "@/data/mock-content";
import { CheckCircle2, X, Edit3, RefreshCw, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pendingItems = mockContentPipeline.filter(
  (c) => c.status === "pending_theme" || c.status === "pending_script" || c.status === "pending_creative"
);

const quickActions = [
  "Mais premium", "Mais comercial", "Mais hype", "Mais direto",
  "Para sindicos", "Para empresarios", "Transformar em Reel", "Transformar em carrossel",
];

export default function AprovacoesPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-exa-red" />
          Fila de Aprovacao
        </h1>
        <p className="text-sm text-muted-foreground">
          {pendingItems.length} itens aguardando sua aprovacao
        </p>
      </div>

      <div className="space-y-4">
        {pendingItems.map((item, i) => (
          <motion.div
            key={item.id}
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${statusColors[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                  <Badge variant="outline" className="text-[10px]">{item.format}</Badge>
                  <Badge variant="outline" className="text-[10px]">{item.audience}</Badge>
                  {item.priority === "alta" && (
                    <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20">
                      Prioridade alta
                    </Badge>
                  )}
                </div>
                <h3 className="text-base font-medium">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {item.hypeScore && (
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground block">Hype</span>
                    <span className="text-sm font-mono font-bold text-exa-amber">{item.hypeScore}</span>
                  </div>
                )}
                {item.commercialScore && (
                  <div className="text-center ml-3">
                    <span className="text-xs text-muted-foreground block">Comercial</span>
                    <span className="text-sm font-mono font-bold text-exa-green">{item.commercialScore}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-2">{item.objective}</p>
            {item.hypothesis && (
              <p className="text-xs text-muted-foreground mb-4">
                <span className="text-exa-cyan">Hipotese: </span>{item.hypothesis}
              </p>
            )}

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Button size="sm" className="bg-exa-green hover:bg-exa-green/90 text-white text-xs gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" /> Aprovar
              </Button>
              <Button size="sm" variant="destructive" className="text-xs gap-1.5">
                <ThumbsDown className="w-3.5 h-3.5" /> Rejeitar
              </Button>
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Editar
              </Button>
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Nova versao
              </Button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-muted-foreground mr-1">Pedir:</span>
              {quickActions.map((action) => (
                <Button key={action} size="sm" variant="ghost" className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground">
                  {action}
                </Button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
