import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BibleStudy, QuizQuestion } from "../types";

const extractJson = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("JSON não encontrado na resposta.");
    return jsonMatch[0];
  } catch (e) {
    console.error("Erro ao extrair JSON:", text);
    throw new Error("A resposta da IA não contém um formato de dados válido.");
  }
};

const getAiInstance = () => {
  // A chave é injetada automaticamente, deixamos o SDK lidar com a falta dela inicialmente
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const fetchDailyStudy = async (theme?: string): Promise<BibleStudy> => {
  try {
    const ai = getAiInstance();
    const prompt = theme 
      ? `Crie um estudo bíblico profundo sobre: ${theme}.` 
      : "Gere um estudo bíblico diário inspirador.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: prompt,
      config: {
        systemInstruction: `Você é um mentor bíblico sábio. Responda ESTRITAMENTE em formato JSON puro, sem markdown.
        Estrutura:
        {
          "verse": "texto do versículo",
          "reference": "Livro Cap:Vers",
          "context": "explicação histórica/teológica",
          "application": "como aplicar na vida hoje",
          "prayer": "oração curta e poderosa",
          "theme": "título curto do tema"
        }`,
        responseMimeType: "application/json"
      },
    });

    if (!response.text) throw new Error("Resposta vazia da API.");
    return JSON.parse(extractJson(response.text));
  } catch (error: any) {
    console.error("Erro no fetchDailyStudy:", error);
    throw error;
  }
};

export const fetchDailyQuiz = async (): Promise<QuizQuestion> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: "Gere um quiz bíblico desafiador em JSON.",
      config: {
        systemInstruction: `Gere apenas JSON: { "question": "pergunta", "options": ["A", "B", "C", "D"], "correctIndex": 0-3, "explanation": "explicação" }`,
        responseMimeType: "application/json"
      },
    });

    return JSON.parse(extractJson(response.text));
  } catch (error: any) {
    console.error("Erro no fetchDailyQuiz:", error);
    throw error;
  }
};

export const generateAudio = async (text: string): Promise<Uint8Array> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });

    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64) throw new Error("Áudio indisponível na resposta.");
    
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error: any) {
    console.error("Erro no generateAudio:", error);
    throw error;
  }
};

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}