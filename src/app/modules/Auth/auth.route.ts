import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';


const router = express.Router();

router.post(
  '/api/auth/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.patch(
  '/api/auth/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthControllers.changePassword,
);


router.post(
  '/api/auth/request-password-reset',
  validateRequest(AuthValidation.requestPasswordResetSchema),
  AuthControllers.requestPasswordReset,
);

router.patch(
  '/api/auth/reset-password/:token',
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
