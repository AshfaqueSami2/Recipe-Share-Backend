// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import catchAsync from '../app/utils/catchAsync';
// import config from '../app/config';
// import AppError from '../app/errors/AppError';

// const auth = (...requiredRoles: string[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const authorizationHeader = req.headers.authorization;

//     // Check if the authorization header is present and contains a token
//     if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
//       return next(new AppError(httpStatus.UNAUTHORIZED, 'Authorization token not found'));
//     }

//     const token = authorizationHeader.split(' ')[1]; // Extract the token

//     // Verify JWT token
//     jwt.verify(token, config.jwt_access_secret as string, (err, decoded) => {
//       if (err || !decoded) {
//         return next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
//       }

//       const user = decoded as JwtPayload;

//       // Attach user information to the request object
//       req.user = { id: user.id, name: user.name, role: user.role,isPremium:user.isPremium, };

//       // Check if user has the required role(s)
//       if (requiredRoles.length && !requiredRoles.includes(user.role)) {
//         return next(new AppError(httpStatus.FORBIDDEN, 'You do not have access to this resource'));
//       }

//       console.log('Token received:', user.id);
//       console.log('Decoded user:', user);

//       next();
//     });
//   });
// };

// export default auth;




import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../app/utils/catchAsync';
import config from '../app/config';
import AppError from '../app/errors/AppError';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    // Check if the authorization header is present and contains a token
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return next(new AppError(httpStatus.UNAUTHORIZED, 'Authorization token not found'));
    }

    const token = authorizationHeader.split(' ')[1]; // Extract the token

    // Verify JWT token
    jwt.verify(token, config.jwt_access_secret as string, (err, decoded) => {
      if (err || !decoded) {
        return next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
      }

      const user = decoded as JwtPayload;

      // Attach user information to the request object
      req.user = { 
        id: user.id, 
        name: user.name, 
        role: user.role, 
        profilePicture: user.profilePicture, // Ensure profile picture is included in the JWT payload
        isPremium: user.isPremium, 
      };

      // Check if user has the required role(s)
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        return next(new AppError(httpStatus.FORBIDDEN, 'You do not have access to this resource'));
      }

      console.log('Token received:', user.id);
      console.log('Decoded user:', user);

      next();
    });
  });
};

export default auth;
