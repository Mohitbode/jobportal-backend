// routes/subscription.js

const express = require('express');
const Razorpay = require('razorpay');
const User = require('../models/User');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create subscription route
router.post('/create-subscription', async (req, res) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.PLAN_ID,
      customer_notify: 1,
      total_count: 12,
    });
    res.json(subscription);
  } catch (err) {
    console.error('Subscription creation failed:', err.message);
    res.status(400).json({ message: 'Failed to create subscription', error: err.message });
  }
});

module.exports = router;
