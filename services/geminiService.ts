
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: AIzaSyAKZG2968cpUIFR9bOOjqr9YCfuD87rgcE });

export async function fetchSetTheoryQuestions(): Promise<Question[]> {
  try {
    // Fix: Using gemini-3-pro-preview for complex math/STEM tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: 'Generate 15 math questions about Set Theory (เซต) for high school level in Thai. Focus on union, intersection, complement, difference, subsets, and power sets. Each question must have 3 multiple choice options.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: 'The math question text in Thai' },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: 'Exactly 3 options for the answer'
              },
              correctIndex: { type: Type.INTEGER, description: 'Index of the correct answer (0, 1, or 2)' }
            },
            required: ['text', 'options', 'correctIndex']
          }
        }
      }
    });

    // Fix: Directly accessing .text property of GenerateContentResponse
    const data = JSON.parse(response.text || "[]");
    return data.map((q: any, index: number) => ({
      ...q,
      id: `q-${index}`
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    // Return fallback questions if API fails
    return [
      {
        id: 'fallback-1',
        text: 'กำหนดให้ A = {1, 2, 3} และ B = {3, 4, 5} แล้ว A ∩ B คือข้อใด?',
        options: ['{3}', '{1, 2, 3, 4, 5}', '∅'],
        correctIndex: 0
      }
    ];
  }
}
