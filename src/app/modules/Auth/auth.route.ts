import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { AuthControllers, updateUserStatus } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { refreshAccessToken } from './auth.refreshToken';


const router = express.Router();


router.post('/api/users/:userId/updateStatus', updateUserStatus);



router.post(
  '/api/auth/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);


router.post('/refresh-token',auth(), refreshAccessToken);


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

router.post(
  '/api/auth/reset-password/:token',
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
