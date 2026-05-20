import OpenAI from "openai";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
  return new OpenAI({ apiKey });
}

const EXA_SYSTEM_PROMPT = `Voce e o estrategista de conteudo da EXA Midia, empresa de midia DOOH (Digital Out Of Home) em elevadores de Foz do Iguacu, Parana, Brasil.

SOBRE A EXA MIDIA:
- Telas digitais premium em elevadores de predios residenciais e comerciais
- +20 predios na rede, 245 exibicoes/dia por tela
- Atende anunciantes locais, sindicos e condominios
- Contato comercial: Jeni pelo WhatsApp +55 45 99832-3225
- Instagram: @examidia | Site: examidia.com.br

PUBLICOS:
1. Anunciantes locais (empresarios, comerciantes, clinicas, restaurantes)
2. Sindicos e administradoras de condominios
3. Moradores dos predios

TOM DA MARCA: provocativo, premium, data-driven, confiante
CONCORRENTES: Eletromidia, Helloo, Midia Ativa de Foz

REGRAS:
- Sempre gere conteudo em portugues brasileiro
- Sempre conecte o conteudo a um objetivo de negocio
- Sempre inclua CTA relevante
- Use dados e estatisticas quando possivel
- Adapte o tom ao publico-alvo
- Pense em salvamentos e compartilhamentos, nao apenas curtidas`;

// ─── Content Generation ─────────────────────────────────────────

export type ContentModule = "theme" | "reel" | "carousel" | "stories" | "commercial" | "news" | "syndic";

const MODULE_PROMPTS: Record<ContentModule, string> = {
  theme: `Gere uma sugestao de tema estrategico com:
- Titulo
- Formato recomendado
- Publico-alvo
- Objetivo
- Funil (topo/meio/fundo/autoridade)
- Gancho
- Justificativa estrategica
- CTA
- Hype Score (0-100)
- Potencial Comercial (0-100)
- Prioridade (baixa/media/alta/urgente)`,

  reel: `Gere um roteiro completo de Reel com:
- Titulo
- Hook (2 segundos - frase que para o scroll)
- Roteiro falado (texto completo para narrar)
- Roteiro visual (cena por cena)
- Texto na tela (frases curtas que aparecem)
- Legenda completa para o Instagram
- CTA
- Hashtags (10-15 relevantes)
- Ideia de thumbnail
- Sugestao de audio/trend`,

  carousel: `Gere uma estrutura completa de carrossel com:
- Titulo da capa (impactante, curto)
- Slide 1: Capa com gancho forte
- Slides 2-7: Desenvolvimento (headline + texto de cada slide)
- Slide final: CTA
- Direcao visual para cada slide
- Legenda completa
- CTA
- Hashtags`,

  stories: `Gere uma sequencia de Stories com:
- Quantidade de stories (4-8)
- Texto de cada story
- Sticker/enquete/pergunta sugerida
- CTA final
- Objetivo da sequencia`,

  commercial: `Gere um conteudo comercial focado em gerar lead com:
- Dor do empresario
- Promessa da EXA
- Prova (dado, case, argumento)
- Argumento de escassez/urgencia
- CTA direto para WhatsApp da Jeni
- Link: https://wa.me/5545998323225
- Formato recomendado
- Legenda
- Hashtags`,

  news: `Transforme a informacao fornecida em conteudo para o Instagram da EXA Midia:
- Resumo da noticia
- Angulo de conteudo (como conectar com midia indoor)
- Formato ideal
- Conteudo completo (roteiro ou estrutura)
- Por que isso importa para a EXA
- CTA`,

  syndic: `Gere conteudo focado em sindicos e condominios:
- Problema condominial abordado
- Como a EXA resolve
- Beneficio para moradores
- Beneficio para gestao
- Argumento de modernizacao
- CTA institucional
- Formato recomendado
- Legenda`,
};

export async function generateContent(
  module: ContentModule,
  options: {
    audience?: string;
    funnel?: string;
    tone?: string;
    hypeLevel?: string;
    context?: string;
  }
) {
  const openai = getClient();

  const userPrompt = `${MODULE_PROMPTS[module]}

Configuracoes:
- Publico: ${options.audience || "geral"}
- Funil: ${options.funnel || "topo"}
- Tom: ${options.tone || "provocativo"}
- Nivel de hype: ${options.hypeLevel || "alto"}
${options.context ? `\nContexto adicional: ${options.context}` : ""}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: EXA_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 2000,
    temperature: 0.85,
  });

  return completion.choices[0].message.content;
}

// ─── Strategy Analysis ──────────────────────────────────────────

export async function analyzePerformance(metricsJson: string) {
  const openai = getClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: EXA_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Analise as metricas do Instagram da EXA Midia e gere:
1. Diagnostico geral (acelerando/saudavel/estavel/atencao/estagnado/critico)
2. Top 3 problemas detectados
3. Top 3 oportunidades
4. 5 acoes recomendadas com prioridade
5. Score de saude (0-100) com justificativa

Metricas: ${metricsJson}`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

// ─── News to Content ────────────────────────────────────────────

export async function transformNewsToContent(newsTitle: string, newsSummary: string) {
  return generateContent("news", {
    context: `Noticia: ${newsTitle}\nResumo: ${newsSummary}`,
    audience: "geral",
    funnel: "topo",
    tone: "provocativo",
    hypeLevel: "alto",
  });
}
