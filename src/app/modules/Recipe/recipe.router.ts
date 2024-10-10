import { Router } from 'express';
import { RecipeControllers } from './recipe.controller';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { Recipe } from './recipe.model';

const router = Router();

//public recipe with id
router.get('/public/recipes/:recipeId', RecipeControllers.publicGetRecipeById);

// Recipe routes
router.post('/api/recipes', auth(USER_ROLE.user,USER_ROLE.admin), RecipeControllers.createRecipe);
router.get('/api/recipes/myrecipes/:recipeId', auth(), RecipeControllers.getUserSingleRecipe);
router.put('/api/recipies/myrecipe/:recipeId',auth(), RecipeControllers.editUserSingleRecipe);
router.get('/api/recipes/myrecipes', auth(USER_ROLE.user,USER_ROLE.admin), RecipeControllers.getRecipesByUser);
router.get('/api/recipes', RecipeControllers.getRecipes);
router.get('/api/recipes/:recipeId',auth(), RecipeControllers.getRecipeById);
router.put('/api/recipes/:recipeId',auth(USER_ROLE.admin), RecipeControllers.updateRecipe);
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
  auth(USER_ROLE.user),
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


router.patch('/recipes/:id/togglePublish', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Toggle the published state
    recipe.published = !recipe.published;
    await recipe.save();

    const status = recipe.published ? 'published' : 'unpublished';
    res.status(200).json({ message: `Recipe ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export const RecipeRoutes = router;
