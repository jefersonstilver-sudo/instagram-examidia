"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, Plus, Radar, Search, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Topbar() {
  const now = new Date();
  const router = useRouter();
  const { data: session } = useSession();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const userName = session?.user?.name?.split(" - ")[0] || session?.user?.name || "Usuario";

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pages = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Radar", href: "/radar" },
    { label: "Conteudos", href: "/conteudos" },
    { label: "Gerador IA", href: "/gerador" },
    { label: "Aprovacoes", href: "/aprovacoes" },
    { label: "Calendario", href: "/calendario" },
    { label: "Biblioteca", href: "/biblioteca" },
    { label: "Analytics", href: "/analytics" },
    { label: "Estrategia", href: "/estrategia" },
    { label: "Comercial", href: "/comercial" },
  ];

  const filteredPages = searchQuery
    ? pages.filter((p) => p.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-medium">
            {greeting}, {userName}
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
        {/* Search */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-4 h-4" />
            <span className="text-xs hidden md:inline">Buscar...</span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 text-[10px] font-mono text-muted-foreground">
              Ctrl+K
            </kbd>
          </Button>

          {showSearch && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar pagina..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery(""); }}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {(searchQuery ? filteredPages : pages).map((page) => (
                  <button
                    key={page.href}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                    onClick={() => { router.push(page.href); setShowSearch(false); setSearchQuery(""); }}
                  >
                    {page.label}
                  </button>
                ))}
                {searchQuery && filteredPages.length === 0 && (
                  <p className="px-4 py-3 text-xs text-muted-foreground">Nenhum resultado</p>
                )}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative"
          onClick={() => router.push("/aprovacoes")}
          title="Aprovacoes pendentes"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-exa-red rounded-full" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/radar")}
          title="Radar"
        >
          <Radar className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          className="bg-exa-red hover:bg-exa-red/90 text-white gap-2"
          onClick={() => router.push("/gerador")}
        >
          <Plus className="w-3.5 h-3.5" />
          Gerar Conteudo
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
