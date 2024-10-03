import { Request, Response } from 'express';

import httpStatus from 'http-status';
import paymentService from './payment.service';
import catchAsync from '../../utils/catchAsync';


export const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const user = req.user; // Assuming req.user is populated by the auth middleware

  if (user.isPremium) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'User is already premium',
    });
  }

  const paymentUrl = await paymentService.createPayment(user, amount);
  return res.status(httpStatus.OK).json({
    success: true,
    payment_url: paymentUrl,
  });
});


export const paymentSuccess = catchAsync(
  async (req: Request, res: Response) => {
    const { tran_id } = req.body;

    await paymentService.handlePaymentSuccess(tran_id);

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Payment successful! You are now a premium user.',
    });
  },
);

export const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.body;

  await paymentService.handlePaymentFailure(tran_id);

  return res.status(httpStatus.OK).json({
    success: false,
    message: 'Payment failed. Please try again.',
  });
});

export const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.body;

  await paymentService.handlePaymentCancel(tran_id);

  return res.status(httpStatus.OK).json({
    success: false,
    message: 'Payment was canceled.',
  });
});
