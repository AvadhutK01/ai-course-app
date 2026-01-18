"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const UserCourseChatHistorySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    batchId: {
        type: String,
        required: true,
        index: true,
    },
    messages: [MessageSchema],
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('UserCourseChatHistory', UserCourseChatHistorySchema);
