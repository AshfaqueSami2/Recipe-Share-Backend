import { Request, RequestHandler, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { UserServices } from './user.service';
import AppError from '../../errors/AppError';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const userData = req.body;

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

  // Call the service to update the user data
  const updatedUser = await UserServices.updateUserProfile(userId, {
    name,
    profilePicture,
    bio,
  });

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
