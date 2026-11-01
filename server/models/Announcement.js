import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Examination', 'Administrative', 'Placement', 'Event', 'Urgent'],
      default: 'Academic',
    },
    targetAudience: {
      type: String,
      enum: ['All Students', 'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Faculty Only'],
      default: 'All Students',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    publishedBy: {
      type: String,
      default: 'Academic Dean Office',
    },
    publisherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    attachmentName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Announcement', announcementSchema);
