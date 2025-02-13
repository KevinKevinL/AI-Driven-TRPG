// pages/api/characterDescription.js

import { generateCharacterDescription } from "../../ai/generateCharacterDescription.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }
  
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }
  
  try {
    const descriptionData = await generateCharacterDescription(prompt);
    return res.status(200).json({ description: descriptionData.description });
  } catch (err) {
    console.error("Error in /api/characterDescription:", err);
    return res.status(500).json({ error: "Failed to generate character description." });
  }
}
