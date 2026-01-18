import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  image: string;
}

const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

export default model<IUser>('User', UserSchema);
