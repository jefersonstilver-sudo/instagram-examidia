"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Film, Image, MessageSquare, FileText, Megaphone, Newspaper, Send, Loader2 } from "lucide-react";
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
];

export default function GeradorPage() {
  const [activeModule, setActiveModule] = useState("theme");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      setGenerating(false);
      setResult(
        activeModule === "reel"
          ? `# Copa 2026: Foz vai lotar. Sua marca esta pronta?

## Hook (2 segundos)
"Foz vai receber milhares de turistas na Copa. E a sua marca?"

## Roteiro Falado
"A Copa do Mundo 2026 ja esta impactando Foz do Iguaccu. Hoteis com reservas 40% acima do normal. Restaurantes se preparando. Mas a pergunta e: sua marca esta aparecendo nos lugares certos?"

## Roteiro Visual
- Cena 1: Imagens aereas de Foz / Cataratas
- Cena 2: Movimento de turistas
- Cena 3: Tela EXA no elevador com anuncio
- Cena 4: Dados de audiencia na tela
- Cena 5: CTA com WhatsApp

## Texto na Tela
"COPA 2026 → FOZ VAI LOTAR → SUA MARCA ESTA PRONTA? → 245 EXIBICOES/DIA → FALE COM A JENI"

## Legenda
Foz vai receber milhares de turistas durante a Copa 2026. Sua marca vai estar la? Com a EXA Midia, sua marca aparece todo dia nos melhores predios de Foz. +20 predios, 245 exibicoes/dia.

## CTA
Fale com a Jeni no WhatsApp e garanta seu espacco.

## Hashtags
#Copa2026 #FozDoIguaccu #MidiaEmElevador #EXAMidia #MarketingLocal`
          : `## Tema Sugerido: "68% dos moradores leem a tela do elevador"

**Formato:** Carrossel educativo
**Publico:** Anunciantes locais
**Funil:** Meio
**Objetivo:** Provar valor da midia indoor com dado oficial

**Justificativa estrategica:**
Dados da ABOOH comprovam que midia em elevador tem taxa de atencao superior a qualquer outra midia indoor. Esse dado e imbativel em apresentacao comercial e gera salvamentos no Instagram.

**Gancho:** "Qual outra midia entrega 68% de atencao diaria?"
**CTA:** "Salve este post e compartilhe com quem investe em midia"
**Hype Score:** 70 | **Potencial Comercial:** 95 | **Prioridade:** Alta`
      );
    }, 3000);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-exa-red" />
          Gerador de Conteudo IA
        </h1>
        <p className="text-sm text-muted-foreground">
          Studio de criacao com inteligencia artificial
        </p>
      </div>

      {/* Module selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {modules.map((mod) => (
          <motion.button
            key={mod.id}
            onClick={() => { setActiveModule(mod.id); setResult(null); }}
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
              <Select defaultValue="anunciantes">
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
              <Select defaultValue="topo">
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
              <Select defaultValue="provocativo">
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
              <Select defaultValue="alto">
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
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-exa-red hover:bg-exa-red/90 text-white gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Gerando...
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
              <p className="text-sm text-muted-foreground">Gerando conteudo com IA...</p>
              <p className="text-xs text-muted-foreground">Analisando estrategia, publico e tendencias</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="prose prose-sm prose-invert max-w-none">
                <pre className="text-xs whitespace-pre-wrap bg-muted/30 p-4 rounded-lg overflow-auto max-h-[500px]">
                  {result}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-exa-green hover:bg-exa-green/90 text-white text-xs gap-1">
                  Aprovar
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1">
                  Editar
                </Button>
                <Button size="sm" variant="outline" className="text-xs gap-1">
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
