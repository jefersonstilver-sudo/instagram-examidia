"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, Plus, Radar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const now = new Date();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-medium">
            Boa tarde, Jefferson
          </h2>
          <p className="text-xs text-muted-foreground">
            {format(now, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="ml-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-400 font-mono uppercase">
            Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <Search className="w-4 h-4" />
          <span className="text-xs hidden md:inline">Buscar...</span>
          <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 text-[10px] font-mono text-muted-foreground">
            Ctrl+K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-exa-red rounded-full" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Radar className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          className="bg-exa-red hover:bg-exa-red/90 text-white gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Gerar Conteudo
        </Button>
      </div>
    </header>
  );
}
