import express from 'express';
import { blockUser, unblockUser, deleteUser } from './admin.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../../middlewares/auth';


const router = express.Router();

// Routes to block, unblock, and delete users
router.patch('/block/:userId', auth(USER_ROLE.admin), blockUser);
router.patch('/unblock/:userId', auth(USER_ROLE.admin), unblockUser);
router.delete('/delete/:userId', auth(USER_ROLE.admin), deleteUser);

export const AdminRouter =  router;
