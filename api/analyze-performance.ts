import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const { tradesText } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze the following trading performance notes ('Did Well' and 'Would Change'). Summarize the main strengths, weaknesses, and common mistakes in a professional, constructive manner in 3-4 bullet points for each category.\n\n${tradesText}`,
    });
    
    res.status(200).json({ result: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
