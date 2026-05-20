"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Clock,
  Wifi,
  WifiOff,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const chartStyle = {
  background: "oklch(0.18 0.012 260)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: "8px",
  fontSize: "12px",
};

interface Metrics {
  followers: number;
  followersGrowth7d: number;
  reach7d: number;
  engagementAvg: number;
  totalLikes30d: number;
  totalComments30d: number;
  totalShares30d: number;
  totalSaves30d: number;
}

interface Post {
  id: string;
  type: string;
  title: string;
  permalink: string;
  mediaUrl: string;
  publishedAt: string;
  likes: number;
  comments: number;
  reach: number;
  saves: number;
  shares: number;
  engagementRate: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <span className="text-2xl font-bold">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </motion.div>
  );
}

function HealthScoreWidget({ posts, metrics }: { posts: Post[]; metrics: Metrics }) {
  // Calculate health score from real data
  const engScore = Math.min(100, Math.round((metrics.engagementAvg / 5) * 100));
  const reachScore = Math.min(100, Math.round((metrics.reach7d / (metrics.followers * 3)) * 100));

  const typeCount: Record<string, number> = {};
  for (const p of posts) {
    typeCount[p.type] = (typeCount[p.type] || 0) + 1;
  }
  const diversityScore = Math.min(100, Object.keys(typeCount).length * 33);

  const avgSaves = posts.length > 0 ? posts.reduce((s, p) => s + p.saves, 0) / posts.length : 0;
  const commercialScore = Math.min(100, Math.round((avgSaves / 20) * 100));

  const consistencyScore = Math.min(100, Math.round((posts.length / 25) * 100));

  const overall = Math.round(
    engScore * 0.3 + reachScore * 0.25 + diversityScore * 0.1 + commercialScore * 0.15 + consistencyScore * 0.2
  );

  const status = overall >= 80 ? "saudavel" : overall >= 60 ? "estavel" : overall >= 40 ? "atencao" : "critico";

  const statusColorMap: Record<string, string> = {
    saudavel: "text-exa-green",
    estavel: "text-exa-cyan",
    atencao: "text-exa-amber",
    critico: "text-destructive",
  };
  const ringColor = statusColorMap[status] || "text-exa-amber";

  const breakdown = [
    { label: "Engajamento", value: engScore },
    { label: "Alcance", value: reachScore },
    { label: "Consistencia", value: consistencyScore },
    { label: "Diversidade", value: diversityScore },
    { label: "Comercial", value: commercialScore },
  ];

  return (
    <motion.div className="glass-card p-6" {...fadeIn} transition={{ delay: 0.2 }}>
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        Health Score do Instagram
      </h3>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/50" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className={ringColor} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${overall * 2.64} 264`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{overall}</span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-24">{item.label}</span>
              <div className="flex-1 bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    item.value >= 70 ? "bg-exa-green" : item.value >= 50 ? "bg-exa-amber" : "bg-destructive"
                  }`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="text-[11px] font-mono w-8 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TopPostsWidget({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort((a, b) => (b.likes + b.comments + b.saves) - (a.likes + a.comments + a.saves)).slice(0, 5);

  return (
    <motion.div className="glass-card p-6" {...fadeIn} transition={{ delay: 0.35 }}>
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        Top Posts
      </h3>
      <div className="space-y-2">
        {sorted.map((post, i) => (
          <div key={post.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
            <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
            {post.mediaUrl && (
              <img src={post.mediaUrl} alt="" className="w-9 h-9 rounded object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{post.title}</p>
              <span className="text-[10px] text-muted-foreground uppercase">{post.type}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="font-mono">{post.likes}</span>
              <Heart className="w-3 h-3 text-muted-foreground" />
            </div>
            {post.permalink && (
              <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FormatChart({ posts }: { posts: Post[] }) {
  const typeStats: Record<string, { count: number; totalLikes: number }> = {};
  for (const p of posts) {
    if (!typeStats[p.type]) typeStats[p.type] = { count: 0, totalLikes: 0 };
    typeStats[p.type].count++;
    typeStats[p.type].totalLikes += p.likes;
  }

  const data = Object.entries(typeStats).map(([name, stats]) => ({
    name: name === "reel" ? "Reels" : name === "carousel" ? "Carrosseis" : "Posts",
    media: Math.round(stats.totalLikes / stats.count),
    qtd: stats.count,
  }));

  return (
    <motion.div className="glass-card p-6" {...fadeIn} transition={{ delay: 0.3 }}>
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        Performance por Formato
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.70 0 0)" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }} />
          <Tooltip contentStyle={chartStyle} />
          <Bar dataKey="media" fill="oklch(0.60 0.24 25)" radius={[4, 4, 0, 0]} name="Curtidas (media)" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function RecentPostsTimeline({ posts }: { posts: Post[] }) {
  const recent = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 6);

  return (
    <motion.div className="glass-card p-6" {...fadeIn} transition={{ delay: 0.4 }}>
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        Ultimas Publicacoes
      </h3>
      <div className="space-y-2">
        {recent.map((post) => (
          <div key={post.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
            {post.mediaUrl && (
              <img src={post.mediaUrl} alt="" className="w-8 h-8 rounded object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate">{post.title}</p>
              <span className="text-[10px] text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase px-1.5 py-0.5 rounded bg-muted/40">
              {post.type}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [dataSource, setDataSource] = useState<string>("loading");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        setDataSource(data.source || "error");
        if (data.current) setMetrics(data.current);
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => setDataSource("error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-exa-red animate-spin" />
        <span className="ml-3 text-sm text-muted-foreground">Carregando dados do Instagram...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WifiOff className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Instagram API nao configurado</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Configure INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_BUSINESS_ACCOUNT_ID no .env
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Data source indicator */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        {dataSource === "instagram_api" ? (
          <>
            <Wifi className="w-3 h-3 text-exa-green" />
            <span className="text-exa-green">Dados reais do Instagram @examidia</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-exa-amber" />
            <span className="text-exa-amber">Erro ao conectar — verifique as credenciais</span>
          </>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="Seguidores" value={metrics.followers} icon={Users} delay={0} />
        <StatCard label="Alcance" value={metrics.reach7d} icon={Eye} delay={0.05} />
        <StatCard label="Engajamento" value={`${metrics.engagementAvg}%`} icon={Heart} delay={0.1} />
        <StatCard label="Salvamentos" value={metrics.totalSaves30d} icon={Bookmark} delay={0.15} />
        <StatCard label="Compartilhamentos" value={metrics.totalShares30d} icon={Share2} delay={0.2} />
        <StatCard label="Comentarios" value={metrics.totalComments30d} icon={MessageCircle} delay={0.25} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <HealthScoreWidget posts={posts} metrics={metrics} />
        </div>
        <div className="space-y-6">
          <FormatChart posts={posts} />
          <RecentPostsTimeline posts={posts} />
        </div>
        <div className="space-y-6">
          <TopPostsWidget posts={posts} />
        </div>
      </div>
    </div>
  );
}
