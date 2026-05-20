"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Eye, Heart, Bookmark, Share2, MessageCircle, ArrowUpRight, ArrowDownRight, Loader2, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const chartStyle = {
  background: "oklch(0.18 0.012 260)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: "8px",
  fontSize: "12px",
};

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

interface Metrics {
  followers: number;
  reach7d: number;
  engagementAvg: number;
  totalLikes30d: number;
  totalComments30d: number;
  totalShares30d: number;
  totalSaves30d: number;
}

function MetricRow({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-mono font-medium">{typeof value === "number" ? value.toLocaleString() : value}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        setSource(data.source);
        if (data.current) setMetrics(data.current);
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => setSource("error"))
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

  // Format performance by type
  const typeStats: Record<string, { count: number; totalLikes: number; totalReach: number; totalSaves: number }> = {};
  for (const p of posts) {
    if (!typeStats[p.type]) typeStats[p.type] = { count: 0, totalLikes: 0, totalReach: 0, totalSaves: 0 };
    typeStats[p.type].count++;
    typeStats[p.type].totalLikes += p.likes;
    typeStats[p.type].totalReach += p.reach;
    typeStats[p.type].totalSaves += p.saves;
  }

  const formatData = Object.entries(typeStats).map(([name, stats]) => ({
    name: name === "reel" ? "Reels" : name === "carousel" ? "Carrosseis" : "Posts",
    likes: Math.round(stats.totalLikes / stats.count),
    alcance: Math.round(stats.totalReach / stats.count),
    quantidade: stats.count,
  }));

  const sortedPosts = [...posts].sort((a, b) => (b.likes + b.comments + b.saves) - (a.likes + a.comments + a.saves));

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-exa-red" />
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Dados reais do Instagram @examidia — {posts.length} posts analisados
        </p>
      </div>

      {/* Overview metrics */}
      {metrics && (
        <div className="glass-card p-6">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Visao Geral — @examidia</h3>
          <div className="divide-y divide-border/30">
            <MetricRow label="Seguidores" value={metrics.followers} icon={Users} />
            <MetricRow label="Alcance Total (top 25 posts)" value={metrics.reach7d} icon={Eye} />
            <MetricRow label="Engajamento Medio" value={`${metrics.engagementAvg}%`} icon={Heart} />
            <MetricRow label="Total Curtidas" value={metrics.totalLikes30d} icon={Heart} />
            <MetricRow label="Total Salvamentos" value={metrics.totalSaves30d} icon={Bookmark} />
            <MetricRow label="Total Compartilhamentos" value={metrics.totalShares30d} icon={Share2} />
            <MetricRow label="Total Comentarios" value={metrics.totalComments30d} icon={MessageCircle} />
          </div>
        </div>
      )}

      {/* Format comparison */}
      {formatData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Media de Curtidas por Formato</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formatData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "oklch(0.70 0 0)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }} />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="likes" fill="oklch(0.60 0.24 25)" radius={[4, 4, 0, 0]} name="Curtidas (media)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Quantidade por Formato</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formatData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "oklch(0.70 0 0)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }} />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="quantidade" fill="oklch(0.75 0.14 210)" radius={[4, 4, 0, 0]} name="Posts" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Top posts */}
      <div className="glass-card p-6">
        <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Ranking de Posts (por engajamento total)</h3>
        <div className="space-y-3">
          {sortedPosts.slice(0, 15).map((post, i) => (
            <div key={post.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
              {post.mediaUrl && (
                <img src={post.mediaUrl} alt="" className="w-10 h-10 rounded object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{post.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-muted-foreground uppercase">{post.type}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="text-center"><span className="block text-muted-foreground">Likes</span><span className="font-mono">{post.likes}</span></div>
                <div className="text-center"><span className="block text-muted-foreground">Coment.</span><span className="font-mono">{post.comments}</span></div>
                <div className="text-center"><span className="block text-muted-foreground">Saves</span><span className="font-mono">{post.saves}</span></div>
                <div className="text-center"><span className="block text-muted-foreground">Shares</span><span className="font-mono">{post.shares}</span></div>
                {post.permalink && (
                  <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
