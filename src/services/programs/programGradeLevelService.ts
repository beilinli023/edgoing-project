
/**
 * Fetches all grade levels from the database
 */
export const fetchGradeLevels = async (): Promise<GradeLevel[]> => {
  try {
    // Using mock data since we're not connecting to Supabase
    return [
      { id: "1", name_en: "Grade 1-3", name_zh: "小学1-3年级", order_index: 0, count: 2, created_at: new Date().toISOString() },
      { id: "2", name_en: "Grade 4-6", name_zh: "小学4-6年级", order_index: 1, count: 3, created_at: new Date().toISOString() },
      { id: "3", name_en: "Grade 7-9", name_zh: "初中", order_index: 2, count: 5, created_at: new Date().toISOString() },
      { id: "4", name_en: "Grade 10-12", name_zh: "高中", order_index: 3, count: 4, created_at: new Date().toISOString() },
    ];
  } catch (error) {
    console.error('Error in fetchGradeLevels:', error);
    return [];
  }
};

/**
 * Creates a new grade level
 */
export const createGradeLevel = async (gradeLevel: { name_en: string, name_zh: string }): Promise<GradeLevel> => {
  try {
    // Mock implementation
    const newGradeLevel: GradeLevel = {
      id: Math.random().toString(36).substring(2, 11),
      name_en: gradeLevel.name_en,
      name_zh: gradeLevel.name_zh,
      order_index: 999, // Default to end of list
      count: 0,
      created_at: new Date().toISOString()
    };
    return newGradeLevel;
  } catch (error) {
    console.error('Error in createGradeLevel:', error);
    throw error;
  }
};

/**
 * Updates an existing grade level
 */
export const updateGradeLevel = async (id: string, updates: { name_en?: string, name_zh?: string }): Promise<GradeLevel> => {
  try {
    // Mock implementation
    return {
      id,
      name_en: updates.name_en || "Updated Grade Level",
      name_zh: updates.name_zh || "更新的年级级别",
      order_index: 0,
      count: 0,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in updateGradeLevel:', error);
    throw error;
  }
};

/**
 * Deletes a grade level
 */
export const deleteGradeLevel = async (id: string): Promise<boolean> => {
  try {
    // Mock implementation
    return true;
  } catch (error) {
    console.error('Error in deleteGradeLevel:', error);
    throw error;
  }
};

/**
 * Assigns a grade level to a program
 */
export const assignGradeLevelToProgram = async (programId: string, gradeId: string): Promise<{ program_id: string, grade_id: string }> => {
  try {
    // Mock implementation
    return { program_id: programId, grade_id: gradeId };
  } catch (error) {
    console.error('Error in assignGradeLevelToProgram:', error);
    throw error;
  }
};

/**
 * Removes a grade level from a program
 */
export const removeGradeLevelFromProgram = async (programId: string, gradeId: string): Promise<boolean> => {
  try {
    // Mock implementation
    return true;
  } catch (error) {
    console.error('Error in removeGradeLevelFromProgram:', error);
    throw error;
  }
};

/**
 * Type definition for grade levels with count
 */
export interface GradeLevel {
  id: string;
  name_en: string;
  name_zh: string;
  order_index: number;
  created_at: string;
  updated_at?: string;
  count?: number;
  program_count?: Array<{count: number}>;
}

export type { GradeLevel as default };
