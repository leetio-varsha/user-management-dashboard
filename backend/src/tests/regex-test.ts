import { UserFilterOptions, MongoRegexOptions } from '../interfaces/filters.interface';

const regexOptions: MongoRegexOptions = {
  $regex: 'test',
  $options: 'i',
};

const filters: UserFilterOptions = {
  company: { $regex: 'acme', $options: 'i' },
  manufacturerId: { $regex: 'manu', $options: 'i' },
  firstName: { $regex: 'john', $options: 'i' },
  'demographics.gender': 'male',
  'experience.yearsInIndustry': { $gte: 5 },
};

console.log('TypeScript compilation successful!');
console.log('Regex options:', regexOptions);
console.log('Filters:', filters);
