import { Schema, model,} from 'mongoose';
import { TRecipe } from './recipe.interface';
import { RECIPE_PREMIUM_STATUS } from './recipe.constant';

const recipeSchema = new Schema<TRecipe>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  images: [{ type: String }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  published: { type: Boolean, default: true },
  cookingTime: { type: Number, required: true },
  tags: [{ type: String }],
  premium: { type: String, enum: Object.values(RECIPE_PREMIUM_STATUS), required: true },  // Use the constants for validation
  ratings: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
    }
  ],
  averageRating: { type: Number, default: 0 },
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date },
    }
  ],
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

export const Recipe = model<TRecipe>('Recipe', recipeSchema);
