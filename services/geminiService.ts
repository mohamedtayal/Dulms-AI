import { GoogleGenAI, Chat } from "@google/genai";

// ⚠️ ضع الـ API Key في ملف .env.local
// VITE_GEMINI_API_KEY=your_api_key_here
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!API_KEY) {
    console.warn("⚠️ Missing VITE_GEMINI_API_KEY - Add it to .env.local file");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const createChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "أنت مساعد ذكاء اصطناعي متطور واسمك Dulms AI. مهمتك هي مساعدة المستخدمين بإجابات دقيقة ومفيدة. كن مهذباً وودوداً. تحدث باللغة العربية.",
        },
    });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
    try {
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Error:", error);
        return "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.";
    }
};
