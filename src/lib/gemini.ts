import { GoogleGenAI, Type, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTutorResponse(passageText: string, chatHistory: {role: string, text: string}[], newMessage: string) {
  const contents = chatHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: newMessage }] });

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: contents as any,
    config: {
      systemInstruction: `You are a helpful English tutor for Bengali students. Explain concepts clearly, mixing English and Bengali naturally. The student is currently studying the following passage:\n\n${passageText}`,
    }
  });

  return response.text;
}

export async function generateSummary(passageText: string, words: any[]) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: `Generate a structured summary for the following passage and words.
Passage: ${passageText}
Words: ${JSON.stringify(words)}`,
    config: {
      systemInstruction: "You are an expert HSC English teacher. Return ONLY valid JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING, description: "Passage overview in Bengali" },
          synWords: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { word: { type: Type.STRING }, meaning: { type: Type.STRING }, items: { type: Type.ARRAY, items: { type: Type.STRING } } } 
            } 
          },
          antWords: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { word: { type: Type.STRING }, meaning: { type: Type.STRING }, items: { type: Type.ARRAY, items: { type: Type.STRING } } } 
            } 
          },
          insights: { type: Type.STRING, description: "Word pattern analysis" },
          examTips: { type: Type.STRING, description: "HSC exam tips" }
        },
        required: ["overview", "synWords", "antWords", "insights", "examTips"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function generateQuiz(passageText: string, words: any[]) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: `Generate 5 MCQ questions from these HSC English words and passage.
Passage: ${passageText}
Words: ${JSON.stringify(words)}`,
    config: {
      systemInstruction: "Return ONLY valid JSON array of quiz questions.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            q: { type: Type.STRING, description: "The question" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options" },
            correct: { type: Type.INTEGER, description: "Index of correct option (0-3)" },
            explanation: { type: Type.STRING, description: "Explanation in Bengali" }
          },
          required: ["q", "options", "correct", "explanation"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}

export async function generateAudio(passageText: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this passage clearly: ${passageText}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' },
        },
      },
    },
  });
  const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  return inlineData ? `data:${inlineData.mimeType};base64,${inlineData.data}` : null;
}
