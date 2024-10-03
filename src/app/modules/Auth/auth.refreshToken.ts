import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import config from '../../config';
import { User } from '../User/user.model';


export const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Refresh token missing' });
  }

  jwt.verify(refreshToken, config.jwt_refresh_secret, async (err, decoded) => {
    if (err) return res.status(httpStatus.FORBIDDEN).json({ message: 'Invalid refresh token' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });

    // Issue a new access token with updated isPremium status
    const newAccessToken = jwt.sign(
      { id: user._id, isPremium: user.isPremium, role: user.role },
      config.jwt_access_secret,
      { expiresIn: config.jwt_access_expires_in }
    );

    res.json({ success: true, accessToken: newAccessToken });
  });
});
