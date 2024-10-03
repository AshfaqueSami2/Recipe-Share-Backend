import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { Request, Response } from 'express';
import AppError from '../../errors/AppError';
import crypto from 'crypto';
import { User } from '../User/user.model';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await AuthServices.loginUser(
    req.body,
  );

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    isPremium:user.isPremium
  };

  // Set refresh token in cookies (HTTP-only, Secure for production)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully',
    token: accessToken,
    data: userData,
  });
});

//change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  const result = await AuthServices.changePassword(
    userId,
    oldPassword,
    newPassword,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: {
      passwordChangedAt: result.passwordChangedAt,
    },
  });
});

// Reset password
const requestPasswordReset = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthServices.requestPasswordReset(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: {},
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Hash the received token to compare with the stored hashed token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find the user by the hashed token and ensure the token hasn't expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }, // Token must still be valid
  });

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Token is invalid or has expired',
    );
  }

  // Update the user's password and clear the reset token fields
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date(); // Optional: Track when the password was changed
  await user.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful',
    data: {},
  });
});




const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies; // Or get it from the request body/header if using a different storage method
  
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token is missing');
  }

  const result = await AuthServices.refreshAccessToken(refreshToken);

  // Send new access token back to the client
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token refreshed successfully',
    token: result.accessToken,
    data:{

    }
  });
});







export const AuthControllers = {
  loginUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
  refreshAccessToken
};
