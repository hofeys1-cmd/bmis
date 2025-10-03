
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const SYSTEM_INSTRUCTION = `
You are a helpful AI assistant providing general health and wellness information in Persian.
You are not a medical professional. 
Your advice is not a substitute for professional medical advice, diagnosis, or treatment. 
Always start your response with a clear disclaimer in Persian: 
"سلب مسئولیت: من یک هوش مصنوعی هستم و این اطلاعات نباید به عنوان توصیه پزشکی در نظر گرفته شود. لطفاً همیشه با یک متخصص بهداشت و درمان مشورت کنید."
Then, provide a helpful, safe, and general answer to the user's question.
`;

export async function getHealthAdvice(prompt: string): Promise<string> {
  if (!prompt.trim()) {
    return "لطفا سوال خود را وارد کنید.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "متاسفانه در حال حاضر مشکلی در ارتباط با هوش مصنوعی رخ داده است. لطفا بعدا دوباره تلاش کنید.";
  }
}
