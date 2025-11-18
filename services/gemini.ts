import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateArtCritique = async (title: string, tags: string[], artist: string): Promise<string> => {
  if (!apiKey) return "AI Configuration Missing: API Key not found.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a sophisticated, short, and poetic art critique (max 80 words) for an art piece titled "${title}" by ${artist}.
      The style tags are: ${tags.join(', ')}.
      Focus on the emotional resonance and the technique. Make it sound like a high-end gallery curator speaking.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "The artwork speaks for itself, beyond words.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our curator is currently unavailable to critique this piece.";
  }
};

export const curateCollection = async (userMood: string): Promise<string[]> => {
  // Returns a list of Art IDs that match the mood
  if (!apiKey) return [];

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      The user is feeling: "${userMood}".
      Select the best matching art pieces from this list (return ONLY a JSON array of IDs):
      
      1. Solitude in Blue (abstract, winter, melancholy)
      2. Urban Chill (urban, photography, cold)
      3. The Frozen Lake (nature, landscape, peaceful)
      4. Crimson Snow (surrealism, contrast, vivid)
      5. Mountain Whisper (landscape, majestic, mountains)
      6. Geometric Frost (abstract, geometric, sharp)

      Return strictly JSON. Example: ["1", "4"]
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Curation Error:", error);
    return [];
  }
};
