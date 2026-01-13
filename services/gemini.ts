import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

export const generateRecipeSuggestion = async (
  inventory: Product[], 
  apiKey: string | undefined
): Promise<string> => {
  if (!apiKey) return "Please provide an API Key to use the AI Chef.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Create a list of available ingredients
    const ingredients = inventory.map(p => p.name).join(", ");
    
    const prompt = `
      I have the following ingredients available in my grocery store: ${ingredients}.
      Suggest one delicious recipe I can make that uses some of these ingredients. 
      Keep it short, under 100 words. Format as a simple step-by-step list.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate a recipe at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI Chef is currently unavailable. Please check your API key.";
  }
};
