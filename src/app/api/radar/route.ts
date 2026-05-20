import { NextResponse } from "next/server";
import { mockNews, mockInsights } from "@/data/mock-radar";

export async function GET() {
  return NextResponse.json({
    news: mockNews,
    insights: mockInsights,
    updatedAt: new Date().toISOString(),
  });
}
