import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    shareId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Untitled Resume',
    },
    targetRole: {
      type: String,
      default: '',
    },
    template: {
      type: String,
      enum: ['professional', 'modern', 'minimal'],
      default: 'professional',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    personal: {
      fullName: { type: String, default: '' },
      headline: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    education: {
      type: Array,
      default: [],
    },
    skills: {
      type: Array,
      default: [],
    },
    projects: {
      type: Array,
      default: [],
    },
    experience: {
      type: Array,
      default: [],
    },
    certifications: {
      type: Array,
      default: [],
    },
    optionalSections: {
      type: Object,
      default: {
        coursework: true,
        languages: true,
        awards: true,
        extracurricular: false,
        publications: false,
        volunteer: false,
      },
    },
    languages: {
      type: Array,
      default: [],
    },
    awards: {
      type: Array,
      default: [],
    },
    sectionOrder: {
      type: [String],
      default: [
        'personal',
        'summary',
        'education',
        'skills',
        'experience',
        'projects',
        'certifications',
        'awards',
        'languages',
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Resume', resumeSchema);
