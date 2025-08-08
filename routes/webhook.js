import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;

  const digest = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(body))
    .digest('hex');

  if (signature !== digest) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  // Check for subscription activation event
  if (body.event === 'subscription.activated') {
    const subscriptionId = body.payload.subscription.entity.id;

    // Find the user with this subscriptionId and update isPremium
    await User.findOneAndUpdate(
      { subscriptionId },
      { isPremium: true }
    );
  }

  res.status(200).json({ message: 'Webhook received' });
});

export default router;
