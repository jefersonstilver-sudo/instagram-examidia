"use client";

import { motion } from "framer-motion";
import { Library, Search, Filter, Grid, List, FileText, Film, Image, MessageSquare, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const templates = [
  { id: 1, title: "Reel: Dado Impactante + CTA", format: "reel", category: "comercial", uses: 12, rating: 4.8 },
  { id: 2, title: "Carrossel: Mito vs Verdade", format: "carousel", category: "educativo", uses: 8, rating: 4.5 },
  { id: 3, title: "Carrossel: Top 5 Motivos", format: "carousel", category: "educativo", uses: 15, rating: 4.9 },
  { id: 4, title: "Reel: Antes e Depois", format: "reel", category: "prova social", uses: 6, rating: 4.2 },
  { id: 5, title: "Stories: Enquete + Educacao", format: "stories", category: "engajamento", uses: 20, rating: 4.7 },
  { id: 6, title: "Post: Depoimento Cliente", format: "post", category: "prova social", uses: 9, rating: 4.4 },
  { id: 7, title: "Reel: Tour pelo Predio", format: "reel", category: "institucional", uses: 4, rating: 4.1 },
  { id: 8, title: "Carrossel: Case de Sucesso", format: "carousel", category: "comercial", uses: 11, rating: 4.6 },
];

const savedContents = [
  { id: 1, title: "Copa 2026: Foz vai lotar", format: "reel", date: "18/05/2026", status: "publicado" },
  { id: 2, title: "68% leem a tela do elevador", format: "carousel", date: "17/05/2026", status: "publicado" },
  { id: 3, title: "5 lugares que sua marca ignora", format: "carousel", date: "19/05/2026", status: "publicado" },
  { id: 4, title: "Midia indoor vs outdoor", format: "reel", date: "15/05/2026", status: "rascunho" },
];

const formatIcon: Record<string, React.ElementType> = {
  reel: Film,
  carousel: Image,
  stories: MessageSquare,
  post: FileText,
};

export default function BibliotecaPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Library className="w-5 h-5 text-exa-red" />
            Biblioteca
          </h1>
          <p className="text-sm text-muted-foreground">Templates, conteudos salvos e assets</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar..." className="h-8 pl-8 text-xs w-[200px]" />
          </div>
          <Button size="sm" variant="outline" className="gap-2 text-xs">
            <Filter className="w-3.5 h-3.5" /> Filtrar
          </Button>
        </div>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Templates de Conteudo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tpl, i) => {
            const Icon = formatIcon[tpl.format];
            return (
              <motion.div
                key={tpl.id}
                className="glass-card p-4 hover:border-border cursor-pointer transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Badge variant="outline" className="text-[9px]">{tpl.category}</Badge>
                </div>
                <h3 className="text-sm font-medium mb-2">{tpl.title}</h3>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{tpl.uses} usos</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-exa-amber fill-exa-amber" />
                    {tpl.rating}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Saved contents */}
      <div>
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Conteudos Salvos</h2>
        <div className="glass-card divide-y divide-border/30">
          {savedContents.map((item, i) => {
            const Icon = formatIcon[item.format];
            return (
              <motion.div
                key={item.id}
                className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{item.format} - {item.date}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] ${item.status === "publicado" ? "bg-exa-green/10 text-exa-green" : "bg-muted/30"}`}>
                  {item.status}
                </Badge>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
