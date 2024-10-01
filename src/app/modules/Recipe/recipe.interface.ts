import { Document, Schema, Types } from 'mongoose';
import { TUser } from '../User/user.interface';
import { RECIPE_PREMIUM_STATUS } from './recipe.constant';

export interface TRecipe extends Document {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  images: string[];
  Authorname: string | TUser;
  user: Types.ObjectId | TUser;
  published: boolean;
  cookingTime: number;
  tags: string[];
  premium: keyof typeof RECIPE_PREMIUM_STATUS; // Premium status field ('yes' or 'no')
  ratings: {
    user: Types.ObjectId | TUser;
    rating: number;
  }[];
  averageRating: number;
  comments: {
    user: Types.ObjectId | TUser;
    comment: string;
    createdAt: Date;
    updatedAt?: Date;
  }[];
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}