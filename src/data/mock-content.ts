export type ContentStatus =
  | "idea"
  | "pending_theme"
  | "theme_approved"
  | "theme_rejected"
  | "script_building"
  | "pending_script"
  | "script_approved"
  | "creative_generating"
  | "pending_creative"
  | "creative_approved"
  | "scheduled"
  | "published"
  | "analyzed";

export interface ContentPiece {
  id: string;
  title: string;
  format: "reel" | "carousel" | "stories" | "post";
  audience: "anunciantes" | "sindicos" | "moradores" | "geral";
  objective: string;
  funnel: "topo" | "meio" | "fundo" | "autoridade";
  status: ContentStatus;
  priority: "alta" | "media" | "baixa";
  scheduledAt?: string;
  publishedAt?: string;
  cta?: string;
  hypothesis?: string;
  source?: string;
  hypeScore?: number;
  commercialScore?: number;
  createdAt: string;
}

export const mockContentPipeline: ContentPiece[] = [
  {
    id: "c1",
    title: "Copa 2026: Foz vai lotar. Sua marca esta pronta?",
    format: "reel",
    audience: "anunciantes",
    objective: "Gerar leads de anunciantes usando hype da Copa",
    funnel: "topo",
    status: "pending_theme",
    priority: "alta",
    cta: "Fale com a Jeni no WhatsApp",
    hypothesis: "Conteudo sobre Copa gera mais alcance e cliques comerciais",
    source: "Radar - Copa do Mundo",
    hypeScore: 95,
    commercialScore: 88,
    createdAt: "2026-05-20",
  },
  {
    id: "c2",
    title: "68% dos moradores leem a tela do elevador todo dia",
    format: "carousel",
    audience: "anunciantes",
    objective: "Provar valor da midia indoor com dado oficial",
    funnel: "meio",
    status: "pending_script",
    priority: "alta",
    cta: "Salve este post",
    hypothesis: "Dados oficiais geram salvamentos e compartilhamentos",
    source: "Radar - ABOOH",
    hypeScore: 70,
    commercialScore: 92,
    createdAt: "2026-05-19",
  },
  {
    id: "c3",
    title: "Condominio moderno em 2026: o que os melhores predios tem",
    format: "carousel",
    audience: "sindicos",
    objective: "Atrair sindicos para a rede EXA",
    funnel: "meio",
    status: "script_approved",
    priority: "media",
    cta: "Modernize seu predio",
    hypothesis: "Sindicos compartilham conteudo sobre modernizaccao",
    source: "Radar - Sindicos",
    hypeScore: 55,
    commercialScore: 75,
    createdAt: "2026-05-18",
  },
  {
    id: "c4",
    title: "IA vai matar o marketing local?",
    format: "reel",
    audience: "geral",
    objective: "Gerar alcance com tema hype + posicionar EXA",
    funnel: "topo",
    status: "creative_generating",
    priority: "media",
    cta: "Siga a EXA",
    hypothesis: "Tema hype gera alcance. Virada para midia fisica surpreende.",
    source: "Radar - Hype",
    hypeScore: 95,
    commercialScore: 40,
    createdAt: "2026-05-17",
  },
  {
    id: "c5",
    title: "Bastidor: instalaccao no Edificio Barcelona",
    format: "reel",
    audience: "geral",
    objective: "Humanizar a marca e mostrar operaccao real",
    funnel: "topo",
    status: "pending_creative",
    priority: "media",
    cta: "Siga para mais bastidores",
    hypothesis: "Bastidores geram curiosidade e confiancca",
    hypeScore: 50,
    commercialScore: 60,
    createdAt: "2026-05-16",
  },
  {
    id: "c6",
    title: "Ultimos 3 slots nos melhores predios de Foz",
    format: "post",
    audience: "anunciantes",
    objective: "Gerar lead com escassez",
    funnel: "fundo",
    status: "scheduled",
    scheduledAt: "2026-05-21",
    priority: "alta",
    cta: "Fale com a Jeni agora",
    hypothesis: "Escassez gera urgencia e cliques no WhatsApp",
    hypeScore: 30,
    commercialScore: 98,
    createdAt: "2026-05-15",
  },
  {
    id: "c7",
    title: "5 Lugares Onde Seu Anuncio e Ignorado",
    format: "carousel",
    audience: "anunciantes",
    objective: "Educar sobre diferencial de midia indoor",
    funnel: "meio",
    status: "published",
    publishedAt: "2026-05-19",
    priority: "alta",
    cta: "DM CLAUDE pra orcamento",
    hypeScore: 65,
    commercialScore: 85,
    createdAt: "2026-05-13",
  },
  {
    id: "c8",
    title: "Alcance x Frequencia",
    format: "carousel",
    audience: "anunciantes",
    objective: "Construir autoridade sobre metricas de midia",
    funnel: "meio",
    status: "published",
    publishedAt: "2026-05-18",
    priority: "alta",
    cta: "Salve este post",
    hypeScore: 60,
    commercialScore: 80,
    createdAt: "2026-05-12",
  },
];

export const statusLabels: Record<ContentStatus, string> = {
  idea: "Ideia",
  pending_theme: "Tema pendente",
  theme_approved: "Tema aprovado",
  theme_rejected: "Tema rejeitado",
  script_building: "Roteiro em construccao",
  pending_script: "Roteiro pendente",
  script_approved: "Roteiro aprovado",
  creative_generating: "Criativo gerando",
  pending_creative: "Criativo pendente",
  creative_approved: "Criativo aprovado",
  scheduled: "Agendado",
  published: "Publicado",
  analyzed: "Analisado",
};

export const statusColors: Record<ContentStatus, string> = {
  idea: "bg-gray-500/20 text-gray-400",
  pending_theme: "bg-amber-500/20 text-amber-400",
  theme_approved: "bg-green-500/20 text-green-400",
  theme_rejected: "bg-red-500/20 text-red-400",
  script_building: "bg-blue-500/20 text-blue-400",
  pending_script: "bg-amber-500/20 text-amber-400",
  script_approved: "bg-green-500/20 text-green-400",
  creative_generating: "bg-purple-500/20 text-purple-400",
  pending_creative: "bg-amber-500/20 text-amber-400",
  creative_approved: "bg-green-500/20 text-green-400",
  scheduled: "bg-cyan-500/20 text-cyan-400",
  published: "bg-emerald-500/20 text-emerald-400",
  analyzed: "bg-slate-500/20 text-slate-400",
};
