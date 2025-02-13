// pages/api/story.js
import { generateStory } from "../../ai/generateStory.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }
  
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }
  
  try {
    const story = await generateStory(prompt);
    return res.status(200).json({ story });
  } catch (err) {
    console.error("Error in /api/story:", err);
    return res.status(500).json({ error: "Failed to generate story." });
  }
}
