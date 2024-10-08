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
    .populate('followers', 'name') // Optionally populate follower details
    .populate('following', 'name');
  if (!user) {
    throw new Error('User not found');
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    phone: user.phone,
    address: user.address,
    bio: user.bio,
    followersCount: user.followers.length,
    followingCount: user.following.length,
    followers: user.followers, // Optionally include detailed follower info
    following: user.following, // Optionally include detailed following info
  };
};

//update user profile

const updateUserProfile = async (
  userId: string,
  updateData: { name?: string; profilePicture?: string; bio?: string },
) => {
  // Find the user by userId and update their profile information
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }, // Return the updated document and run validations
  );

  return updatedUser;
 };


// // Follow a user
// const followUser = async (currentUserId: string, targetUserId: string) => {
//   const currentUser = await User.findById(currentUserId);
//   const targetUser = await User.findById(targetUserId);

//   if (!currentUser || !targetUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // Check if the user is already following the target user
//   if (currentUser.following.includes(targetUserId)) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'You are already following this user');
//   }


//   if (currentUserId === targetUserId) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow/unfollow yourself');
//   }

//   // Add the target user to the current user's following list
//   currentUser.following.push(targetUserId);
//   await currentUser.save();

//   // Add the current user to the target user's followers list
//   targetUser.followers.push(currentUserId);
//   await targetUser.save();

//   return {
//     currentUser: {
//       _id: currentUser._id,
//       name: currentUser.name,
//       followersCount: currentUser.followers.length,
//       followingCount: currentUser.following.length,
//     },
//     targetUser: {
//       _id: targetUser._id,
//       name: targetUser.name,
//       followersCount: targetUser.followers.length,
//       followingCount: targetUser.following.length,
//     },
//   };
// };

// // Unfollow a user
// const unfollowUser = async (currentUserId: string, targetUserId: string) => {
//   const currentUser = await User.findById(currentUserId);
//   const targetUser = await User.findById(targetUserId);

//   if (!currentUser || !targetUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // Check if the user is following the target user before trying to unfollow
//   if (!currentUser.following.includes(targetUserId)) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'You are not following this user');
//   }

//   if (currentUserId === targetUserId) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow/unfollow yourself');
//   }

//   // Remove the target user from the current user's following list
//   currentUser.following = currentUser.following.filter(
//     (id) => id.toString() !== targetUserId,
//   );
//   await currentUser.save();

//   // Remove the current user from the target user's followers list
//   targetUser.followers = targetUser.followers.filter(
//     (id) => id.toString() !== currentUserId,
//   );
//   await targetUser.save();

//   return {
//     currentUser: {
//       _id: currentUser._id,
//       name: currentUser.name,
//       followersCount: currentUser.followers.length,
//       followingCount: currentUser.following.length,
//     },
//     targetUser: {
//       _id: targetUser._id,
//       name: targetUser.name,
//       followersCount: targetUser.followers.length,
//       followingCount: targetUser.following.length,
//     },
//   };
// };






// Follow a user
const followUser = async (currentUserId: string, targetUserId: string) => {
  // Prevent user from following themselves
  if (currentUserId === targetUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself');
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is already following the target user
  if (currentUser.following.includes(targetUserId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are already following this user');
  }

  // Add the target user to the current user's following list
  currentUser.following.push(targetUserId);

  // Add the current user to the target user's followers list
  targetUser.followers.push(currentUserId);

  // Save both users concurrently using Promise.all
  await Promise.all([currentUser.save(), targetUser.save()]);

  return {
    currentUser: {
      _id: currentUser._id,
      name: currentUser.name,
      followersCount: currentUser.followers.length,
      followingCount: currentUser.following.length,
    },
    targetUser: {
      _id: targetUser._id,
      name: targetUser.name,
      followersCount: targetUser.followers.length,
      followingCount: targetUser.following.length,
    },
  };
};

// Unfollow a user
const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  // Prevent user from unfollowing themselves
  if (currentUserId === targetUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot unfollow yourself');
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is following the target user before trying to unfollow
  if (!currentUser.following.includes(targetUserId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are not following this user');
  }

  // Remove the target user from the current user's following list
  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId
  );

  // Remove the current user from the target user's followers list
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId
  );

  // Save both users concurrently using Promise.all
  await Promise.all([currentUser.save(), targetUser.save()]);

  return {
    currentUser: {
      _id: currentUser._id,
      name: currentUser.name,
      followersCount: currentUser.followers.length,
      followingCount: currentUser.following.length,
    },
    targetUser: {
      _id: targetUser._id,
      name: targetUser.name,
      followersCount: targetUser.followers.length,
      followingCount: targetUser.following.length,
    },
  };
};








export const UserServices = {
  createUserIntoDB,
  findUserById,
  updateUserProfile,
  followUser,
  unfollowUser,
}
