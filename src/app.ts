import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import session from 'express-session';
import globalErrorHandler from './middlewares/globalErrorHandler';
import { UserRoutes } from './app/modules/User/user.router';
import { AuthRoutes } from './app/modules/Auth/auth.route';
import { RecipeRoutes } from './app/modules/Recipe/recipe.router';

import { AdminRouter } from './app/modules/Admin/admin.routes';

const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

//application routes

app.use('/', UserRoutes);
app.use('/', AuthRoutes);
app.use('/', RecipeRoutes);

app.use('/', AdminRouter);

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(globalErrorHandler);

const getAController = (req: Request, res: Response) => {
  res.send('Hello World');
};

app.get('/', getAController);

export default app;
