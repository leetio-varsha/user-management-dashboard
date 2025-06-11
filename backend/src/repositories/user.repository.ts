import UserModel from '../models/User';
import { subDays } from 'date-fns';
import { UserFilterOptions, SortOptions } from '../interfaces/filters.interface';

export class UserRepository {
  async findAll(filters: UserFilterOptions = {}, sort: SortOptions = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return UserModel.find(filters).sort(sort).skip(skip).limit(limit).lean();
  }

  async countDocuments(filters: UserFilterOptions = {}) {
    return UserModel.countDocuments(filters);
  }

  async assignManufacturer(userIds: string[], manufacturerId: string) {
    return UserModel.updateMany({ _id: { $in: userIds } }, { $set: { manufacturerId } });
  }

  async aggregateStats() {
    const now = new Date();
    return UserModel.aggregate([
      // Calculate activity weight based on last active date
      {
        $addFields: {
          activityWeight: {
            $switch: {
              branches: [
                { case: { $gte: ['$lastActive', subDays(now, 7)] }, then: 10 },
                { case: { $gte: ['$lastActive', subDays(now, 14)] }, then: 8 },
                { case: { $gte: ['$lastActive', subDays(now, 30)] }, then: 6 },
                { case: { $gte: ['$lastActive', subDays(now, 60)] }, then: 3 },
                { case: { $gte: ['$lastActive', subDays(now, 90)] }, then: 1 },
              ],
              default: 0,
            },
          },
        },
      },
      // Calculate login streak weight
      {
        $addFields: {
          loginStreakWeight: {
            $switch: {
              branches: [
                { case: { $gte: ['$participation.activityMetrics.lastLoginStreak', 10] }, then: 5 },
                { case: { $gte: ['$participation.activityMetrics.lastLoginStreak', 5] }, then: 3 },
                { case: { $gte: ['$participation.activityMetrics.lastLoginStreak', 2] }, then: 1 },
              ],
              default: 0,
            },
          },
        },
      },
      // Calculate response quality weight
      {
        $addFields: {
          responseQualityWeight: {
            $multiply: [{ $ifNull: ['$participation.responseQuality.thoughtfulnessScore', 0] }, 0.5],
          },
        },
      },
      // Calculate feedback contribution weight
      {
        $addFields: {
          feedbackWeight: {
            $add: [
              { $ifNull: ['$participation.feedbackProvided.platformFeedback', 0] },
              { $ifNull: ['$participation.feedbackProvided.surveyFeedback', 0] },
              { $ifNull: ['$participation.feedbackProvided.featureRequests', 0] },
            ],
          },
        },
      },
      // Calculate response rate weight
      {
        $addFields: {
          responseRateWeight: {
            $cond: {
              if: { $gt: ['$participation.surveysInvited', 0] },
              then: {
                $multiply: [{ $divide: ['$participation.surveysCompleted', '$participation.surveysInvited'] }, 5],
              },
              else: 0,
            },
          },
        },
      },
      // Calculate comprehensive engagement score
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ['$participation.surveysCompleted', 2] },
              '$activityWeight',
              '$loginStreakWeight',
              '$responseQualityWeight',
              '$feedbackWeight',
              '$responseRateWeight',
            ],
          },
        },
      },
      // Categorize engagement levels more precisely
      {
        $addFields: {
          engagementLevel: {
            $switch: {
              branches: [
                { case: { $gte: ['$engagementScore', 25] }, then: 'Champion' },
                { case: { $gte: ['$engagementScore', 15] }, then: 'Highly Engaged' },
                { case: { $gte: ['$engagementScore', 10] }, then: 'Engaged' },
                { case: { $gte: ['$engagementScore', 5] }, then: 'Moderately Engaged' },
                { case: { $gte: ['$engagementScore', 2] }, then: 'Slightly Engaged' },
              ],
              default: 'Low Engagement',
            },
          },
        },
      },
      // Group by more demographic factors
      {
        $group: {
          _id: {
            gender: '$demographics.gender',
            ageRange: '$demographics.ageRange',
            education: '$demographics.education',
            yearsInIndustry: '$experience.yearsInIndustry',
            engagementLevel: '$engagementLevel',
          },
          count: { $sum: 1 },
          avgEngagementScore: { $avg: '$engagementScore' },
          avgSurveysCompleted: { $avg: '$participation.surveysCompleted' },
          avgResponseRate: { $avg: '$participation.responseRate' },
          avgLoginFrequency: { $avg: '$participation.activityMetrics.loginFrequency' },
        },
      },
      // Reorganize the data for better analysis
      {
        $group: {
          _id: {
            gender: '$_id.gender',
            ageRange: '$_id.ageRange',
            education: '$_id.education',
            yearsInIndustry: '$_id.yearsInIndustry',
          },
          engagementLevels: {
            $push: {
              level: '$_id.engagementLevel',
              count: '$count',
              avgEngagementScore: '$avgEngagementScore',
              avgSurveysCompleted: '$avgSurveysCompleted',
              avgResponseRate: '$avgResponseRate',
              avgLoginFrequency: '$avgLoginFrequency',
            },
          },
          totalCount: { $sum: '$count' },
          overallAvgEngagementScore: { $avg: '$avgEngagementScore' },
        },
      },
    ]);
  }
}
