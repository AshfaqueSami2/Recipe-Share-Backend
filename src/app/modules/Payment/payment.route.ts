import express from 'express';
import PaymentController from './payment.controller'; // Adjust the path based on your structure

const router = express.Router();

router.post('/initiate-payment', PaymentController.initiatePayment);
router.post('/payment-callback', PaymentController.handlePaymentCallback);

export const PaymentRouter =  router;
