
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProgramData } from "@/types/programTypes";

export function useProgramData() {
  const { id } = useParams<{ id: string }>();
  const isAdding = id === "add";
  
  // Mock program data
  const mockProgram: ProgramData = {
    id: id || "1",
    program_id: "sample-program",
    title_en: "Sample Program",
    title_zh: "示例项目",
    thumbnail: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1470&auto=format&fit=crop",
    summary_en: "This is a sample program",
    summary_zh: "这是一个示例项目",
    description_en: "Detailed description in English",
    description_zh: "中文详细描述",
    learning_outcomes_en: "Learning outcomes in English",
    learning_outcomes_zh: "中文学习成果",
    requirements_en: "Requirements in English",
    requirements_zh: "中文要求",
    instructor_en: "Instructor info in English",
    instructor_zh: "中文讲师信息",
    gallery: ["/placeholder.svg"],
    duration_en: "2 weeks",
    duration_zh: "2周",
    price_original: 2000,
    category_id: "1", // Added this required field
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Get program data
  const { data: program, isLoading: programLoading } = useQuery({
    queryKey: ['program', id],
    queryFn: () => {
      // Return mock data after a simulated delay
      return new Promise<ProgramData | null>((resolve) => {
        setTimeout(() => {
          if (isAdding) {
            resolve(null);
          } else {
            resolve(mockProgram);
          }
        }, 500);
      });
    },
    enabled: !isAdding && !!id
  });
  
  // Mock categories data
  const { data: categoriesData = [] } = useQuery({
    queryKey: ['programCategories'],
    queryFn: () => {
      return Promise.resolve([
        { id: "1", name_en: "Academic", name_zh: "学术" },
        { id: "2", name_en: "Cultural", name_zh: "文化" },
        { id: "3", name_en: "Language", name_zh: "语言" }
      ]);
    }
  });
  
  // Format categories data
  const categories = categoriesData.map(cat => ({
    id: cat.id,
    nameEn: cat.name_en,
    nameCn: cat.name_zh
  }));
  
  // Mock locations data
  const { data: locationsData = [] } = useQuery({
    queryKey: ['programLocations'],
    queryFn: () => Promise.resolve([
      { id: "1", nameEn: "United States", nameCn: "美国" },
      { id: "2", nameEn: "United Kingdom", nameCn: "英国" },
      { id: "3", nameEn: "Japan", nameCn: "日本" },
    ])
  });
  
  const locations = locationsData;
  
  // Mock grade levels data
  const { data: gradeLevelsData = [] } = useQuery({
    queryKey: ['programGradeLevels'],
    queryFn: () => Promise.resolve([
      { id: "1", nameEn: "Grade 1-3", nameCn: "小学1-3年级" },
      { id: "2", nameEn: "Grade 4-6", nameCn: "小学4-6年级" },
      { id: "3", nameEn: "Grade 7-9", nameCn: "初中" },
      { id: "4", nameEn: "Grade 10-12", nameCn: "高中" },
    ])
  });
  
  const gradeLevels = gradeLevelsData;

  return {
    id,
    isAdding,
    program: program as ProgramData | null,
    programLoading,
    categories,
    locations,
    gradeLevels
  };
}
