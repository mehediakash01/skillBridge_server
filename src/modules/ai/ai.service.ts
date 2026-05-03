import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

const generateResponse = async (taskType: string, userInput: string, userContext: string) => {
  if (!apiKey) {
    // If no API key is provided, return mock data
    if (taskType === "search-suggestions") {
      return [
        "Expert Math Tutor for Calculus & Algebra",
        "Native Spanish Speaker for Conversational Practice",
        "Experienced Python Developer for Coding Interviews",
        "Certified SAT/ACT Test Prep Instructor",
        "AP Physics & Chemistry Teacher",
        "Creative Writing Coach & Essay Editor"
      ];
    } else if (taskType === "personalized-recommendations") {
      return [
        "Learn math",
        "Learn physics",
        "Learn programming",
        "English tutor",
        "Chemistry tutor",
        "History tutor"
      ];
    }
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are LearnForge AI — an expert tutor matching system for a leading 1-on-1 online tutoring platform.

Response Rules:
- Always return clean, valid JSON only
- No explanations, no markdown, no extra text
- For suggestions → array of strings
- For recommendations → array of strings

Output only JSON.`,
  });

  const prompt = `Task Type: ${taskType}

User Input: "${userInput}"
User Interests/Context: "${userContext}"

---
**For search-suggestions:**
Generate 6 smart autocomplete-style search suggestions.

**For personalized-recommendations:**
Generate 4 high-quality tutor recommendation titles/descriptions tailored to the user.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  try {
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Failed to parse JSON from AI response", error);
    return [];
  }
};

export const aiService = {
  generateResponse,
};
