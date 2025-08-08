const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const subscriptionRoutes = require('./routes/subscription');
// Add any other routes you may have
// const adminRoutes = require('./routes/admin'); // example

const app = express();
import webhookRoutes from './routes/webhook.js';

// Must use raw parser before general JSON middleware
app.use('/api/webhook', webhookRoutes);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/subscription', subscriptionRoutes);
// app.use('/api/admin', adminRoutes); // Add this only if you have such file

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
