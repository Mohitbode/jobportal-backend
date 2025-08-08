
import express from 'express';
import Razorpay from 'razorpay';
import User from '../models/User.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post('/create-subscription', async (req, res) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.PLAN_ID,
      customer_notify: 1,
      total_count: 12,
    });
    res.json(subscription);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create subscription', error: err.message });
  }
});

export default router;
