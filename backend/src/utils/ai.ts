import { GoogleGenerativeAI } from "@google/generative-ai";

const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  .getGenerativeModel({ model: "gemini-flash-latest" });

export async function generateCourse(topic: string) {
  const prompt = `
  You must respond ONLY with valid JSON.
  No markdown. No explanation. No comments. Only JSON.

  The JSON format MUST be:
  {
    "summary": "string",
    "plan": ["step1", "step2", "..."],
    "recommended_videos": [
      { "title": "string", "url": "https://youtube.com/..." },
      ...
    ]
  }

  🔹 The recommended_videos MUST only include real YouTube video URLs.
  🔹 Videos MUST be tutorials or educational.
  🔹 Choose top-rated and long-form videos (avoid YouTube Shorts < 1 min).

  Topic: "${topic}"
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI did not return valid JSON:\n" + text);
  }
}
