import { Request, RequestHandler, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { RecipeServices } from './recipe.service';
import AppError from '../../errors/AppError';
import { uploadImageToImageBB } from './recipe.utils';
import { TUser } from '../User/user.interface';
import { Recipe } from './recipe.model';
import { USER_ROLE } from '../User/user.constant';
import { Types } from 'mongoose';

// const createRecipe: RequestHandler = catchAsync(async (req, res) => {
//   if (!req.user) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
//   }

//   const imageBase64Array = req.body.images || [];
//   const imageUrls: string[] =
//     imageBase64Array.length > 0
//       ? await Promise.all(
//           imageBase64Array.map((imageBase64: string) =>
//             uploadImageToImageBB(imageBase64),
//           ),
//         )
//       : [];

//   const recipeData = {
//     ...req.body,
//     images: imageUrls,
//     user: req.user.id,
//   };

//   // Create the recipe
//   const result = await RecipeServices.createRecipe(recipeData);

//   // Populate the user's name
//   const populatedRecipe = await Recipe.findById(result._id).populate(
//     'user',
//     'name',
//   );

//   if (!populatedRecipe || !populatedRecipe.user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Recipe or user not found');
//   }

//   // Type Assertion: We now assert that `user` is of type `TUser`
//   const user = populatedRecipe.user as TUser;

//   // Send the response with the populated user information
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Recipe created successfully',
//     data: {
//       recipe: populatedRecipe,
//       user: {
//         id: user._id, // Access the user ID
//         name: user.name, // Access the user name
//         pic: user.profilePicture,
//       },
//     },
//   });
// });
const createRecipe: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const imageBase64Array = req.body.images || [];
  const imageUrls: string[] =
    imageBase64Array.length > 0
      ? await Promise.all(
          imageBase64Array.map((imageBase64: string) =>
            uploadImageToImageBB(imageBase64),
          ),
        )
      : [];

  const recipeData = {
    ...req.body,
    images: imageUrls,
    user: req.user.id, // Assign the user's ID from req.user
  };

  // Create the recipe
  const result = await RecipeServices.createRecipe(recipeData);

  // Populate the user's name and profile picture
  const populatedRecipe = await Recipe.findById(result._id).populate(
    'user',
    'name profilePicture',
  );

  if (!populatedRecipe || !populatedRecipe.user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe or user not found');
  }

  // Send the response with the populated user information
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe created successfully',
    data: {
      recipe: populatedRecipe,
      user: {
        id: populatedRecipe.user._id,
        name: populatedRecipe.user.name,
        pic: populatedRecipe.user.profilePicture, // Send the profile picture
      },
    },
  });
});




//my recipe
const getMyRecipes = catchAsync(async (req: Request, res: Response) => {
  // Ensure the user is authenticated
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  // Fetch recipes created by the logged-in user
  const userId = req.user.id;
  const recipes = await Recipe.find({ user: userId }).populate('user', 'name');

  // Get the total count of recipes created by the user
  const totalRecipes = await Recipe.countDocuments({ user: userId });

  // Return the recipes and total count
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: {
      recipes,
      totalRecipes,
    },
  });
});

const publicGetRecipeById = catchAsync(async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  if (recipe.premium === 'yes') {
    // Check if the user is a premium user
    if (req.user?.isPremium) {
      // Premium user, send full recipe
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: recipe,
      });
    } else {
      // Non-premium user, send partial recipe
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: {
          _id: recipe._id,
          title: recipe.title,
          description: recipe.description,
          images: recipe.images,
          cookingTime: recipe.cookingTime,
          tags: recipe.tags,
          teaser: recipe.instructions.substring(0, 50) + '...',
          message: 'Subscribe to premium to see the full recipe!',
        },
      });
    }
  } else {
    // If recipe is free, send the full content
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: recipe,
    });
  }
});

const getRecipeById = catchAsync(async (req: Request, res: Response) => {
  const { recipeId } = req.params;
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  // Check if the recipe is premium
  if (recipe.premium === 'yes') {
    if (req.user?.isPremium) {
      // Premium user, return full recipe
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: recipe,
      });
    } else {
      // Non-premium user, return partial recipe details
      const partialRecipe = {
        _id: recipe._id,
        title: recipe.title,
        description: recipe.description,
        images: recipe.images,
        cookingTime: recipe.cookingTime,
        tags: recipe.tags,
        teaser: recipe.instructions.substring(0, 50) + '...', // Send only a teaser of the instructions
        message: 'Subscribe to premium to see the full recipe!',
      };

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: partialRecipe,
      });
    }
  } else {
    // Free recipe, return full details
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: recipe,
    });
  }
});

