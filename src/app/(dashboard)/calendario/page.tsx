"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockContentPipeline, statusLabels, statusColors } from "@/data/mock-content";
import { useRouter } from "next/navigation";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTHS = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const formatIcons: Record<string, string> = {
  reel: "🎬",
  carousel: "📑",
  stories: "📱",
  post: "📝",
};

export default function CalendarioPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const scheduledItems = mockContentPipeline.filter((c) => c.scheduledAt);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-exa-red" />
            Calendario Editorial
          </h1>
          <p className="text-sm text-muted-foreground">
            {scheduledItems.length} conteudos agendados
          </p>
        </div>
        <Button size="sm" className="gap-2 text-xs bg-exa-red hover:bg-exa-red/90 text-white" onClick={() => router.push("/gerador")}>
          <Plus className="w-3.5 h-3.5" /> Agendar
        </Button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <Button size="sm" variant="ghost" onClick={prev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-sm font-medium">
            {MONTHS[month]} {year}
          </h2>
          <Button size="sm" variant="ghost" onClick={next}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] text-muted-foreground uppercase tracking-wider py-2">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const dayItems = day
              ? scheduledItems.filter((item) => {
                  if (!item.scheduledAt) return false;
                  const parts = item.scheduledAt.split("/");
                  return parseInt(parts[0]) === day && parseInt(parts[1]) === month + 1;
                })
              : [];
            const today = new Date();
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <motion.div
                key={i}
                className={`min-h-[90px] p-1.5 rounded-lg border transition-colors ${
                  day ? "border-border/20 hover:border-border/50" : "border-transparent"
                } ${isToday ? "bg-exa-red/5 border-exa-red/30" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.01 }}
              >
                {day && (
                  <>
                    <span className={`text-xs font-mono ${isToday ? "text-exa-red font-bold" : "text-muted-foreground"}`}>
                      {day}
                    </span>
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="mt-1 p-1 rounded bg-muted/40 cursor-pointer hover:bg-muted/60 transition-colors"
                      >
                        <span className="text-[9px] block truncate">
                          {formatIcons[item.format]} {item.title}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Proximos Agendamentos</h3>
        <div className="space-y-2">
          {scheduledItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <span>{formatIcons[item.format]}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.title}</h4>
                <span className="text-[10px] text-muted-foreground">{item.audience}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{item.scheduledAt}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${statusColors[item.status]}`}>
                {statusLabels[item.status]}
              </span>
            </div>
          ))}
          {scheduledItems.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">Nenhum conteudo agendado</p>
          )}
        </div>
      </div>
    </div>
  );
}
