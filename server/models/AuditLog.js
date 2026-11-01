import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    module: {
      type: String,
      enum: ['Students', 'Academics', 'Attendance', 'Assignments', 'Exams', 'Announcements', 'Admins', 'Settings', 'Auth'],
      required: true,
    },
    performedBy: {
      type: String,
      required: true,
      default: 'Administrator',
    },
    performerEmail: {
      type: String,
      default: '',
    },
    performerRole: {
      type: String,
      default: 'admin',
    },
    targetEntity: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Success', 'Warning', 'Failed'],
      default: 'Success',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AuditLog', auditLogSchema);
