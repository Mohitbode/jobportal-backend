
import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'secret123');
    req.user = await User.findById(decoded.userId);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req, res) => {
  const isPremium = req.user.isPremium;
  const jobs = await Job.find(isPremium ? {} : { type: 'free' });
  res.json(jobs);
});

export default router;
