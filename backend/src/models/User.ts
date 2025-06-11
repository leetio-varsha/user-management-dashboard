import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  company: String,
  department: String,
  role: String,
  jobTitle: String,

  experience: {
    yearsInIndustry: Number,
    expertise: [String],
    certifications: [String],
  },

  preferences: {
    language: String,
    timezone: String,
    communicationChannel: String,
  },

  demographics: {
    ageRange: String,
    gender: String,
    education: String,
  },

  workHistory: {
    currentPosition: String,
    previousPositions: [String],
    industrySpecialization: [String],
  },

  status: { type: String, default: 'active' },

  participation: {
    surveysCompleted: { type: Number, default: 0 },
    surveysInvited: { type: Number, default: 0 },
    lastResponseDate: Date,
    responseRate: Number,
    avgResponseTime: Number,
    responseQuality: {
      avgCompletionRate: Number,
      avgResponseLength: Number,
      thoughtfulnessScore: Number,
    },
    engagementHistory: [
      {
        month: String,
        surveysCompleted: Number,
        responseTime: Number,
      },
    ],
    activityMetrics: {
      loginFrequency: Number,
      sessionDuration: Number,
      featuresUsed: [String],
      lastLoginStreak: Number,
    },
    feedbackProvided: {
      platformFeedback: Number,
      surveyFeedback: Number,
      featureRequests: Number,
    },
  },

  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },

  manufacturerId: { type: String, default: null },
  joinedAt: { type: Date, default: new Date() },
  lastActive: { type: Date, default: new Date() },

  metadata: { type: Schema.Types.Mixed, default: {} },
});
export default model('User', UserSchema);
