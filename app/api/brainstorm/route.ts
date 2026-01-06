import { NextResponse } from "next/server";
import { generateGeminiResponse } from "@/app/lib/gemini";
import { openai, openaiModel } from "@/app/lib/openai";
import { buildBraceMapPrompt } from "@/app/lib/braceMapPrompt";

export async function POST(req: Request) {
    try {
        const { idea } = await req.json();

        if (!idea) {
            return NextResponse.json(
                { error: "Idea is required" },
                { status: 400 }
            );
        }

        const prompt = buildBraceMapPrompt(idea);
        let text = "";
        let provider = "";

        // Check for Gemini FIRST (Prioritized)
        if (process.env.GEMINI_API_KEY) {
            provider = "Gemini";
            text = await generateGeminiResponse(prompt);
        } else if (process.env.OPENAI_API_KEY) {
            provider = "OpenAI";
            const response = await openai.chat.completions.create({
                model: openaiModel,
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates JSON mind maps." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            });
            text = response.choices[0].message.content || "";
        } else {
            return NextResponse.json(
                { error: "No AI provider API key found (OpenAI or Gemini)" },
                { status: 500 }
            );
        }

        console.log(`Raw ${provider} Response:`, text);

        // Clean JSON (OpenAI with json_object format is usually clean, but Gemini needs it)
        const cleanJson = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/^[^{\[]+/, "") // Remove anything before the first { or [
            .replace(/[^}\]]+$/, "") // Remove anything after the last } or ]
            .trim();

        try {
            const parsed = JSON.parse(cleanJson);
            return NextResponse.json(parsed);
        } catch (parseError) {
            console.error(`${provider} JSON Parse Error:`, parseError);
            console.log("Failed to parse this text as JSON:", cleanJson);
            return NextResponse.json(
                { error: "Failed to parse AI response as JSON", raw: text, provider },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("AI API Error details:", error);

        return NextResponse.json(
            {
                error: "Failed to generate brace map",
                details: error?.message || "Unknown error",
                stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
            },
            { status: 500 }
        );
    }
}
