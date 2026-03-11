import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const geminiKey = process.env.GEMINI_API_KEY;
const isGeminiValid = geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY';
const openRouterKey = process.env.OPENROUTER_API_KEY;

const genAI = new GoogleGenerativeAI(isGeminiValid ? geminiKey : '');
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateContent(prompt: string) {
  // Try Native Gemini first
  if (isGeminiValid) {
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Native Gemini API Error:', error);
      // Fall through to OpenRouter if it failed and we have it
    }
  }

  // Fallback to OpenRouter
  if (openRouterKey && openRouterKey !== 'YOUR_OPENROUTER_API_KEY') {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openRouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://petlocal.com.br',
                'X-Title': 'PetLocal'
            },
            body: JSON.stringify({
                model: 'google/gemini-flash-1.5',
                messages: [{ role: 'user', content: prompt }]
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenRouter Fallback Error:', error);
        throw error;
    }
  }

  throw new Error('AI_CONFIG_MISSING: Nenhum provedor de IA configurado (Gemini ou OpenRouter).');
}
