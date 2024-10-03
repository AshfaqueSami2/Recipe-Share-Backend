import axios from 'axios';
import config from '../../config';
import { User } from '../User/user.model';



const createPayment = async (user, amount) => {
    const paymentData = {
      store_id: config.amarpay_store_id,
      signature_key: config.amarpay_signature_key,
      amount,
      currency: 'BDT',
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: user.phone,
      tran_id: `${Date.now()}`,
      success_url: `${config.base_url}/api/payment/success`,
      fail_url: `${config.base_url}/api/payment/fail`,
      cancel_url: `${config.base_url}/api/payment/cancel`,
    };
    console.log('Store ID:', config.amarpay_store_id);

    try {
      const response = await axios.post(config.amarpay_payment_url, paymentData);
  
      // Log the response from AmarPay to check if it contains the payment URL
      console.log('AmarPay Response:', response.data);
  
      return response.data.payment_url;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw new Error('Payment initiation failed');
    }
  };

const handlePaymentSuccess = async (transactionId: any) => {
  const user = await User.findOne({ transactionId });
  if (!user) {
    throw new Error('User not found');
  }
  user.isPremium = true;
  await user.save();
};

const handlePaymentFailure = async (transactionId: any) => {
  // Handle the payment failure logic, like logging the failure
};

const handlePaymentCancel = async (transactionId: any) => {
  // Handle the payment cancellation logic, like logging the cancellation
};

export default {
  createPayment,
  handlePaymentSuccess,
  handlePaymentFailure,
  handlePaymentCancel,
};
