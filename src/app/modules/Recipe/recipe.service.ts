import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Recipe } from './recipe.model';
import { TRecipe } from './recipe.interface';
import axios from 'axios';


export const createRecipe = async (data: Partial<TRecipe>): Promise<TRecipe> => {
  const recipe = new Recipe(data);
  return recipe.save();
};

export const getRecipeById = async (recipeId: string): Promise<TRecipe | null> => {
  return Recipe.findById(recipeId).populate('user', 'name');;
};

export const updateRecipe = async (recipeId: string, data: Partial<TRecipe>): Promise<TRecipe | null> => {
  return Recipe.findByIdAndUpdate(recipeId, data, { new: true });
};

export const getRecipes = async (filters: any, options: any): Promise<TRecipe[]> => {
  const { search, sort, page = 1, limit = 10 } = options;

  let query = Recipe.find(filters);

  // Search by title
  if (search) {
    query = query.where('title', new RegExp(search, 'i'));
  }

  // Sort results
  if (sort) {
    query = query.sort(sort);
  }

  // Filter by ingredients
  if (filters.ingredients) {
    query = query.where('ingredients').in(filters.ingredients);
  }

  // Filter by cooking time
  if (filters.cookingTime) {
    query = query.where('cookingTime').lte(filters.cookingTime);
  }

  // Filter by tags (e.g., Vegetarian, Gluten-Free, etc.)
  if (filters.tags) {
    query = query.where('tags').in(filters.tags);
  }

  // Filter by published status (for free vs premium content)
  if (filters.published !== undefined) {
    query = query.where('published').equals(filters.published);
  }

  // Filter by rating range
  if (filters.minRating) {
    query = query.where('averageRating').gte(filters.minRating);
  }

  if (filters.maxRating) {
    query = query.where('averageRating').lte(filters.maxRating);
  }

  const recipes = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'name');

  return recipes;
};

export const deleteRecipe = async (recipeId: string): Promise<void> => {
  await Recipe.findByIdAndDelete(recipeId);
};





export const RecipeServices = {
  createRecipe,
  getRecipeById,
  updateRecipe,
  getRecipes,
  deleteRecipe,
};
