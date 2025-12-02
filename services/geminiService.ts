
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExamCategory, WordCard } from "../types";
import { VOCAB_DATABASE } from "../data/vocabData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wordSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING, description: "The English vocabulary word." },
    phonetic: { type: Type.STRING, description: "IPA phonetic transcription." },
    definition: { type: Type.STRING, description: "Concise Chinese definition." },
    mnemonic: { 
      type: Type.STRING, 
      description: "A vivid, creative memory story in Chinese. Use visual imagery, sound association (谐音), or a funny scenario that connects the spelling/pronunciation to the meaning. It must be easy to visualize as a cartoon." 
    },
    exampleSentence: { type: Type.STRING, description: "An example sentence using the word." },
    exampleTranslation: { type: Type.STRING, description: "Chinese translation of the example sentence." },
    difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
  },
  required: ["word", "phonetic", "definition", "mnemonic", "exampleSentence", "exampleTranslation", "difficulty"]
};

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: wordSchema
};

export const generateVocabularyBatch = async (
  category: ExamCategory, 
  count: number = 5,
  excludeWords: string[] = []
): Promise<WordCard[]> => {
  
  const model = "gemini-2.5-flash";
  
  // 1. Get the full list for the category
  const fullList = VOCAB_DATABASE[category] || [];
  
  // 2. Filter out words that are already known/excluded
  const availableWords = fullList.filter(word => !excludeWords.includes(word));
  
  // 3. Select the next batch of words
  let selectedWords: string[] = [];
  let isRandomFallback = false;

  if (availableWords.length > 0) {
    selectedWords = availableWords.slice(0, count);
  } else {
    // Fallback if we run out of static words: generate random high-frequency words
    isRandomFallback = true;
  }

  // 4. Construct Prompt
  let prompt = "";
  if (!isRandomFallback) {
    prompt = `
      Role: Expert English Teacher specializing in ${category}.
      Task: Create detailed study cards for the following specific words: ${selectedWords.join(", ")}.
      
      Requirements:
      1. STRICTLY only generate content for the provided words.
      2. The "mnemonic" MUST be a vivid STORY or visual scene. Use "谐音" (homophone) or wild imagination.
      3. Example sentences should be simple and clear.
    `;
  } else {
    prompt = `
      Role: Expert English Teacher specializing in ${category}.
      Task: Generate ${count} NEW important vocabulary words frequently found in the ${category} exam.
      
      Requirements:
      1. Do not include these words: ${excludeWords.slice(-50).join(', ')}.
      2. The "mnemonic" MUST be a vivid STORY or visual scene.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.1, 
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as WordCard[];
      // Ensure the result matches our requested words (sometimes LLM might deviate slightly, though unlikely with schema)
      return data;
    }
    return [];
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    throw new Error("Failed to generate words via Gemini.");
  }
};

export const generateMnemonicImage = async (word: string, mnemonic: string): Promise<string | null> => {
  const model = "gemini-2.5-flash-image"; 
  
  const prompt = `
    Draw a simple, funny, minimalistic cartoon illustration to help remember the English word "${word}".
    The visual concept is based on this Chinese mnemonic: "${mnemonic}".
    
    Style: Hand-drawn doodle, thick lines, colorful, clear, no text inside the image. White background.
    Focus on the visual association described in the mnemonic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
