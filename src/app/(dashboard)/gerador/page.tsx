"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Film, Image, MessageSquare, Megaphone, Newspaper, Building2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const modules = [
  { id: "theme", label: "Gerar Tema", icon: Sparkles, description: "Sugestao de tema estrategico" },
  { id: "reel", label: "Gerar Reel", icon: Film, description: "Roteiro completo de Reel" },
  { id: "carousel", label: "Gerar Carrossel", icon: Image, description: "Estrutura slide por slide" },
  { id: "stories", label: "Gerar Stories", icon: MessageSquare, description: "Sequencia de Stories" },
  { id: "commercial", label: "Conteudo Comercial", icon: Megaphone, description: "Post para gerar leads" },
  { id: "news", label: "A partir de Noticia", icon: Newspaper, description: "Transformar noticia em conteudo" },
  { id: "syndic", label: "Para Sindicos", icon: Building2, description: "Conteudo para condominios" },
];

export default function GeradorPage() {
  const [activeModule, setActiveModule] = useState("theme");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audience, setAudience] = useState("anunciantes");
  const [funnel, setFunnel] = useState("topo");
  const [tone, setTone] = useState("provocativo");
  const [hypeLevel, setHypeLevel] = useState("alto");

  const safeSet = (setter: (v: string) => void) => (v: string | null) => { if (v) setter(v); };
  const [context, setContext] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: activeModule,
          audience,
          funnel,
          tone,
          hypeLevel,
          context: context || undefined,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Erro de conexao. Verifique sua internet.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-exa-red" />
          Gerador de Conteudo IA
        </h1>
        <p className="text-sm text-muted-foreground">
          Studio de criacao com inteligencia artificial — GPT-4o
        </p>
      </div>

      {/* Module selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {modules.map((mod) => (
          <motion.button
            key={mod.id}
            onClick={() => { setActiveModule(mod.id); setResult(null); setError(null); }}
            className={`glass-card p-4 text-left transition-all ${
              activeModule === mod.id
                ? "border-exa-red/50 glow-red"
                : "hover:border-border"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <mod.icon className={`w-5 h-5 mb-2 ${activeModule === mod.id ? "text-exa-red" : "text-muted-foreground"}`} />
            <h3 className="text-sm font-medium">{mod.label}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">{mod.description}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-medium">Configurar Geracao</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Publico</Label>
              <Select value={audience} onValueChange={safeSet(setAudience)}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="anunciantes">Anunciantes</SelectItem>
                  <SelectItem value="sindicos">Sindicos</SelectItem>
                  <SelectItem value="moradores">Moradores</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Funil</Label>
              <Select value={funnel} onValueChange={safeSet(setFunnel)}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="topo">Topo (Alcance)</SelectItem>
                  <SelectItem value="meio">Meio (Educacao)</SelectItem>
                  <SelectItem value="fundo">Fundo (Conversao)</SelectItem>
                  <SelectItem value="autoridade">Autoridade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Tom</Label>
              <Select value={tone} onValueChange={safeSet(setTone)}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="provocativo">Provocativo</SelectItem>
                  <SelectItem value="educativo">Educativo</SelectItem>
                  <SelectItem value="institucional">Institucional</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="inspiracional">Inspiracional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Nivel de Hype</Label>
              <Select value={hypeLevel} onValueChange={safeSet(setHypeLevel)}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="maximo">Maximo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Contexto adicional (opcional)</Label>
            <Textarea
              placeholder="Ex: Usar dados da Copa 2026, mencionar turismo em Foz, conectar com escassez de slots..."
              className="min-h-[100px] text-xs resize-none"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-exa-red hover:bg-exa-red/90 text-white gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Gerando com GPT-4o...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Gerar com IA
              </>
            )}
          </Button>
        </div>

        {/* Output panel */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-medium mb-4">Resultado</h3>
          {generating ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-exa-red/10 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-exa-red animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Gerando conteudo com GPT-4o...</p>
              <p className="text-xs text-muted-foreground">Analisando estrategia, publico e tendencias</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <p className="text-sm text-destructive">{error}</p>
              <Button size="sm" variant="outline" onClick={handleGenerate}>
                Tentar novamente
              </Button>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="prose prose-sm prose-invert max-w-none">
                <pre className="text-xs whitespace-pre-wrap bg-muted/30 p-4 rounded-lg overflow-auto max-h-[500px]">
                  {result}
                </pre>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" className="bg-exa-green hover:bg-exa-green/90 text-white text-xs gap-1">
                  Aprovar
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1">
                  Editar
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={handleGenerate}>
                  Nova versao
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1">
                  <Send className="w-3 h-3" /> Enviar ao Pipeline
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Configure e clique em Gerar</p>
              <p className="text-xs text-muted-foreground">O resultado aparecera aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
