
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  type: { type: String, enum: ['free', 'premium'], default: 'free' },
  applyUrl: String,
});

export default mongoose.model('Job', jobSchema);
