import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface IUserCourseChatHistory extends Document {
  userId: Types.ObjectId;
  batchId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
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

const UserCourseChatHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    batchId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

export default model<IUserCourseChatHistory>('UserCourseChatHistory', UserCourseChatHistorySchema);
