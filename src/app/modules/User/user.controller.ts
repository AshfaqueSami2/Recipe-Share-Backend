import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { UserServices } from './user.service';

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

const getUserProfile: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.id; // Extracted from the auth middleware

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'User not found',
      data: undefined,
    });
  }

  const user = await UserServices.findUserById(userId);
  if (!user) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found',
      data: undefined,
    });
  }

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    profilePicture: user.profilePicture,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: userData,
  });
});

export const UserControllers = {
  createUser,
  getUserProfile,
};
