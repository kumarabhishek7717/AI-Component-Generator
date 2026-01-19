// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Component Generator Backend is Live 🚀");
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, 
});


app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, framework } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

   
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are an expert web developer.
Generate a responsive UI component.

Prompt: ${prompt}
Framework: ${framework}

Return ONLY the code inside Markdown backticks.
      `,
    });

    if (!response || !response.text) {
      return res.status(500).json({ error: "AI returned empty response" });
    }

    res.json({ code: response.text });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
