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
    role: {
      type: String,
      enum: ['student', 'admin', 'superadmin'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    rollNumber: {
      type: String,
      default: '',
      trim: true,
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true,
    },
    degree: {
      type: String,
      default: 'B.Tech / B.E.',
      trim: true,
    },
    academicYear: {
      type: String,
      default: '3rd Year',
      trim: true,
    },
    semester: {
      type: String,
      default: 'Semester 6',
      trim: true,
    },
    cgpa: {
      type: Number,
      default: 8.75,
      min: 0,
      max: 10,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
