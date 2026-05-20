import { NextResponse } from "next/server";
import {
  isInstagramConfigured,
  fetchDashboardData,
} from "@/lib/services/instagram";
import { mockMetrics, currentMetrics, mockPosts, healthScore } from "@/data/mock-instagram";

export const dynamic = "force-dynamic";

export async function GET() {
  // If Instagram API is configured, fetch real data
  if (isInstagramConfigured()) {
    try {
      const data = await fetchDashboardData();

      // Calculate current metrics from real posts
      const totalLikes = data.posts.reduce((s, p) => s + p.likes, 0);
      const totalComments = data.posts.reduce((s, p) => s + p.comments, 0);
      const totalShares = data.posts.reduce((s, p) => s + p.shares, 0);
      const totalSaves = data.posts.reduce((s, p) => s + p.saves, 0);
      const totalReach = data.posts.reduce((s, p) => s + p.reach, 0);
      const avgEngagement = data.posts.length > 0
        ? +(data.posts.reduce((s, p) => s + p.engagementRate, 0) / data.posts.length).toFixed(2)
        : 0;

      return NextResponse.json({
        source: "instagram_api",
        account: data.account,
        current: {
          followers: data.account.followers,
          followersGrowth7d: 0, // Need daily tracking for this
          followersGrowth30d: 0,
          reach7d: totalReach,
          impressions7d: 0,
          engagementAvg: avgEngagement,
          totalLikes30d: totalLikes,
          totalComments30d: totalComments,
          totalShares30d: totalShares,
          totalSaves30d: totalSaves,
        },
        posts: data.posts.map((p) => ({
          id: p.id,
          type: p.type,
          title: p.title,
          caption: p.caption,
          publishedAt: p.publishedAt,
          reach: p.reach,
          impressions: p.impressions,
          likes: p.likes,
          comments: p.comments,
          shares: p.shares,
          saves: p.saves,
          engagementRate: p.engagementRate,
          permalink: p.permalink,
          mediaUrl: p.mediaUrl,
        })),
        health: null, // Will be calculated by AI analysis
        fetchedAt: data.fetchedAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Instagram API error";
      // Fallback to mock data on error
      return NextResponse.json({
        source: "mock_fallback",
        error: message,
        current: currentMetrics,
        daily: mockMetrics,
        posts: mockPosts,
        health: healthScore,
      });
    }
  }

  // Fallback: return mock data
  return NextResponse.json({
    source: "mock",
    current: currentMetrics,
    daily: mockMetrics,
    posts: mockPosts,
    health: healthScore,
  });
}
