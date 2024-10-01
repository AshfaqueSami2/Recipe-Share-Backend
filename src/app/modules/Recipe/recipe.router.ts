import { Router } from 'express';
import { RecipeControllers } from './recipe.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

// Recipe routes
router.post('/api/recipes', auth(), RecipeControllers.createRecipe);
router.get('/api/recipes', RecipeControllers.getRecipes);
router.get('/api/recipes/:recipeId',auth(), RecipeControllers.getRecipeById);
router.put('/api/recipes/:recipeId', RecipeControllers.updateRecipe);
router.delete(
  '/api/recipes/:recipeId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  RecipeControllers.deleteRecipe,
);
router.patch(
  '/api/recipes/:recipeId/publish-unpublish',
  auth(USER_ROLE.admin),
  RecipeControllers.publishRecipe,
);

router.post(
  '/api/recipes/:recipeId/rate',
  auth(USER_ROLE.user),
  RecipeControllers.rateRecipe,
);

// Commenting Routes
router.post(
  '/api/recipes/:recipeId/comment',
  auth(USER_ROLE.user),
  RecipeControllers.commentOnRecipe,
);
router.put(
  '/api/recipes/:recipeId/comment/:commentId',
  auth(USER_ROLE.user),
  RecipeControllers.updateComment,
);
router.delete(
  '/api/recipes/:recipeId/comment/:commentId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  RecipeControllers.deleteComment,
);

// Voting Routes
router.post(
  '/api/recipes/:recipeId/upvote',
  auth(USER_ROLE.user),
  RecipeControllers.upvoteRecipe,
);
router.post(
  '/api/recipes/:recipeId/downvote',
  auth(USER_ROLE.user),
  RecipeControllers.downvoteRecipe,
);

export const RecipeRoutes = router;
