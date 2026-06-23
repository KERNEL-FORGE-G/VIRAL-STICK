require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  console.error("⚠️ GEMINI_API_KEY not set in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      "Explique le concept de mème en une phrase courte et claire.",
    );
    const response = await result.response;
    console.log("🟢 Gemini response:", response.text());
  } catch (err) {
    console.error("❌ Error calling Gemini API:", err);
    process.exit(1);
  }
}

main();
