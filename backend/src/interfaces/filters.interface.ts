import { SortOrder } from 'mongoose';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  [key: string]: SortOrder;
}

export interface MongoRegexOptions {
  $regex: string | RegExp;
  $options?: string;
}

export interface UserFilterOptions {
  firstName?: string | RegExp | MongoRegexOptions;
  lastName?: string | RegExp | MongoRegexOptions;
  email?: string | RegExp | MongoRegexOptions;
  phone?: string | RegExp | MongoRegexOptions;
  company?: string | RegExp | MongoRegexOptions;
  department?: string | RegExp | MongoRegexOptions;
  role?: string | RegExp | MongoRegexOptions;
  jobTitle?: string | RegExp | MongoRegexOptions;

  'experience.yearsInIndustry'?: number | { $gte?: number; $lte?: number };
  'experience.expertise'?: string | RegExp | MongoRegexOptions | { $in: string[] };
  'experience.certifications'?: string | RegExp | MongoRegexOptions | { $in: string[] };

  'preferences.language'?: string | RegExp | MongoRegexOptions;
  'preferences.timezone'?: string | RegExp | MongoRegexOptions;
  'preferences.communicationChannel'?: string | RegExp | MongoRegexOptions;

  'demographics.ageRange'?: string | RegExp | MongoRegexOptions;
  'demographics.gender'?: string | RegExp | MongoRegexOptions;
  'demographics.education'?: string | RegExp | MongoRegexOptions;

  'workHistory.currentPosition'?: string | RegExp | MongoRegexOptions;
  'workHistory.previousPositions'?: string | RegExp | MongoRegexOptions | { $in: string[] };
  'workHistory.industrySpecialization'?: string | RegExp | MongoRegexOptions | { $in: string[] };

  status?: string | RegExp | MongoRegexOptions;

  'participation.surveysCompleted'?: number | { $gte?: number; $lte?: number };
  'participation.surveysInvited'?: number | { $gte?: number; $lte?: number };
  'participation.lastResponseDate'?: Date | { $gte?: Date; $lte?: Date };
  'participation.responseRate'?: number | { $gte?: number; $lte?: number };
  'participation.avgResponseTime'?: number | { $gte?: number; $lte?: number };

  'address.city'?: string | RegExp | MongoRegexOptions;
  'address.state'?: string | RegExp | MongoRegexOptions;
  'address.country'?: string | RegExp | MongoRegexOptions;
  'address.postalCode'?: string | RegExp | MongoRegexOptions;

  manufacturerId?: string | RegExp | MongoRegexOptions;

  joinedAt?: Date | { $gte?: Date; $lte?: Date };
  lastActive?: Date | { $gte?: Date; $lte?: Date };

  $and?: UserFilterOptions[];
  $or?: UserFilterOptions[];

  [key: string]: any;
}
