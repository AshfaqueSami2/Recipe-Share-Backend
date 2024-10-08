import express from 'express';
import { blockUser, unblockUser, deleteUser, getAllUsers } from './admin.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../../middlewares/auth';
import { getAllRecipes, updateRecipe, deleteRecipe } from './admin.controller';


const router = express.Router();

// Routes to block, unblock, and delete users
router.patch('/block/:userId', auth(USER_ROLE.admin), blockUser);
router.patch('/unblock/:userId', auth(USER_ROLE.admin), unblockUser);
router.delete('/delete/:userId', auth(USER_ROLE.admin), deleteUser);
router.get('/users', auth(USER_ROLE.admin), getAllUsers)


// Recipe management routes (Admin only)
router.get('/recipes', auth(USER_ROLE.admin), getAllRecipes); // Get all recipes
router.patch('/recipe/:recipeId', auth(USER_ROLE.admin), updateRecipe); // Update a recipe
router.delete('/recipe/:recipeId', auth(USER_ROLE.admin), deleteRecipe); 


export const AdminRouter =  router;
