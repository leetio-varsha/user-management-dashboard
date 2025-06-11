export interface EngagementLevel {
  level: string;
  count: number;
}

export interface StatGroup {
  _id: {
    gender: string;
    ageRange: string;
  };
  engagementLevels: EngagementLevel[];
}
