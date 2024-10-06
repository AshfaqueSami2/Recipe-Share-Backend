import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import {  TLoginUser } from './auth.interface';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../../utils/sendEmail';
import catchAsync from '../../utils/catchAsync';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload?.email);

  //chekcing email is exist on databases
  if (!user) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'This user is not found');
  }


  if (user.blocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been blocked by the administrator');
  }
  //checking password

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');
  }

  const jwtPayload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio:user.bio,
    isPremium: user.isPremium,
    needsPasswordChange: user.needsPasswordChange, // Corrected typo
    profilePicture: user.profilePicture,
    followers: user.followers,
    following: user.following,
    phone: user.phone,
    address: user.address,
  };

  console.log(jwtPayload.name)

  // create toke and sent to the client
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '30d',
  });
  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: '30d',
    },
  );

  const result = {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio:user.bio,
      isPremium: user.isPremium,
      needsPasswordChange: user.needsPasswordChange, // Corrected typo
      profilePicture: user.profilePicture,
      followers: user.followers,
      following: user.following,
      phone: user.phone,
      address: user.address,
    },
    accessToken,
    refreshToken,
  };

  return result;
};

//change password
const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatched = await User.isPasswordMatched(oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  // Update the password and set the passwordChangedAt field
  user.password = newPassword;
  user.passwordChangedAt = new Date(); // Set the current timestamp
  user.needsPasswordChange = false; // Optional: to reset if necessary
  await user.save();

  return {
    message: 'Password updated successfully',
    passwordChangedAt: user.passwordChangedAt,
  };
};


//recover/forgot password
const requestPasswordReset = async (email: string) => {
  const user = await User.isUserExistsByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User with this email does not exist');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHashed = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set reset token and expiration (e.g., 10 minutes)
  user.passwordResetToken = resetTokenHashed;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  // Send plain token in email
  const resetURL = `${config.frontend_url}/reset-password/${resetToken}`;
  const message = `Forgot your password? Click on the link below to reset your password: \n\n${resetURL}\n\nIf you didn't request this, please ignore this email.`;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset',
    message,
  });

  return { message: 'Password reset link sent to your email' };
};



const refreshAccessToken = async (refreshToken: string) => {
  // Verify the refresh token
  const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret) as JwtPayload;

  // Find the user based on the decoded token
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Generate a new access token with updated isPremium status
  const newAccessToken = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio:user.bio,
      isPremium: user.isPremium,
      needsPasswordChange: user.needsPasswordChange, // Corrected typo
      profilePicture: user.profilePicture,
      followers: user.followers,
      following: user.following,
      phone: user.phone,
      address: user.address,
    },
    config.jwt_access_secret as string,
    { expiresIn: '30d' } // Adjust expiry time based on your requirement
  );

  return { accessToken: newAccessToken };
};








export const AuthServices = {
  loginUser,
  changePassword,
  requestPasswordReset,
  refreshAccessToken
};
