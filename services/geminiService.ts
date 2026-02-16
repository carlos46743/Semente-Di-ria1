
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BibleStudy, QuizQuestion } from "../types";

// Função auxiliar para extrair JSON puro de uma string que pode conter Markdown
const cleanJsonResponse = (text: string) => {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return jsonMatch ? jsonMatch[0] : text;
};

export const fetchDailyStudy = async (theme?: string): Promise<BibleStudy> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = theme 
      ? `Crie um estudo bíblico profundo sobre o tema: ${theme}.`
      : "Gere um estudo bíblico diário inspirador.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `Você é um mentor cristão sábio e acolhedor. 
        Sua tarefa é gerar um estudo bíblico diário estritamente no formato JSON.
        O estudo deve incluir:
        1. 'verse': O texto do versículo.
        2. 'reference': A referência bíblica (ex: João 3:16).
        3. 'context': Uma explicação simples do contexto histórico ou teológico (máx 3 parágrafos).
        4. 'application': Aplicação prática para o dia a dia.
        5. 'prayer': Uma oração curta e poderosa.
        6. 'theme': Um título curto para o tema.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verse: { type: Type.STRING },
            reference: { type: Type.STRING },
            context: { type: Type.STRING },
            application: { type: Type.STRING },
            prayer: { type: Type.STRING },
            theme: { type: Type.STRING },
          },
          required: ["verse", "reference", "context", "application", "prayer", "theme"],
        },
      },
    });

    const cleanedText = cleanJsonResponse(response.text);
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Erro no Gemini Service (fetchDailyStudy):", error);
    throw error;
  }
};

export const fetchDailyQuiz = async (): Promise<QuizQuestion> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma pergunta de quiz bíblico desafiadora mas educativa.",
      config: {
        systemInstruction: "Crie uma pergunta de múltipla escolha sobre a Bíblia no formato JSON com: question, options (array de 4), correctIndex (0-3), e explanation.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctIndex", "explanation"],
        },
      },
    });

    const cleanedText = cleanJsonResponse(response.text);
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Erro no Gemini Service (fetchDailyQuiz):", error);
    throw error;
  }
};

export const generateAudioDevotional = async (text: string): Promise<Uint8Array> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Leia este devocional de forma calma e inspiradora: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Falha ao gerar áudio");
    
    return decode(base64Audio);
  } catch (error) {
    console.error("Erro no Gemini Service (generateAudioDevotional):", error);
    throw error;
  }
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
