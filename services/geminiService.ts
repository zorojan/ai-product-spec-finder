import { GoogleGenAI } from "@google/genai";
import type { ProductInfo, GroundingChunk, Language } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const extractJson = (text: string): ProductInfo | null => {
    try {
        // Find the first '{' and the last '}' to extract the JSON object.
        // This is more robust than assuming the whole text is JSON, as the model might add extra text.
        const firstBracket = text.indexOf('{');
        const lastBracket = text.lastIndexOf('}');
        if (firstBracket === -1 || lastBracket === -1 || lastBracket < firstBracket) {
            console.error("Could not find a valid JSON object in the response text.");
            console.error("Response text:", text);
            return null;
        }
        const jsonText = text.substring(firstBracket, lastBracket + 1);
        
        const product = JSON.parse(jsonText) as ProductInfo;

        // Clean the specification values to remove source reference arrays, which the model might add.
        if (product.specifications && Array.isArray(product.specifications)) {
            product.specifications = product.specifications.map(spec => ({
                ...spec,
                value: String(spec.value).replace(/\s*\[[\d, ]+\]$/, '').trim()
            }));
        }

        return product;
    } catch (e) {
        console.error("Failed to parse JSON from response:", e);
        console.error("Malformed JSON string for parsing:", text);
        return null;
    }
};


export const findProductInfo = async (query: string, language: Language): Promise<{ product: ProductInfo | null; sources: GroundingChunk[] }> => {
    if (!query) {
        return { product: null, sources: [] };
    }

    const jsonSchemaDescription = `
The JSON object MUST have the following structure:
{
  "productName": "Full product name",
  "brand": "Product brand",
  "model": "Model number or name",
  "description": "A brief, one-paragraph description of the product.",
  "imageUrl": "A direct URL to a clear image of the product.",
  "specifications": [
    {
      "name": "Specification name (e.g., 'Screen Size')",
      "value": "Specification value (e.g., '6.8 inches')"
    }
  ]
}`;
    
    const ruJsonSchemaDescription = `
JSON-объект ДОЛЖЕН иметь следующую структуру:
{
  "productName": "Полное название продукта",
  "brand": "Бренд продукта",
  "model": "Номер или название модели",
  "description": "Краткое описание продукта в один абзац.",
  "imageUrl": "Прямая ссылка на четкое изображение продукта.",
  "specifications": [
    {
      "name": "Название характеристики (например, 'Размер экрана')",
      "value": "Значение характеристики (например, '6.8 дюймов')"
    }
  ]
}`;

    const systemInstructions = {
        en: `You are an expert AI assistant specializing in finding product information using Google Search.
Your task is to find detailed technical specifications, brand, model, a description, and a product image URL for the user's query.
You MUST format your entire response as a single, raw JSON object. Do not include any surrounding text, comments, or markdown code block markers (like \`\`\`json).
${jsonSchemaDescription}`,
        ru: `Ты — экспертный AI-ассистент, специализирующийся на поиске информации о продуктах с помощью Google Поиска.
Твоя задача — найти подробные технические характеристики, бренд, модель, описание и ссылку на изображение продукта по запросу пользователя.
Ты ДОЛЖЕН отформатировать весь свой ответ как единый, необработанный JSON-объект. Не включай в свой ответ никакой окружающий текст, комментарии или маркеры блока кода (например, \`\`\`json).
${ruJsonSchemaDescription}`
    };

    const userQuery = `Find product information for: "${query}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemInstructions[language],
                tools: [{ googleSearch: {} }],
                // NOTE: Removed responseMimeType and responseSchema as they are incompatible with the googleSearch tool.
                // The prompt now instructs the model to return JSON directly.
            },
        });

        const responseText = response.text;

        if (typeof responseText !== 'string' || !responseText.trim()) {
            if (response?.promptFeedback?.blockReason) {
                const reason = response.promptFeedback.blockReason;
                console.error(`Request was blocked by API. Reason: ${reason}`);
                throw new Error(`The request was blocked by the API due to: ${reason}.`);
            }
            console.error("Gemini API returned an empty or invalid response:", response);
            throw new Error("The AI returned an empty response. It might have been unable to find information or the request was blocked for other reasons.");
        }

        const productData = extractJson(responseText);
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        return { product: productData, sources };

    } catch (error) {
        console.error("Error fetching product info from Gemini:", error);
        if (error instanceof Error) {
            let errorMessage = error.message;
            // Attempt to parse a more specific error message if the error is a JSON string
            try {
                const parsedError = JSON.parse(errorMessage);
                if (parsedError?.error?.message) {
                    errorMessage = parsedError.error.message;
                }
            } catch (e) {
                // Not a JSON error message, use the original message
            }
            throw new Error(`The AI returned an error: ${errorMessage}`);
        }
        throw error;
    }
};