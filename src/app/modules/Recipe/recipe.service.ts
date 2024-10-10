import { Recipe } from './recipe.model';
import { TRecipe } from './recipe.interface';

export const createRecipe = async (
  data: Partial<TRecipe>,
): Promise<TRecipe> => {
  const recipe = new Recipe(data);
  return recipe.save();
};

//public get recipe
export const publicGetRecipeById = async (
  recipeId: string,
): Promise<TRecipe | null> => {
  return Recipe.findById(recipeId).populate('user', 'name');
};

export const getRecipeById = async (
  recipeId: string,
): Promise<TRecipe | null> => {
  return Recipe.findById(recipeId).populate('user', 'name');
};

export const updateRecipe = async (
  recipeId: string,
  data: Partial<TRecipe>,
): Promise<TRecipe | null> => {
  return Recipe.findByIdAndUpdate(recipeId, data, { new: true });
};

//get recipe from db
export const getRecipes = async (): Promise<TRecipe[]> => {
  const recipes = await Recipe.find().populate('user', 'name profilePicture');
  return recipes;
};

export const deleteRecipe = async (recipeId: string): Promise<void> => {
  await Recipe.findByIdAndDelete(recipeId);
};

export const getRecipesByUser = async (userId: string): Promise<TRecipe[]> => {
  return Recipe.find({ user: userId }).populate(
    'user',
    'name profilePicture isPremium',
  );
};

export const getUserSingleRecipe = async (
  recipeId: string,
  userId: string,
): Promise<TRecipe | null> => {
  const recipe = await Recipe.findOne({ _id: recipeId, user: userId }).populate(
    'user',
    'name profilePicture isPremium',
  );
  return recipe;
};

export const editUserSingleRecipe = async (
  recipeId: string,
  userId: string,
  updatedRecipeData: Partial<TRecipe>,
): Promise<TRecipe | null> => {
  // Find the recipe by ID and user ID and update it with the new data
  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeId, user: userId }, // Ensure the recipe belongs to the user
    { $set: updatedRecipeData }, // Update the recipe with new data
    { new: true, runValidators: true }, // Return the updated recipe and run validators
  ).populate('user', 'name profilePicture isPremium');

  return recipe;
};

export const RecipeServices = {
  createRecipe,
  getRecipeById,
  updateRecipe,
  getRecipes,
  deleteRecipe,
  publicGetRecipeById,
  getRecipesByUser,
  getUserSingleRecipe,
  editUserSingleRecipe,
};
