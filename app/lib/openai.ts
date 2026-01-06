import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const openaiModel = "gpt-o4-mini"; // You can change this to gpt-4 or gpt-3.5-turbo if needed
