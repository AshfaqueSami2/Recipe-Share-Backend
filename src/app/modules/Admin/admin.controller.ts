import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { User } from '../User/user.model';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { Recipe } from '../Recipe/recipe.model';

// Block a user
export const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.blocked = true;
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been blocked successfully',
    data:{
        blockUser
    }
  });
});

// Unblock a user
export const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.blocked = false;
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been unblocked successfully',
    data:{
        unblockUser
    }
  });
});

// Delete a user
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User account deleted successfully',
    data:{
        deleteUser
    }
  });
});



//get all user
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find({}); // Fetch all users from the database
  if (!users) {
    throw new AppError(httpStatus.NOT_FOUND, 'No users found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    data: users,
  });
});






// Get all recipes (Admin only)
export const getAllRecipes = catchAsync(async (req: Request, res: Response) => {
  const recipes = await Recipe.find({});
  if (!recipes || recipes.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No recipes found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipes fetched successfully',
    data: recipes,
  });
});

// Update a recipe (Admin only)
export const updateRecipe = catchAsync(async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  const updateData = req.body;

  const recipe = await Recipe.findByIdAndUpdate(recipeId, updateData, { new: true });
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe updated successfully',
    data: recipe,
  });
});

// Delete a recipe (Admin only)
export const deleteRecipe = catchAsync(async (req: Request, res: Response) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findByIdAndDelete(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe deleted successfully',
    data: {
      recipe,
    },
  });
});
