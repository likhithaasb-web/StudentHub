import mongoose from 'mongoose';

const attendanceSubjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#520402',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user cannot have duplicate subject names
attendanceSubjectSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('AttendanceSubject', attendanceSubjectSchema);
