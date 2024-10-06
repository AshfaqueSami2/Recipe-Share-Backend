import { NextFunction, Request, RequestHandler, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { UserServices } from './user.service';
import AppError from '../../errors/AppError';
import { uploadImageToImageBB } from '../Recipe/recipe.utils';
import { User } from './user.model';


const createUser: RequestHandler = catchAsync(async (req, res) => {
  const userData = req.body;

  // Check if profilePicture is present and upload it to ImageBB
  if (userData.profilePicture) {
    const uploadedImageUrl = await uploadImageToImageBB(userData.profilePicture);
    userData.profilePicture = uploadedImageUrl; // Update profilePicture to the uploaded URL
  }

  // Create the user in the database
  const result = await UserServices.createUserIntoDB(userData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});
//get user/admin profile

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Call the service to get user data
  const user = await UserServices.findUserById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userProfile = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone:user.phone,
    profilePicture: user.profilePicture,
    bio: user.bio,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    followers: user.followers,  // Optionally include detailed follower info
    following: user.following,  // Optionall
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: userProfile,
  });
});

//update user profile
const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, profilePicture, bio } = req.body;

  // If a profile picture is provided, upload it to ImageBB
  let updatedData: { name?: string; profilePicture?: string; bio?: string } = { name, bio };

  if (profilePicture) {
    const uploadedImageUrl = await uploadImageToImageBB(profilePicture);
    updatedData.profilePicture = uploadedImageUrl; // Update with the uploaded image URL
  }

  // Call the service to update the user data
  const updatedUser = await UserServices.updateUserProfile(userId, updatedData);

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: updatedUser,
  });
});


//follow unfollow following
const followUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { targetUserId } = req.body;

  const targetUser = await UserServices.followUser(userId, targetUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `You are now following ${targetUser.name}`,
    data: targetUser,
  });
});

const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { targetUserId } = req.body;

  const targetUser = await UserServices.unfollowUser(userId, targetUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `You have unfollowed ${targetUser.name}`,
    data: targetUser,
  });
});





export const UserControllers = {
  createUser,
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  
};
