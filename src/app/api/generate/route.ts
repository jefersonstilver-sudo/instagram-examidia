import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY nao configurada" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });
    const { module, audience, funnel, tone, hypeLevel, context } = await req.json();

    const systemPrompt = `Voce e o estrategista de conteudo da EXA Midia, empresa de midia DOOH (Digital Out Of Home) em elevadores de Foz do Iguacu.
Publicos: anunciantes locais, sindicos, moradores.
Produto: telas digitais em elevadores de predios residenciais e comerciais.
Tom da marca: provocativo, premium, data-driven.
Gere conteudo em portugues brasileiro.`;

    const userPrompt = `Gere um ${module} para o publico "${audience}", funil "${funnel}", tom "${tone}", nivel de hype "${hypeLevel}".
${context ? `Contexto adicional: ${context}` : ""}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.8,
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao gerar conteudo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
