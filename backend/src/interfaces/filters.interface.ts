import { SortOrder } from 'mongoose';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  [key: string]: SortOrder;
}

// Interface for MongoDB regex query operators
export interface MongoRegexOptions {
  $regex: string | RegExp;
  $options?: string;
}

export interface UserFilterOptions {
  // Basic user information
  firstName?: string | RegExp | MongoRegexOptions;
  lastName?: string | RegExp | MongoRegexOptions;
  email?: string | RegExp | MongoRegexOptions;
  phone?: string | RegExp | MongoRegexOptions;
  company?: string | RegExp | MongoRegexOptions;
  department?: string | RegExp | MongoRegexOptions;
  role?: string | RegExp | MongoRegexOptions;
  jobTitle?: string | RegExp | MongoRegexOptions;

  // Experience information
  'experience.yearsInIndustry'?: number | { $gte?: number; $lte?: number };
  'experience.expertise'?: string | RegExp | MongoRegexOptions | { $in: string[] };
  'experience.certifications'?: string | RegExp | MongoRegexOptions | { $in: string[] };

  // Preferences
  'preferences.language'?: string | RegExp | MongoRegexOptions;
  'preferences.timezone'?: string | RegExp | MongoRegexOptions;
  'preferences.communicationChannel'?: string | RegExp | MongoRegexOptions;

  // Demographics
  'demographics.ageRange'?: string | RegExp | MongoRegexOptions;
  'demographics.gender'?: string | RegExp | MongoRegexOptions;
  'demographics.education'?: string | RegExp | MongoRegexOptions;

  // Work history
  'workHistory.currentPosition'?: string | RegExp | MongoRegexOptions;
  'workHistory.previousPositions'?: string | RegExp | MongoRegexOptions | { $in: string[] };
  'workHistory.industrySpecialization'?: string | RegExp | MongoRegexOptions | { $in: string[] };

  // Status
  status?: string | RegExp | MongoRegexOptions;

  // Participation metrics
  'participation.surveysCompleted'?: number | { $gte?: number; $lte?: number };
  'participation.surveysInvited'?: number | { $gte?: number; $lte?: number };
  'participation.lastResponseDate'?: Date | { $gte?: Date; $lte?: Date };
  'participation.responseRate'?: number | { $gte?: number; $lte?: number };
  'participation.avgResponseTime'?: number | { $gte?: number; $lte?: number };

  // Address information
  'address.city'?: string | RegExp | MongoRegexOptions;
  'address.state'?: string | RegExp | MongoRegexOptions;
  'address.country'?: string | RegExp | MongoRegexOptions;
  'address.postalCode'?: string | RegExp | MongoRegexOptions;

  // Manufacturer association
  manufacturerId?: string | RegExp | MongoRegexOptions;

  // Timestamps
  joinedAt?: Date | { $gte?: Date; $lte?: Date };
  lastActive?: Date | { $gte?: Date; $lte?: Date };

  // Custom query operators
  $and?: UserFilterOptions[];
  $or?: UserFilterOptions[];

  // Allow any other fields
  [key: string]: any;
}
