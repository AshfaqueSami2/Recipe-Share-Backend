import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { User } from '../User/user.model';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

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
