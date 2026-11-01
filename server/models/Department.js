import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  credits: { type: Number, default: 4 },
  semester: { type: String, default: 'Semester 6' },
  facultyName: { type: String, default: '' },
  facultyEmail: { type: String, default: '' },
  type: { type: String, enum: ['Theory', 'Lab', 'Practical', 'Project'], default: 'Theory' },
});

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    headOfDepartment: {
      type: String,
      default: '',
    },
    totalBatches: {
      type: Number,
      default: 4,
    },
    subjects: [subjectSchema],
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Department', departmentSchema);
