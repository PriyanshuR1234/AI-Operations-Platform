const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

async function main() {
  console.log("Key loaded:", !!process.env.GEMINI_API_KEY);
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY.trim()
  });
  console.log("Starting API call...");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works in a few words",
    });
    console.log("API call finished!");
    console.log(response.text);
  } catch (error) {
    console.error("API error:", error);
  }
}

main();