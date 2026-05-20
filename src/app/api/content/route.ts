import { NextResponse } from "next/server";
import { mockContentPipeline } from "@/data/mock-content";

export async function GET() {
  return NextResponse.json({
    pipeline: mockContentPipeline,
    total: mockContentPipeline.length,
  });
}
