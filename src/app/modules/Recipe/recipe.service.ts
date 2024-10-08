import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Recipe } from './recipe.model';
import { TRecipe } from './recipe.interface';
import axios from 'axios';


export const createRecipe = async (data: Partial<TRecipe>): Promise<TRecipe> => {
  const recipe = new Recipe(data);
  return recipe.save();
};

//public get recipe
export const publicGetRecipeById = async (recipeId: string): Promise<TRecipe | null> => {
  return Recipe.findById(recipeId).populate('user', 'name');
};

export const getRecipeById = async (recipeId: string): Promise<TRecipe | null> => {
  return Recipe.findById(recipeId).populate('user', 'name');;
};

export const updateRecipe = async (recipeId: string, data: Partial<TRecipe>): Promise<TRecipe | null> => {
  return Recipe.findByIdAndUpdate(recipeId, data, { new: true });
};

// export const getRecipes = async (filters: any, options: any): Promise<TRecipe[]> => {
//   const { search, sort,  } = options;

//   let query = Recipe.find(filters);

//   // Search by title
//   if (search) {
//     query = query.where('title', new RegExp(search, 'i'));
//   }

//   // Sort results
//   if (sort) {
//     query = query.sort(sort);
//   }

//   // Filter by ingredients
//   if (filters.ingredients) {
//     query = query.where('ingredients').in(filters.ingredients);
//   }

//   // Filter by cooking time
//   if (filters.cookingTime) {
//     query = query.where('cookingTime').lte(filters.cookingTime);
//   }

//   // Filter by tags (e.g., Vegetarian, Gluten-Free, etc.)
//   if (filters.tags) {
//     query = query.where('tags').in(filters.tags);
//   }

//   // Filter by published status (for free vs premium content)
//   if (filters.published !== undefined) {
//     query = query.where('published').equals(filters.published);
//   }

//   // Filter by rating range
//   if (filters.minRating) {
//     query = query.where('averageRating').gte(filters.minRating);
//   }

//   if (filters.maxRating) {
//     query = query.where('averageRating').lte(filters.maxRating);
//   }

//   // Populate user data with name and profile picture
//   const recipes = await query
    
//     .populate('user', 'name profilePicture'); // Include profilePicture here

//   return recipes;
// };


//get all recipes
export const getRecipes = async (filters: any, options: any): Promise<TRecipe[]> => {
  const { search, sort } = options;

  let query = Recipe.find(filters);

  // Handle search logic for multiple fields
  if (search) {
    // Use RegExp to enable case-insensitive partial matching
    const regex = new RegExp(search, 'i');

    // Search across title, ingredients, tags, and cookingTime
    query = query.or([
      { title: regex },
      { ingredients: { $in: [regex] } }, // Search in ingredients array
      { tags: { $in: [regex] } }, // Search in tags array
      { cookingTime: search } // Match exact cookingTime
    ]);
  }

  // Apply sorting if requested
  if (sort) {
    query = query.sort(sort);
  }

  // Apply any additional filters (e.g., ingredients, cooking time, tags)
  if (filters.ingredients) {
    query = query.where('ingredients').in(filters.ingredients);
  }

  if (filters.cookingTime) {
    query = query.where('cookingTime').lte(filters.cookingTime);
  }

  if (filters.tags) {
    query = query.where('tags').in(filters.tags);
  }

  if (filters.published !== undefined) {
    query = query.where('published').equals(filters.published);
  }

  if (filters.minRating) {
    query = query.where('averageRating').gte(filters.minRating);
  }

  if (filters.maxRating) {
    query = query.where('averageRating').lte(filters.maxRating);
  }

  // Populate user data with name and profile picture
  const recipes = await query.populate('user', 'name profilePicture');

  return recipes;
};







export const deleteRecipe = async (recipeId: string): Promise<void> => {
  await Recipe.findByIdAndDelete(recipeId);
};


export const getRecipesByUser = async (userId: string): Promise<TRecipe[]> => {
  return Recipe.find({ user: userId }).populate('user', 'name profilePicture isPremium');
};

export const getUserSingleRecipe = async (recipeId: string, userId: string): Promise<TRecipe | null> => {
  const recipe = await Recipe.findOne({ _id: recipeId, user: userId }).populate('user', 'name profilePicture isPremium');
  return recipe;
};




export const editUserSingleRecipe = async (recipeId: string, userId: string, updatedRecipeData: Partial<TRecipe>): Promise<TRecipe | null> => {
  // Find the recipe by ID and user ID and update it with the new data
  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeId, user: userId }, // Ensure the recipe belongs to the user
    { $set: updatedRecipeData }, // Update the recipe with new data
    { new: true, runValidators: true } // Return the updated recipe and run validators
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
  editUserSingleRecipe
};
