import { z } from 'zod';


const userValidationSchema = z.object({
    body: z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      role: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      profilePicture: z.string().optional(),
    }),
  });
  

export const UserValidation = {
  userValidationSchema,
};




  