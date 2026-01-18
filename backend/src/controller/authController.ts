import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { IUser } from '../models/User';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '3d'
  });
};

export const googleAuth = async (req: Request, res: Response) => {
  const { id_token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { sub, name, email, picture } = payload;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.create({
        googleId: sub,
        displayName: name,
        email,
        image: picture
      });
    }

    const token = createToken(user._id.toString());
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating with Google' });
  }
};

export const getProfile = (req: Request, res: Response) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
