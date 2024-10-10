import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from './user.constant';

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
router.put('/api/userU/:userId', UserControllers.getUserProfileU);


//follow unfollow 
router.post('/api/:userId/follow',auth(USER_ROLE.user), UserControllers.followUser);
router.post('/api/:userId/unfollow',auth(USER_ROLE.user), UserControllers.unfollowUser);

export const UserRoutes = router;