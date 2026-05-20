"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockContentPipeline, statusLabels, statusColors } from "@/data/mock-content";
import { CheckCircle2, ThumbsUp, ThumbsDown, Edit3, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const quickActions = [
  "Mais premium", "Mais comercial", "Mais hype", "Mais direto",
  "Para sindicos", "Para empresarios", "Transformar em Reel", "Transformar em carrossel",
];

export default function AprovacoesPage() {
  const router = useRouter();
  const [items, setItems] = useState(
    mockContentPipeline.filter(
      (c) => c.status === "pending_theme" || c.status === "pending_script" || c.status === "pending_creative"
    )
  );
  const [actionFeedback, setActionFeedback] = useState<Record<string, string>>({});
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});

  const handleApprove = (id: string) => {
    setActionFeedback((prev) => ({ ...prev, [id]: "approved" }));
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 800);
  };

  const handleReject = (id: string) => {
    setActionFeedback((prev) => ({ ...prev, [id]: "rejected" }));
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 800);
  };

  const handleRegenerate = async (id: string, extraContext?: string) => {
    setRegenerating((prev) => ({ ...prev, [id]: true }));
    // Simulate regeneration
    setTimeout(() => {
      setRegenerating((prev) => ({ ...prev, [id]: false }));
      setActionFeedback((prev) => ({ ...prev, [id]: "regenerated" }));
      setTimeout(() => {
        setActionFeedback((prev) => { const n = { ...prev }; delete n[id]; return n; });
      }, 2000);
    }, 2000);
  };

  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      router.push(`/gerador?module=${item.format}&context=${encodeURIComponent(item.title)}`);
    }
  };

  const handleQuickAction = (id: string, action: string) => {
    handleRegenerate(id, action);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-exa-red" />
          Fila de Aprovacao
        </h1>
        <p className="text-sm text-muted-foreground">
          {items.length} itens aguardando sua aprovacao
        </p>
      </div>

      {items.length === 0 && (
        <div className="glass-card p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-exa-green mx-auto mb-3" />
          <h3 className="text-sm font-medium">Tudo aprovado!</h3>
          <p className="text-xs text-muted-foreground mt-1">Nenhum item pendente</p>
          <Button size="sm" className="mt-4 bg-exa-red hover:bg-exa-red/90 text-white" onClick={() => router.push("/gerador")}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Gerar novo conteudo
          </Button>
        </div>
      )}

      <AnimatePresence>
        <div className="space-y-4">
          {items.map((item, i) => {
            const feedback = actionFeedback[item.id];
            const isRegenerating = regenerating[item.id];

            return (
              <motion.div
                key={item.id}
                className={`glass-card p-6 transition-all ${
                  feedback === "approved" ? "border-exa-green/50 bg-exa-green/5" :
                  feedback === "rejected" ? "border-destructive/50 bg-destructive/5" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: feedback === "approved" ? 100 : -100, height: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {feedback === "approved" && (
                  <div className="flex items-center gap-2 mb-3 text-exa-green text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Aprovado com sucesso!
                  </div>
                )}
                {feedback === "rejected" && (
                  <div className="flex items-center gap-2 mb-3 text-destructive text-xs">
                    <ThumbsDown className="w-4 h-4" /> Rejeitado
                  </div>
                )}
                {feedback === "regenerated" && (
                  <div className="flex items-center gap-2 mb-3 text-exa-cyan text-xs">
                    <RefreshCw className="w-4 h-4" /> Nova versao gerada!
                  </div>
                )}

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
                  <Button size="sm" className="bg-exa-green hover:bg-exa-green/90 text-white text-xs gap-1.5" onClick={() => handleApprove(item.id)} disabled={!!feedback}>
                    <ThumbsUp className="w-3.5 h-3.5" /> Aprovar
                  </Button>
                  <Button size="sm" variant="destructive" className="text-xs gap-1.5" onClick={() => handleReject(item.id)} disabled={!!feedback}>
                    <ThumbsDown className="w-3.5 h-3.5" /> Rejeitar
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => handleEdit(item.id)}>
                    <Edit3 className="w-3.5 h-3.5" /> Editar
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => handleRegenerate(item.id)} disabled={isRegenerating}>
                    {isRegenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    {isRegenerating ? "Gerando..." : "Nova versao"}
                  </Button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-muted-foreground mr-1">Pedir:</span>
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleQuickAction(item.id, action)}
                      disabled={isRegenerating}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
