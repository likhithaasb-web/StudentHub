import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      default: '',
      trim: true,
    },
    targetAttendance: {
      type: Number,
      default: 75,
      min: 1,
      max: 100,
    },
    dailyStudyGoalMinutes: {
      type: Number,
      default: 120,
    },
    theme: {
      type: String,
      default: 'dark',
      enum: ['dark', 'light'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
