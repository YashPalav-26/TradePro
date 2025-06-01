// src/backend/interfaces/IUser.ts
import { Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // Password might not always be selected
  watchlist: Array<{ name: string; price?: number }>;
  portfolio: Array<{ name: string; price?: number; quantity?: number }>;
  createdAt: Date; // from timestamps: true
  updatedAt: Date; // from timestamps: true
}

export type UserModelType = Model<IUser>;
