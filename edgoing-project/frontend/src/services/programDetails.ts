
import type { Program } from '@/types/programTypes';

// Fetch a program by ID
export const fetchProgramDetails = async (id: string): Promise<Program | null> => {
  try {
    // Mock program data
    const mockProgram: Program = {
      id: id,
      title_en: "Summer Camp in Tokyo",
      title_zh: "东京夏令营",
      program_id: "tokyo-summer",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      location_en: "Tokyo, Japan",
      location_zh: "日本东京",
      duration: "2 weeks",
      country: "Japan",
      tags: [
        { id: "1", name_en: "Language", name_zh: "语言" },
        { id: "2", name_en: "Cultural", name_zh: "文化" }
      ],
      grade_levels: ["1", "2"],
      description_en: "Experience Japanese culture while improving your language skills.",
      description_zh: "在提高语言技能的同时体验日本文化。",
      highlights_en: "Language classes every morning",
      highlights_zh: "每天上午语言课程",
      itinerary_en: "Day 1: Arrival and orientation",
      itinerary_zh: "第1天：抵达和入学指导",
      features_en: "Small class sizes (max 15 students)",
      features_zh: "小班教学（最多15名学生）",
      information_en: "Program runs from July 1 to July 14, 2023",
      information_zh: "项目时间：2023年7月1日至14日",
      price: "4,500",
      gallery_images: [
        "https://images.unsplash.com/photo-1528164344705-47542687000d",
        "https://images.unsplash.com/photo-1542051841857-5f90071e7989",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e"
      ]
    };

    return mockProgram;
  } catch (error) {
    console.error('Error fetching program details:', error);
    return null;
  }
};

// Map database fields to frontend structure
export const mapProgramDetails = (data: any): Program => {
  // Create a structured program object from the data
  const mappedProgram: Program = {
    id: data.id,
    title_en: data.title_en || '',
    title_zh: data.title_zh || '',
    program_id: data.program_id || '',
    image: data.thumbnail || '',
    location_en: data.summary_en || '',
    location_zh: data.summary_zh || '',
    duration: data.duration_en || '',
    country: '',
    tags: [],
    grade_levels: [],
    description_en: data.description_en || '',
    description_zh: data.description_zh || '',
    highlights_en: data.learning_outcomes_en || '',
    highlights_zh: data.learning_outcomes_zh || '',
    itinerary_en: data.requirements_en || '',
    itinerary_zh: data.requirements_zh || '',
    features_en: data.instructor_en || '',
    features_zh: data.instructor_zh || '',
    price: data.price_original ? data.price_original.toString() : '',
    gallery_images: data.gallery || []
  };

  return mappedProgram;
};

export default {
  fetchProgramDetails,
  mapProgramDetails
};
