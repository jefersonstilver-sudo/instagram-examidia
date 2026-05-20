import { NextRequest, NextResponse } from "next/server";
import { generateContent, type ContentModule } from "@/lib/services/openai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { module, audience, funnel, tone, hypeLevel, context } = await req.json();

    const result = await generateContent(module as ContentModule, {
      audience,
      funnel,
      tone,
      hypeLevel,
      context,
    });

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao gerar conteudo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
