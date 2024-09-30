import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    role: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profilePicture: z.string().optional(),
    bio: z.string().optional(),
  }),
});

//update user profile validation
const updateUserProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    profilePicture: z.string().optional(),
    bio: z.string().optional(),
  }),
});


//follow unfollow

const followUserSchema = z.object({
  body: z.object({
    targetUserId: z.string(),
  }),
});

const unfollowUserSchema = z.object({
  body: z.object({
    targetUserId: z.string(),
  }),
});

export const UserValidation = {
  userValidationSchema,
  updateUserProfileSchema,
  followUserSchema,
  unfollowUserSchema,
};
