/**
 * Instagram Graph API Service
 *
 * Requires:
 * - INSTAGRAM_ACCESS_TOKEN: Long-lived access token
 * - INSTAGRAM_BUSINESS_ACCOUNT_ID: Instagram Business Account ID
 *
 * How to get these:
 * 1. Go to https://developers.facebook.com
 * 2. Create an app (Business type)
 * 3. Add Instagram Graph API product
 * 4. Generate a User Token with permissions:
 *    - instagram_basic
 *    - instagram_manage_insights
 *    - pages_show_list
 *    - pages_read_engagement
 * 5. Exchange for long-lived token (60 days)
 * 6. Get your Instagram Business Account ID via:
 *    GET /me/accounts → page_id
 *    GET /{page_id}?fields=instagram_business_account → ig_id
 */

const GRAPH_API = "https://graph.facebook.com/v18.0";

function getConfig() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  return { accessToken, accountId };
}

export function isInstagramConfigured(): boolean {
  const { accessToken, accountId } = getConfig();
  return !!(accessToken && accountId);
}

async function graphGet(endpoint: string, params: Record<string, string> = {}) {
  const { accessToken } = getConfig();
  if (!accessToken) throw new Error("INSTAGRAM_ACCESS_TOKEN not configured");

  const url = new URL(`${GRAPH_API}${endpoint}`);
  url.searchParams.set("access_token", accessToken);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`);
  }
  return res.json();
}

// ─── Account Info ────────────────────────────────────────────────

export async function fetchAccountInfo() {
  const { accountId } = getConfig();
  return graphGet(`/${accountId}`, {
    fields: "id,name,username,biography,followers_count,follows_count,media_count,profile_picture_url,website",
  });
}

// ─── Account Insights (daily metrics) ───────────────────────────

export async function fetchAccountInsights(period: "day" | "week" | "days_28" = "day", since?: number, until?: number) {
  const { accountId } = getConfig();
  const params: Record<string, string> = {
    metric: "impressions,reach,follower_count,profile_views,website_clicks",
    period,
    metric_type: "total_value",
  };
  if (since) params.since = since.toString();
  if (until) params.until = until.toString();

  return graphGet(`/${accountId}/insights`, params);
}

export async function fetchFollowerDemographics() {
  const { accountId } = getConfig();
  return graphGet(`/${accountId}/insights`, {
    metric: "follower_demographics",
    period: "lifetime",
    metric_type: "total_value",
    breakdown: "city",
  });
}

// ─── Media (posts) ──────────────────────────────────────────────

export async function fetchMedia(limit = 25) {
  const { accountId } = getConfig();
  return graphGet(`/${accountId}/media`, {
    fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
    limit: limit.toString(),
  });
}

export async function fetchMediaInsights(mediaId: string, mediaType: string) {
  const metrics = mediaType === "VIDEO" || mediaType === "REEL"
    ? "impressions,reach,likes,comments,shares,saved,plays,total_interactions"
    : mediaType === "CAROUSEL_ALBUM"
    ? "impressions,reach,likes,comments,shares,saved,total_interactions"
    : "impressions,reach,likes,comments,shares,saved,total_interactions";

  return graphGet(`/${mediaId}/insights`, { metric: metrics });
}

// ─── Normalize data for our app ─────────────────────────────────

export interface NormalizedPost {
  id: string;
  type: "reel" | "carousel" | "post" | "stories";
  title: string;
  caption: string;
  mediaUrl: string;
  permalink: string;
  publishedAt: string;
  likes: number;
  comments: number;
  reach: number;
  impressions: number;
  shares: number;
  saves: number;
  engagementRate: number;
}

export function normalizeMediaType(igType: string): NormalizedPost["type"] {
  switch (igType) {
    case "VIDEO": return "reel";
    case "CAROUSEL_ALBUM": return "carousel";
    default: return "post";
  }
}

export async function fetchNormalizedPosts(limit = 25): Promise<NormalizedPost[]> {
  const mediaResponse = await fetchMedia(limit);
  const posts: NormalizedPost[] = [];

  for (const item of mediaResponse.data || []) {
    let insights = { reach: 0, impressions: 0, shares: 0, saves: 0 };
    try {
      const insightsRes = await fetchMediaInsights(item.id, item.media_type);
      for (const metric of insightsRes.data || []) {
        if (metric.name === "reach") insights.reach = metric.values?.[0]?.value || 0;
        if (metric.name === "impressions") insights.impressions = metric.values?.[0]?.value || 0;
        if (metric.name === "shares") insights.shares = metric.values?.[0]?.value || 0;
        if (metric.name === "saved") insights.saves = metric.values?.[0]?.value || 0;
      }
    } catch {
      // Some posts may not have insights available
    }

    const followers = 6548; // Will be fetched dynamically
    const totalInteractions = (item.like_count || 0) + (item.comments_count || 0) + insights.shares + insights.saves;
    const engagementRate = followers > 0 ? +((totalInteractions / followers) * 100).toFixed(2) : 0;

    posts.push({
      id: item.id,
      type: normalizeMediaType(item.media_type),
      title: (item.caption || "").split("\n")[0].slice(0, 80),
      caption: item.caption || "",
      mediaUrl: item.media_url || item.thumbnail_url || "",
      permalink: item.permalink || "",
      publishedAt: item.timestamp,
      likes: item.like_count || 0,
      comments: item.comments_count || 0,
      reach: insights.reach,
      impressions: insights.impressions,
      shares: insights.shares,
      saves: insights.saves,
      engagementRate,
    });
  }

  return posts;
}

// ─── Full dashboard data ────────────────────────────────────────

export async function fetchDashboardData() {
  const [account, posts] = await Promise.all([
    fetchAccountInfo(),
    fetchNormalizedPosts(25),
  ]);

  let dailyInsights = null;
  try {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
    dailyInsights = await fetchAccountInsights("day", thirtyDaysAgo, now);
  } catch {
    // Insights may require specific permissions
  }

  return {
    account: {
      id: account.id,
      username: account.username,
      name: account.name,
      followers: account.followers_count,
      following: account.follows_count,
      mediaCount: account.media_count,
      profilePicture: account.profile_picture_url,
      website: account.website,
      bio: account.biography,
    },
    posts,
    dailyInsights,
    fetchedAt: new Date().toISOString(),
  };
}
