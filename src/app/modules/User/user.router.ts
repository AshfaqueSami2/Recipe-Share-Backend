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


// Fetch User Profile Route
router.get(
    '/api/user/profile',
    auth(),  
    UserControllers.getUserProfile,
  );
export const UserRoutes = router;