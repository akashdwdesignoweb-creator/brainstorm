import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = 'gemini-2.5-flash';

const config = {
    thinkingConfig: {
        // thinkingLevel: 'HIGH',
    },
    // Including tools as per user request snippet, though standard generation might not need search
    tools: [
        {
            googleSearch: {}
        },
    ],
};

export async function generateGeminiResponse(prompt: string): Promise<string> {
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: prompt,
                },
            ],
        },
    ];

    try {
        const responseStream = await ai.models.generateContentStream({
            model,
            config: config as any,
            contents,
        });

        let fullText = "";
        for await (const chunk of responseStream) {
            fullText += chunk.text || "";
        }
        return fullText;
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
}
