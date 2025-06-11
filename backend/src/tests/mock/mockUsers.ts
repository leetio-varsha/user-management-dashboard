import {Types} from "mongoose";

export function generateMockUser(overrides = {}) {
    return {
        _id: new Types.ObjectId(),
        status: 'active',
        manufacturerId: 'manu1',
        joinedAt: new Date('2023-02-01'),
        lastActive: new Date('2024-01-10'),
        metadata: {},
        firstName: 'Alice',
        lastName: 'Johnson',
        jobTitle: 'Software Engineer',
        company: 'ACME',
        demographics: {
            gender: 'female',
            ageRange: '25-34',
            education: 'Master',
        },
        experience: {
            yearsInIndustry: {
                value: 12,
                unit: 'years',
            },
        },
        participation: {
            surveysCompleted: 5,
            surveysInvited: 7,
            activityMetrics: {
                lastLoginStreak: 6,
                loginFrequency: 3,
            },
            responseQuality: {
                thoughtfulnessScore: 4,
            },
            feedbackProvided: {
                platformFeedback: 2,
                surveyFeedback: 1,
                featureRequests: 1,
            },
            responseRate: 0.71,
        },
        address: {
            city: 'Kyiv',
            country: 'Ukraine',
        },
        ...overrides,
    };
}