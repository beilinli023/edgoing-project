
// Using mock data for program filters

/**
 * Fetches all program categories
 */
export const fetchProgramCategories = async () => {
  try {
    // Mock categories
    const categories = [
      { id: "1", name_en: "Language", name_zh: "语言" },
      { id: "2", name_en: "Cultural", name_zh: "文化" },
      { id: "3", name_en: "Academic", name_zh: "学术" },
      { id: "4", name_en: "History", name_zh: "历史" }
    ];
    
    return categories;
  } catch (error) {
    console.error('Error fetching program categories:', error);
    return [];
  }
};

/**
 * Fetches all program regions
 */
export const fetchProgramRegions = async () => {
  try {
    // Mock regions
    const regions = [
      { id: "1", name_en: "Asia", name_zh: "亚洲" },
      { id: "2", name_en: "North America", name_zh: "北美洲" },
      { id: "3", name_en: "Europe", name_zh: "欧洲" }
    ];
    
    return regions;
  } catch (error) {
    console.error('Error fetching program regions:', error);
    return [];
  }
};

/**
 * Fetches all program countries
 */
export const fetchProgramCountries = async () => {
  try {
    // Mock countries
    const countries = [
      { id: "jp", name_en: "Japan", name_zh: "日本" },
      { id: "us", name_en: "United States", name_zh: "美国" },
      { id: "uk", name_en: "United Kingdom", name_zh: "英国" },
      { id: "fr", name_en: "France", name_zh: "法国" }
    ];
    
    return countries;
  } catch (error) {
    console.error('Error fetching program countries:', error);
    return [];
  }
};

/**
 * Fetches all program grade levels
 */
export const fetchProgramGradeLevels = async () => {
  try {
    // Mock grade levels
    const gradeLevels = [
      { id: "1", name_en: "Grade 1-3", name_zh: "小学1-3年级" },
      { id: "2", name_en: "Grade 4-6", name_zh: "小学4-6年级" },
      { id: "3", name_en: "Grade 7-9", name_zh: "初中" },
      { id: "4", name_en: "Grade 10-12", name_zh: "高中" }
    ];
    
    return gradeLevels;
  } catch (error) {
    console.error('Error fetching program grade levels:', error);
    return [];
  }
};

/**
 * Fetches all filter options
 */
export const fetchAllFilters = async () => {
  try {
    const [categories, regions, countries, gradeLevels] = await Promise.all([
      fetchProgramCategories(),
      fetchProgramRegions(),
      fetchProgramCountries(),
      fetchProgramGradeLevels()
    ]);
    
    return {
      categories,
      regions,
      countries,
      gradeLevels
    };
  } catch (error) {
    console.error('Error fetching all filters:', error);
    return {
      categories: [],
      regions: [],
      countries: [],
      gradeLevels: []
    };
  }
};

export default {
  fetchProgramCategories,
  fetchProgramRegions,
  fetchProgramCountries,
  fetchProgramGradeLevels,
  fetchAllFilters
};
