
import { Program } from '@/types/programTypes';

/**
 * Filters programs by category
 */
export const filterProgramsByCategory = (
  programs: Program[], 
  categories: string[]
): Program[] => {
  if (!categories || categories.length === 0) return programs;
  
  return programs.filter(program => 
    program.tags.some(tag => {
      const tagNameEn = tag.name_en.toLowerCase();
      return categories.some(cat => {
        if (cat === 'academic') return tagNameEn.includes('academic');
        if (cat === 'cultural') return tagNameEn.includes('cultural');
        if (cat === 'language') return tagNameEn.includes('language');
        if (cat === 'internship') return tagNameEn.includes('internship');
        if (cat === 'volunteer') return tagNameEn.includes('volunteer');
        return false;
      });
    })
  );
};

/**
 * Filters programs by country
 */
export const filterProgramsByCountry = (
  programs: Program[], 
  countries: string[]
): Program[] => {
  if (!countries || countries.length === 0) return programs;
  
  return programs.filter(program => {
    const countryCode = program.country.toLowerCase();
    return countries.some(country => {
      if (country === 'usa') return countryCode.includes('usa');
      if (country === 'uk') return countryCode.includes('uk');
      if (country === 'france') return countryCode.includes('france');
      if (country === 'germany') return countryCode.includes('germany');
      if (country === 'australia') return countryCode.includes('australia');
      if (country === 'japan') return countryCode.includes('japan');
      if (country === 'canada') return countryCode.includes('canada');
      return false;
    });
  });
};

/**
 * Filters programs by grade level
 */
export const filterProgramsByGradeLevel = (
  programs: Program[], 
  gradeLevels: string[]
): Program[] => {
  if (!gradeLevels || gradeLevels.length === 0) return programs;
  
  return programs.filter(program => {
    if (!program.grade_levels) return false;
    
    return program.grade_levels.some(grade => {
      const gradeLower = grade.toLowerCase();
      return gradeLevels.some(level => {
        if (level === 'elementary') return gradeLower.includes('elementary');
        if (level === 'middle') return gradeLower.includes('middle');
        if (level === 'high') return gradeLower.includes('high');
        if (level === 'university') return gradeLower.includes('university');
        return false;
      });
    });
  });
};

/**
 * Ensures all programs have complete data to avoid undefined errors
 */
export const sanitizePrograms = (programs: Program[]): Program[] => {
  return programs.map(program => ({
    ...program,
    tags: program.tags || [],
    grade_levels: program.grade_levels || [],
  }));
};
