import { type User } from '../../interfaces/user';

export const mockUsers: User[] = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: 'male',
    company: 'Acme Inc 1',
    lastActive: new Date('2023-01-15').toISOString(),
    manufacturerId: null,
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    gender: 'female',
    company: 'Tech Solutions',
    lastActive: new Date('2023-02-20').toISOString(),
    manufacturerId: 'manu1',
  },
  {
    _id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    gender: 'male',
    company: 'Acme Inc',
    lastActive: new Date('2023-03-10').toISOString(),
    manufacturerId: null,
  },
  {
    _id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@example.com',
    gender: 'female',
    company: 'Tech Solutions 2',
    lastActive: new Date('2023-04-05').toISOString(),
    manufacturerId: 'manu2',
  },
  {
    _id: '5',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    gender: 'male',
    company: 'Global Corp',
    lastActive: new Date('2023-05-12').toISOString(),
    manufacturerId: null,
  },
];

// Mock stats for testing
export const mockStats: any[] = [
  {
    name: 'Users by Gender',
    stats: [
      { label: 'Male', value: 3 },
      { label: 'Female', value: 2 },
    ],
  },
  {
    name: 'Users by Company',
    stats: [
      { label: 'Acme Inc', value: 2 },
      { label: 'Tech Solutions', value: 2 },
      { label: 'Global Corp', value: 1 },
    ],
  },
  {
    name: 'Users by Manufacturer',
    stats: [
      { label: 'No Manufacturer', value: 3 },
      { label: 'Manufacturer 1', value: 1 },
      { label: 'Manufacturer 2', value: 1 },
    ],
  },
];

// Mock stat groups for testing
import { type StatGroup } from '../../interfaces/stats';

export const mockStatGroups: StatGroup[] = [
  {
    _id: {
      gender: 'male',
      ageRange: '25-34',
    },
    engagementLevels: [
      { level: 'Highly Engaged', count: 10 },
      { level: 'Moderately Engaged', count: 5 },
      { level: 'Low Engagement', count: 2 },
    ],
  },
  {
    _id: {
      gender: 'female',
      ageRange: '35-44',
    },
    engagementLevels: [
      { level: 'Highly Engaged', count: 8 },
      { level: 'Moderately Engaged', count: 7 },
      { level: 'Low Engagement', count: 3 },
    ],
  },
  {
    _id: {
      gender: 'male',
      ageRange: '45-54',
    },
    engagementLevels: [
      { level: 'Highly Engaged', count: 6 },
      { level: 'Moderately Engaged', count: 9 },
      { level: 'Low Engagement', count: 4 },
    ],
  },
];

export const mockManufacturers = [
  { id: 'manu1', name: 'Manufacturer 1' },
  { id: 'manu2', name: 'Manufacturer 2' },
  { id: 'manu3', name: 'Manufacturer 3' },
];
