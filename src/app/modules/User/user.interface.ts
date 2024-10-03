import { Model } from 'mongoose';

export interface TUser {
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  save(): unknown;
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'user';
  isPremium:boolean;
  profilePicture?: string;
  address?: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  bio?:string;
  blocked:boolean;
  followers: string[];  // Array of user IDs who follow this user
  following: string[];
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
