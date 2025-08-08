// backend/routes/jobs.js

import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token and fetch user
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'secret123');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/jobs - get job listings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const isPremium = req.user.isPremium;
    const jobs = await Job.find(isPremium ? {} : { type: 'free' });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Optional: POST /api/jobs - Admin job posting (only if needed)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, company, description, type, applyUrl } = req.body;

    // Only admin users can post (optional)
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only admin can post jobs' });
    }

    const job = new Job({
      title,
      company,
      description,
      type,
      applyUrl,
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error posting job', error: error.message });
  }
});

export default router;
