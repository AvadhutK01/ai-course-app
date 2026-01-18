// controllers/course.ts
import { Request, Response } from "express";
import { generateCourse } from "../utils/ai";
import UserCourseChatHistory from "../models/UserCourseChatHistory";

export const recieveInput = async (req: Request, res: Response) => {
  const { input, batchId } = req.body;

  if (!input || !batchId) {
    res.status(400).json({ error: "Missing input or batchId" });
    return; 
  }

  try {
    const course = await generateCourse(input);

    if (req.user) {
      const userId = req.user._id;
      
      let chatHistory = await UserCourseChatHistory.findOne({ userId, batchId });

      if (!chatHistory) {
        chatHistory = new UserCourseChatHistory({
          userId,
          batchId,
          messages: []
        });
      }

      chatHistory.messages.push({
        role: 'user',
        content: input,
        timestamp: new Date()
      });

      chatHistory.messages.push({
        role: 'model',
        content: JSON.stringify(course),
        timestamp: new Date()
      });

      await chatHistory.save();
    }

    res.status(200).json({
      message: "Input received",
      input,
      data: {
        topic: input,
        summary: course.summary,
        learning_plan: course.plan,
        videos: course.recommended_videos
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
