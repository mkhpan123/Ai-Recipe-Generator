import { GoogleGenAI, Type } from '@google/genai';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: GEMINI AI SERVICE (services/geminiService.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Encapsulates interaction with the Google Gemini API using `@google/genai`.
 *    - Constructs a structured prompt based on the user's available ingredients,
 *      dietary preferences, cuisine, cooking time limit, difficulty, and servings.
 *    - Requests structured JSON output containing: title, description, ingredients list,
 *      step-by-step instructions, prep time, cook time, difficulty, and nutritional summary.
 *
 * 2. Why is Gemini called from Express (backend) instead of React (frontend)?
 *    - "I keep the Gemini API key on the backend because exposing it in frontend code
 *      would allow anyone in the browser to inspect network requests or bundle code
 *      and steal/misuse the API key."
 *
 * 3. What interview questions can be asked about it?
 *    - "How do you ensure the AI returns clean, parseable JSON?"
 *       -> We configure `responseMimeType: 'application/json'` and provide an explicit
 *          JSON schema using `@google/genai`'s `responseSchema` or clear system instructions.
 *    - "What happens if the Gemini API call fails?"
 *       -> We use a try/catch block with fallback handling so the user receives a helpful
 *          error message without crashing the server.
 * ============================================================================
 */

export interface RecipeGenerationParams {
  ingredients: string[];
  dietaryPreference?: string;
  cuisine?: string;
  cookingTime?: string;
  difficulty?: string;
  servings?: number;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  nutritionSummary?: string;
}

export async function generateRecipeWithGemini(params: RecipeGenerationParams): Promise<GeneratedRecipe> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check your environment configuration.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const {
    ingredients,
    dietaryPreference = 'None',
    cuisine = 'Any',
    cookingTime = '30 minutes',
    difficulty = 'Easy',
    servings = 2
  } = params;

  const prompt = `
Create a realistic and delicious recipe based on the following user requirements:

Available Ingredients:
${ingredients.map(ing => `- ${ing}`).join('\n')}

Preferences:
- Dietary Preference: ${dietaryPreference}
- Desired Cuisine: ${cuisine}
- Target Time: ${cookingTime}
- Difficulty Level: ${difficulty}
- Servings: ${servings}

Please make sure the ingredients list uses quantities suitable for ${servings} servings and incorporates the given ingredients along with common kitchen staples (oil, salt, pepper, water) where necessary.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: prompt,
    config: {
      systemInstruction: 'You are an expert chef assistant. Return an enticing, culinary-sound recipe formatted strictly as valid JSON adhering to the specified schema.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Name of the dish'
          },
          description: {
            type: Type.STRING,
            description: 'Brief 1-2 sentence appetizing summary of the dish'
          },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of ingredients with exact quantities and units'
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Numbered step-by-step cooking steps'
          },
          prepTime: {
            type: Type.INTEGER,
            description: 'Preparation time in minutes'
          },
          cookTime: {
            type: Type.INTEGER,
            description: 'Cooking time in minutes'
          },
          servings: {
            type: Type.INTEGER,
            description: 'Number of servings'
          },
          difficulty: {
            type: Type.STRING,
            description: 'Easy, Medium, or Hard'
          },
          cuisine: {
            type: Type.STRING,
            description: 'Cuisine category (e.g. Italian, Indian, Mexican, etc.)'
          },
          nutritionSummary: {
            type: Type.STRING,
            description: 'Short approximate calories and macronutrient overview (e.g. ~450 kcal | 28g Protein)'
          }
        },
        required: ['title', 'description', 'ingredients', 'instructions', 'prepTime', 'cookTime', 'servings', 'difficulty', 'cuisine']
      }
    }
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Gemini returned an empty response.');
  }

  try {
    const recipeData: GeneratedRecipe = JSON.parse(responseText);
    return recipeData;
  } catch (err) {
    console.error('Failed to parse Gemini JSON response:', responseText);
    throw new Error('Failed to parse the recipe generated by AI.');
  }
}
