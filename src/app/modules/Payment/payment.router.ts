import express from 'express';
import { initiatePayment, paymentSuccess, paymentFail, paymentCancel } from './payment.controller';
import auth from '../../../middlewares/auth';


const router = express.Router();

router.post('/api/payment/initiate', auth(), initiatePayment);
router.post('/api/payment/success', paymentSuccess);
router.post('/api/payment/fail', paymentFail);
router.post('/api/payment/cancel', paymentCancel);

export const PaymentRouter = router;


