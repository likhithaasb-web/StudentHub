import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    classroom: {
      type: String,
      default: '',
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#DFD6AE',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Timetable', timetableSchema);
