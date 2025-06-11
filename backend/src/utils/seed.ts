import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { sampleUsers } from '../SAMPLE_DATA';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

const run = async () => {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
  await User.insertMany(sampleUsers);
  console.log('✅ Sample users inserted');
  process.exit(0);
};

run();
