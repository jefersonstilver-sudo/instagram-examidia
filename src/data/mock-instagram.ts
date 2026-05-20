import { subDays, format } from "date-fns";

export function generateDailyMetrics(days = 30) {
  const data = [];
  let followers = 847;
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const growth = Math.floor(Math.random() * (isWeekend ? 8 : 15)) - 2;
    followers += Math.max(growth, -3);
    const reach = Math.floor(800 + Math.random() * 2200 + (isWeekend ? -200 : 400));
    const impressions = Math.floor(reach * (1.3 + Math.random() * 0.8));
    const engagement = +(2.5 + Math.random() * 4.5).toFixed(2);
    data.push({
      date: format(date, "yyyy-MM-dd"),
      dateLabel: format(date, "dd/MM"),
      followers,
      newFollowers: Math.max(growth, 0),
      lostFollowers: growth < 0 ? Math.abs(growth) : 0,
      reach,
      impressions,
      engagement,
      likes: Math.floor(reach * 0.04 + Math.random() * 30),
      comments: Math.floor(Math.random() * 12),
      shares: Math.floor(Math.random() * 18),
      saves: Math.floor(Math.random() * 25),
      profileClicks: Math.floor(Math.random() * 35),
      websiteClicks: Math.floor(Math.random() * 8),
    });
  }
  return data;
}

export const mockMetrics = generateDailyMetrics(30);

export const currentMetrics = {
  followers: mockMetrics[mockMetrics.length - 1].followers,
  followersGrowth7d: mockMetrics.slice(-7).reduce((s, m) => s + m.newFollowers - m.lostFollowers, 0),
  followersGrowth30d: mockMetrics.reduce((s, m) => s + m.newFollowers - m.lostFollowers, 0),
  reach7d: mockMetrics.slice(-7).reduce((s, m) => s + m.reach, 0),
  impressions7d: mockMetrics.slice(-7).reduce((s, m) => s + m.impressions, 0),
  engagementAvg: +(mockMetrics.slice(-7).reduce((s, m) => s + m.engagement, 0) / 7).toFixed(2),
  totalLikes30d: mockMetrics.reduce((s, m) => s + m.likes, 0),
  totalComments30d: mockMetrics.reduce((s, m) => s + m.comments, 0),
  totalShares30d: mockMetrics.reduce((s, m) => s + m.shares, 0),
  totalSaves30d: mockMetrics.reduce((s, m) => s + m.saves, 0),
};

export const mockPosts = [
  {
    id: "1",
    type: "carousel" as const,
    title: "5 Lugares Onde Seu Anuncio e Ignorado",
    caption: "Voce esta pagando 5 vezes pra ser ignorado...",
    publishedAt: "2026-05-19",
    reach: 2340,
    impressions: 3100,
    likes: 87,
    comments: 12,
    shares: 23,
    saves: 45,
    engagementRate: 7.1,
    theme: "autoridade",
    funnel: "meio",
    audience: "anunciantes",
  },
  {
    id: "2",
    type: "carousel" as const,
    title: "Alcance x Frequencia",
    caption: "Alcance enche relatorio. Frequencia enche caixa.",
    publishedAt: "2026-05-18",
    reach: 1890,
    impressions: 2560,
    likes: 64,
    comments: 8,
    shares: 19,
    saves: 38,
    engagementRate: 6.8,
    theme: "educativo",
    funnel: "meio",
    audience: "anunciantes",
  },
  {
    id: "3",
    type: "reel" as const,
    title: "Como instalamos tela no 22o andar",
    caption: "Bastidor real de uma instalacao EXA...",
    publishedAt: "2026-05-16",
    reach: 4200,
    impressions: 6800,
    likes: 156,
    comments: 28,
    shares: 67,
    saves: 34,
    engagementRate: 9.2,
    theme: "bastidor",
    funnel: "topo",
    audience: "geral",
  },
  {
    id: "4",
    type: "reel" as const,
    title: "Foz recebe 2M turistas/ano mas...",
    caption: "73% dos comercios locais nao anunciam...",
    publishedAt: "2026-05-14",
    reach: 5600,
    impressions: 8900,
    likes: 203,
    comments: 34,
    shares: 89,
    saves: 52,
    engagementRate: 11.4,
    theme: "dado-chocante",
    funnel: "topo",
    audience: "empresarios",
  },
  {
    id: "5",
    type: "static" as const,
    title: "EXA Midia - Institucional",
    caption: "+20 predios, 245 exibicoes/dia...",
    publishedAt: "2026-05-12",
    reach: 780,
    impressions: 1100,
    likes: 23,
    comments: 2,
    shares: 3,
    saves: 5,
    engagementRate: 2.1,
    theme: "institucional",
    funnel: "autoridade",
    audience: "geral",
  },
];

export const healthScore = {
  overall: 62,
  growth: 55,
  engagement: 72,
  consistency: 48,
  diversity: 40,
  commercial: 35,
  trends: 58,
  status: "atencao" as const,
  statusLabel: "Atenccao",
  statusDescription:
    "Crescimento lento. Falta diversidade editorial e conteudo comercial. Reels com alto potencial de alcance estao subaproveitados.",
};

export type HealthStatus = "acelerando" | "saudavel" | "estavel" | "atencao" | "estagnado" | "critico";
