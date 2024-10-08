import {  } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;  
        name: string; 
        role: string;
        isPremium:boolean;
        profilePicture:string;
      };
    }
  }
}
