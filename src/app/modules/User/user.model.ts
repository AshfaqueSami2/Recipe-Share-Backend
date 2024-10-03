/* eslint-disable no-unused-vars */
import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
import { USER_ROLE } from './user.constant';

// User Schema Definition
const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.user,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    isPremium: { type: Boolean, default: false },
    blocked: {
      type: Boolean,
      default: false,  // Users are not blocked by default
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users following this user
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users this user is following
    passwordResetToken: {
      type: String,
      default: undefined,
    },
    passwordResetExpires: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Password Hashing Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// Custom Static Method: Check if User Exists by Email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email });
};

// Custom Static Method: Check if Passwords Match
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

// Create User Model
export const User = model<TUser, UserModel>('User', userSchema);
