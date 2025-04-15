
// Export all program-related services from existing files
export { fetchAndFilterPrograms } from './programFilterService';
export { 
  fetchProgramCategories, 
  fetchProgramCountries, 
  fetchProgramGradeLevels 
} from './programTaxonomyService';
export { updateProgramOrder } from './programOrderService';
