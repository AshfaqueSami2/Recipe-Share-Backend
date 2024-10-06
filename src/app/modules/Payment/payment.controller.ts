import axios from 'axios';
import { User } from '../User/user.model';
import config from '../../config';

const PaymentController = {
  // Initiating payment
  initiatePayment: async (req, res) => {
    try {
      const paymentData = {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        amount: req.body.amount,
        // additional fields if needed
      };

      const response = await axios.post(config.payment_url, paymentData, {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success') {
        res.status(200).json({ paymentUrl: response.data.paymentUrl });
      } else {
        console.log('Payment initiation failed:', response.data);
        res.status(400).json({ message: 'Payment initiation failed' });
      }
    } catch (error) {
      console.error(
        'Error initiating payment:',
        error.response ? error.response.data : error.message,
      );
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  handlePaymentCallback: async (req: any, res: any) => {
    try {
      const { transaction_id, status, user_id } = req.body; // Assuming you get these details from AmarPay
      console.log(user_id);
      if (status === 'Success') {
        const user = await User.findById(user_id);
        console.log(user_id);
        if (user) {
          user.isPremium = true; // Update user status to premium
          await user.save();
          return res
            .status(200)
            .json({ message: 'Payment successful, user upgraded to premium' });
        } else {
          return res.status(404).json({ message: 'User not found' });
        }
      } else {
        return res.status(400).json({ message: 'Payment failed' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

export default PaymentController;
