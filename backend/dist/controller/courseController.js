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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recieveInput = void 0;
const ai_1 = require("../utils/ai");
const UserCourseChatHistory_1 = __importDefault(require("../models/UserCourseChatHistory"));
const recieveInput = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { input, batchId } = req.body;
    if (!input || !batchId) {
        res.status(400).json({ error: "Missing input or batchId" });
        return;
    }
    try {
        const course = yield (0, ai_1.generateCourse)(input);
        if (req.user) {
            const userId = req.user._id;
            let chatHistory = yield UserCourseChatHistory_1.default.findOne({ userId, batchId });
            if (!chatHistory) {
                chatHistory = new UserCourseChatHistory_1.default({
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
            yield chatHistory.save();
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.recieveInput = recieveInput;