const updateRecipe = catchAsync(async (req: Request, res: Response) => {
  const { recipeId } = req.params;

  // Check if new images are provided
  let imageUrls = req.body.images || [];

  // If images are provided, upload them to ImageBB
  if (imageUrls.length > 0) {
    imageUrls = await Promise.all(
      imageUrls.map(async (imageUrl: string) => {
        // Upload each image to ImageBB and get the hosted URL
        return uploadImageToImageBB(imageUrl);
      }),
    );

    // Update the images field with the uploaded image URLs
    req.body.images = imageUrls;
  }

  // Update the recipe with the new data, including the updated image URLs
  const recipe = await RecipeServices.updateRecipe(recipeId, req.body);

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

const getRecipes = catchAsync(async (req: Request, res: Response) => {
  const filters = {}; // Add any filtering logic here
  const options = {
    search: req.query.search,
    sort: req.query.sort,
    page: parseInt(req.query.page as string, 10) || 1,
    limit: parseInt(req.query.limit as string, 10) || 10,
  };

  const recipes = await RecipeServices.getRecipes(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: recipes,
  });
});

const deleteRecipe = catchAsync(async (req: Request, res: Response) => {
  const { recipeId } = req.params;

  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const user = req.user;

  // Find the recipe to verify ownership
  const recipe = await RecipeServices.getRecipeById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  // Check if recipe.user is populated and has an _id
  if (!recipe.user || !('id' in recipe.user || '_id' in recipe.user)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid recipe owner');
  }

  const recipeOwnerId =
    recipe.user instanceof Types.ObjectId
      ? recipe.user.toString()
      : recipe.user._id?.toString();

  // Check if the user is the owner of the recipe or an admin
  const isOwner = recipeOwnerId === user.id.toString();
  const isAdmin = user.role === USER_ROLE.admin;

  if (!isOwner && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Unauthorized to delete this recipe',
    );
  }

  // Proceed with deletion if authorized
  const deletedRecipe = await RecipeServices.deleteRecipe(recipeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe deleted successfully',
    data: {
      recipe: deletedRecipe,
    },
  });
});

