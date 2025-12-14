import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askTutor = async (question: string, context: string) => {
  if (!process.env.API_KEY) {
      // Graceful fallback for demo purposes if no key provided
      return "Демо режим: За да работи AI туторот, потребно е да се конфигурира API клучот. (Demo Mode: API Key missing).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are a friendly and encouraging math tutor for middle school students.
        Context: The student is currently studying this content: "${context}".
        
        Question: ${question}
        
        Answer clearly, simply, and in Macedonian language (unless asked otherwise). Use examples if helpful. Keep it concise.
      `,
    });
    
    return response.text || "Се извинувам, не можам да одговорам во моментов.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Се појави грешка при комуникација со AI туторот.";
  }
};