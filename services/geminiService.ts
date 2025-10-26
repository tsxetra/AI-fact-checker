
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk } from '../types';
// FIX: SYSTEM_INSTRUCTION is now correctly imported from the newly created constants.ts
import { SYSTEM_INSTRUCTION } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchWithAi = async (query: string): Promise<{ response: string; sources: GroundingChunk[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return { response: text, sources };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch from Gemini API: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching from the Gemini API.");
    }
};