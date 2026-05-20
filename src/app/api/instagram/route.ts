import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GRAPH_API = "https://graph.facebook.com/v18.0";

async function graphGet(endpoint: string, params: Record<string, string> = {}) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) throw new Error("INSTAGRAM_ACCESS_TOKEN not set");

  const url = new URL(`${GRAPH_API}${endpoint}`);
  url.searchParams.set("access_token", token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Graph API ${res.status}`);
  return res.json();
}

export async function GET() {
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token || !accountId) {
    return NextResponse.json({ source: "not_configured", error: "Instagram API not configured" });
  }

  try {
    // Fetch account + media in parallel
    const [account, mediaRes] = await Promise.all([
      graphGet(`/${accountId}`, {
        fields: "id,username,name,followers_count,follows_count,media_count,profile_picture_url,biography",
      }),
      graphGet(`/${accountId}/media`, {
        fields: "id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink",
        limit: "50",
      }),
    ]);

    const posts = (mediaRes.data || []).map((p: Record<string, unknown>) => {
      const caption = (p.caption as string) || "";
      const firstLine = caption.split("\n")[0].slice(0, 80);
      return {
        id: p.id,
        type: p.media_type === "VIDEO" ? "reel" : p.media_type === "CAROUSEL_ALBUM" ? "carousel" : "post",
        title: firstLine || "Sem titulo",
        caption,
        mediaUrl: p.media_url || p.thumbnail_url || "",
        permalink: p.permalink || "",
        publishedAt: p.timestamp,
        likes: p.like_count || 0,
        comments: p.comments_count || 0,
      };
    });

    // Calculate metrics from real data
    const totalLikes = posts.reduce((s: number, p: { likes: number }) => s + p.likes, 0);
    const totalComments = posts.reduce((s: number, p: { comments: number }) => s + p.comments, 0);

    // Fetch insights for recent posts (reach, saves, shares)
    let totalReach = 0;
    let totalSaves = 0;
    let totalShares = 0;
    const postsWithInsights = [];

    for (const post of posts.slice(0, 25)) {
      let reach = 0, saves = 0, shares = 0;
      try {
        const insightsRes = await graphGet(`/${post.id}/insights`, {
          metric: "impressions,reach,saved,shares",
        });
        for (const m of insightsRes.data || []) {
          const val = m.values?.[0]?.value || 0;
          if (m.name === "reach") reach = val;
          if (m.name === "saved") saves = val;
          if (m.name === "shares") shares = val;
        }
      } catch {
        // Some posts may not support insights
      }
      totalReach += reach;
      totalSaves += saves;
      totalShares += shares;

      const engRate = account.followers_count > 0
        ? +(((post.likes + post.comments + saves + shares) / account.followers_count) * 100).toFixed(2)
        : 0;

      postsWithInsights.push({ ...post, reach, saves, shares, engagementRate: engRate });
    }

    // Add remaining posts without insights
    for (const post of posts.slice(25)) {
      postsWithInsights.push({ ...post, reach: 0, saves: 0, shares: 0, engagementRate: 0 });
    }

    const avgEngagement = postsWithInsights.length > 0
      ? +(postsWithInsights.slice(0, 10).reduce((s, p) => s + p.engagementRate, 0) / Math.min(postsWithInsights.length, 10)).toFixed(2)
      : 0;

    return NextResponse.json({
      source: "instagram_api",
      account: {
        id: account.id,
        username: account.username,
        name: account.name,
        followers: account.followers_count,
        following: account.follows_count,
        mediaCount: account.media_count,
        profilePicture: account.profile_picture_url,
        bio: account.biography,
      },
      current: {
        followers: account.followers_count,
        followersGrowth7d: 0,
        followersGrowth30d: 0,
        reach7d: totalReach,
        impressions7d: 0,
        engagementAvg: avgEngagement,
        totalLikes30d: totalLikes,
        totalComments30d: totalComments,
        totalShares30d: totalShares,
        totalSaves30d: totalSaves,
      },
      posts: postsWithInsights,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Instagram API error";
    return NextResponse.json({ source: "error", error: message }, { status: 500 });
  }
}
