import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY not found in .env");
      return res.status(500).json({ error: "Server misconfigured: no API key" });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);

    // Choose the model (Gemini 1.5 Flash is fast & free-tier friendly)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    console.log("📤 Sending message to Gemini:", message);



    const result = await model.generateContent(
      `Give a short, clear, and direct answer to this question: ${message}`
    );

    // Extract response text
    const text = result.response.text();

    console.log("✅ Gemini response:", text);

    res.json({ reply: text });
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
    res.status(500).json({
      error: "Failed to connect to Gemini AI",
      details: error.message,
    });
  }
});

export default router;