//publish unpublished
const publishRecipe: RequestHandler = catchAsync(async (req, res) => {
  const { recipeId } = req.params;

  // Ensure user is an admin
  if (!req.user || req.user.role !== USER_ROLE.admin) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  // Find the recipe
  const recipe = await RecipeServices.getRecipeById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  // Toggle the published status
  recipe.published = !recipe.published;
  await recipe.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Recipe ${recipe.published ? 'published' : 'unpublished'} successfully`,
    data: recipe,
  });
});

//rateRecipe
const rateRecipe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const { recipeId } = req.params;
  const { rating } = req.body;

  // Validate that the rating is provided and is between 1 and 5
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Rating must be a number between 1 and 5',
    );
  }

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  const userId = Types.ObjectId.isValid(req.user.id)
    ? new Types.ObjectId(req.user.id)
    : req.user.id;

  const existingRating = recipe.ratings.find(
    (r: any) => r.user.toString() === userId.toString(),
  );

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    recipe.ratings.push({ user: userId, rating });
  }

  // Calculate the average rating only if there are valid ratings
  const totalRating = recipe.ratings.reduce(
    (sum: number, r: any) => sum + r.rating,
    0,
  );
  recipe.averageRating = recipe.ratings.length
    ? totalRating / recipe.ratings.length
    : 0;

  await recipe.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe rated successfully',
    data: recipe,
  });
});

//commentOnRecipe
// const commentOnRecipe = catchAsync(async (req: Request, res: Response) => {
//   if (!req.user) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
//   }

//   const { recipeId } = req.params;
//   const { comment } = req.body;

//   const recipe = await Recipe.findById(recipeId);
//   if (!recipe) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
//   }

//   const userId = Types.ObjectId.isValid(req.user.id)
//     ? new Types.ObjectId(req.user.id)
//     : req.user.id;

//   recipe.comments.push({
//     user: userId,
//     comment,
//     createdAt: new Date(),
//   });

//   await recipe.save();

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Comment added successfully',
//     data: recipe,
//   });
// });

const commentOnRecipe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const { recipeId } = req.params;
  const { comment } = req.body;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  const userId = Types.ObjectId.isValid(req.user.id)
    ? new Types.ObjectId(req.user.id)
    : req.user.id;

  const newComment = {
    user: userId,
    comment,
    createdAt: new Date(),
  };

  recipe.comments.push(newComment);
  await recipe.save();

  // Access the Socket.IO instance
  const io = req.app.get('io'); // Retrieve io from the app

  // Broadcast the new comment to all connected clients
  io.emit(`recipe-${recipeId}`, newComment);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment added successfully',
    data: recipe,
  });
});




// const updateComment = catchAsync(async (req: Request, res: Response) => {
//   const { recipeId, commentId } = req.params;
//   const { comment } = req.body;

//   const recipe = await Recipe.findById(recipeId);
//   if (!recipe) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
//   }

//   const commentToUpdate = recipe.comments.find(
//     (c: any) =>
//       c._id.toString() === commentId && c.user.toString() === req.user.id,
//   );

//   if (!commentToUpdate) {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'Not authorized to update this comment',
//     );
//   }

//   commentToUpdate.comment = comment;
//   commentToUpdate.updatedAt = new Date();

//   await recipe.save();

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Comment updated successfully',
//     data: recipe,
//   });
// });



// const deleteComment = catchAsync(async (req: Request, res: Response) => {
//   const { recipeId, commentId } = req.params;

//   // Check if user is authenticated
//   if (!req.user) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
//   }

//   const recipe = await Recipe.findById(recipeId);
//   if (!recipe) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
//   }

//   // Find the comment to delete
//   const comment = recipe.comments.find(
//     (comment: any) => comment._id.toString() === commentId,
//   );

//   if (!comment) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
//   }

//   // Check if the user is the owner of the comment or an admin
//   const isOwner = comment.user.toString() === req.user.id;
//   const isAdmin = req.user.role === USER_ROLE.admin;

//   if (!isOwner && !isAdmin) {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'You are not authorized to delete this comment',
//     );
//   }

//   // Delete the comment
//   recipe.comments = recipe.comments.filter(
//     (comment: any) => comment._id.toString() !== commentId,
//   );

//   await recipe.save();

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Comment deleted successfully',
//     data: recipe,
//   });
// });
const updateComment = catchAsync(async (req: Request, res: Response) => {
  const { recipeId, commentId } = req.params;
  const { comment } = req.body;

  // Check if user is authenticated
  if (!req.user) {
    console.error('User not authenticated');
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  try {
    // Find the recipe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      console.error('Recipe not found');
      throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
    }

    // Find the comment to update and check authorization
    const commentToUpdate = recipe.comments.find(
      (c: any) => c._id.toString() === commentId && c.user.toString() === req.user.id
    );

    if (!commentToUpdate) {
      console.error('Not authorized to update this comment');
      throw new AppError(httpStatus.FORBIDDEN, 'Not authorized to update this comment');
    }

    // Update the comment
    commentToUpdate.comment = comment;
    commentToUpdate.updatedAt = new Date();

    console.log('Updating comment in the database...');
    
    // Save the recipe
    await recipe.save();

    console.log('Comment updated successfully in the database.');

    // Temporarily disable socket emission to see if that's causing the issue
    // req.app.get('socketService').emit('commentUpdated', {
    //   recipeId,
    //   commentId,
    //   comment: commentToUpdate,
    // });

    // Send a success response
    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: recipe,
    });

  } catch (error) {
    console.error('Error during comment update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message || 'Internal Server Error',
    });
  }
});



const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { recipeId, commentId } = req.params;

  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  const comment = recipe.comments.find(
    (comment: any) => comment._id.toString() === commentId,
  );

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.user.toString() !== req.user.id && req.user.role !== USER_ROLE.admin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this comment',
    );
  }

  recipe.comments = recipe.comments.filter(
    (comment: any) => comment._id.toString() !== commentId,
  );

  await recipe.save();

  // Emit an event to all connected clients
  req.app.get('socketService').emit('commentDeleted', {
    recipeId,
    commentId
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: recipe,
  });
});





//upvote
const upvoteRecipe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  const userId = Types.ObjectId.isValid(req.user.id)
    ? new Types.ObjectId(req.user.id)
    : req.user.id;

  // Remove the user from downvotes if they have downvoted
  recipe.downvotes = recipe.downvotes.filter(
    (downvote) => !downvote.equals(userId),
  );

  // Check if the user already upvoted
  const hasUpvoted = recipe.upvotes.some((upvote) => upvote.equals(userId));
  if (!hasUpvoted) {
    recipe.upvotes.push(userId);
  }

  await recipe.save();

  // Add total counts for upvotes and downvotes in the response
  const upvoteCount = recipe.upvotes.length;
  const downvoteCount = recipe.downvotes.length;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe upvoted successfully',
    data: {
      ...recipe.toObject(),
      votes: {
        upvoteCount,
        downvoteCount,
      },
    },
  });
});

const downvoteRecipe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }

  const userId = Types.ObjectId.isValid(req.user.id)
    ? new Types.ObjectId(req.user.id)
    : req.user.id;

  const hasUpvoted = recipe.upvotes.some((upvote) => upvote.equals(userId));
  if (hasUpvoted) {
    // Remove the upvote first
    recipe.upvotes.pull(userId);
  }

  const hasDownvoted = recipe.downvotes.some((downvote) =>
    downvote.equals(userId),
  );
  if (!hasDownvoted) {
    // Add the downvote
    recipe.downvotes.push(userId);
  }

  await recipe.save();

  // Add total counts for upvotes and downvotes in the response
  const upvoteCount = recipe.upvotes.length;
  const downvoteCount = recipe.downvotes.length;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipe downvoted successfully',
    data: {
      ...recipe.toObject(),
      votes: {
        upvoteCount,
        downvoteCount,
      },
    },
  });
});

export const RecipeControllers = {
  createRecipe,
  getRecipeById,
  updateRecipe,
  getRecipes,
  deleteRecipe,
  publishRecipe,
  rateRecipe,
  commentOnRecipe,
  updateComment,
  upvoteRecipe,
  downvoteRecipe,
  deleteComment,
  getMyRecipes,
  publicGetRecipeById,
};
