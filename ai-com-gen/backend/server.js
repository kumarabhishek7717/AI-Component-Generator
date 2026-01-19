const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ ROOT TEST ROUTE
app.get("/", (req, res) => {
  res.send("AI Component Generator Backend is Live 🚀");
});

// ✅ Gemini AI init
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ MAIN API ROUTE
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, framework } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are an expert web developer.
Generate a responsive UI component.

Prompt: ${prompt}
Framework: ${framework}

Return ONLY code inside Markdown backticks.
      `,
    });

    res.json({ code: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// ✅ START SERVER (ONLY ONCE)
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
