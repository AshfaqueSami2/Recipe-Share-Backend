import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../../middlewares/auth';

const router = express.Router();

// User Registration Route
router.post(
  '/api/auth/register',
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.createUser,
);

//get user profile
router.get('/api/user/:userId', UserControllers.getUserProfile);

//user update their profile
router.put('/api/user/:userId', UserControllers.updateUserProfile);


//follow unfollow 
router.post('/api/:userId/follow', UserControllers.followUser);
router.post('/api/:userId/unfollow', UserControllers.unfollowUser);

export const UserRoutes = router;