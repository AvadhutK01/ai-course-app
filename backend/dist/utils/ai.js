"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCourse = generateCourse;
const generative_ai_1 = require("@google/generative-ai");
const model = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    .getGenerativeModel({ model: "gemini-flash-latest" });
function generateCourse(topic) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const result = yield model.generateContent(prompt);
        const text = result.response.text().trim();
        try {
            return JSON.parse(text);
        }
        catch (_a) {
            const match = text.match(/\{[\s\S]*\}/);
            if (match)
                return JSON.parse(match[0]);
            throw new Error("AI did not return valid JSON:\n" + text);
        }
    });
}
