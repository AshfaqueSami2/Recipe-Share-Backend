import { z } from 'zod';
import { RECIPE_PREMIUM_STATUS } from './recipe.constant';

const createRecipeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.string(),
    images: z.array(z.string()).optional(), // Images can be an array of URLs
    cookingTime: z.number().min(1, 'Cooking time is required and must be at least 1 minute'), // New validation
    tags: z.array(z.string()).optional(), // New validation for tags
    premium: z.enum([RECIPE_PREMIUM_STATUS.YES, RECIPE_PREMIUM_STATUS.NO]),
  }),
});

const updateRecipeSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ingredients: z.array(z.string()).optional(),
    instructions: z.string().optional(),
    images: z.array(z.string()).optional(), // Images can be an array of URLs
    cookingTime: z.number().min(1).optional(), // New validation for cooking time
    tags: z.array(z.string()).optional(), // New validation for tags
  }),
});

export const RecipeValidation = {
  createRecipeSchema,
  updateRecipeSchema,
};




