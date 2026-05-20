import { NextResponse } from "next/server";
import { mockMetrics, currentMetrics, mockPosts, healthScore } from "@/data/mock-instagram";

export async function GET() {
  return NextResponse.json({
    daily: mockMetrics,
    current: currentMetrics,
    posts: mockPosts,
    health: healthScore,
  });
}
