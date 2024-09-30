import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

export const createUserIntoDB = async (userData: TUser) => {
  const newUser = new User(userData);
  const result = await newUser.save();
  return result;
};
const findUserById = async (userId: string) => {
  const user = await User.findById(userId)
  .populate('followers', 'name')  // Optionally populate follower details
  .populate('following', 'name');
  if (!user) {
    throw new Error('User not found');
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    followers: user.followers,  // Optionally include detailed follower info
    following: user.following,  // Optionally include detailed following info
  };
};

//update user profile

const updateUserProfile = async (userId: string, updateData: { name?: string; profilePicture?: string; bio?: string }) => {
  // Find the user by userId and update their profile information
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true } // Return the updated document and run validations
  );

  return updatedUser;
};

//follow unfollow following
const followUser = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Prevent self-follow
  if (userId === targetUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You can't follow yourself");
  }

  // Check if the user is already following the target user
  if (!user.following.includes(targetUserId)) {
    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();
  }

  return targetUser;
};

const unfollowUser = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Remove the targetUserId from the following list
  user.following = user.following.filter(id => id.toString() !== targetUserId);
  targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);

  await user.save();
  await targetUser.save();

  return targetUser;
};


export const UserServices = {
  createUserIntoDB,
  findUserById,
  updateUserProfile,
  followUser,
  unfollowUser,
};
