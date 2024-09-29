import { TUser } from './user.interface';
import { User } from './user.model';

export const createUserIntoDB = async (userData: TUser) => {
  const newUser = new User(userData);
  const result = await newUser.save();
  return result;
};
const findUserById = async (userId: string): Promise<TUser | null> => {
  return await User.findById(userId);
};

export const UserServices = {
  createUserIntoDB,
  findUserById,
};
