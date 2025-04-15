
import { useState, useEffect } from "react";
import {
  FeaturedProgramsContent,
  FeaturedProgram,
  getFeaturedProgramsContent,
  getFeaturedPrograms,
  updateFeaturedProgramsContent,
  addFeaturedProgram,
  removeFeaturedProgram,
  updateProgramsOrder
} from "@/services/featured-programs/featuredProgramsService";

export const useFeaturedPrograms = () => {
  const [introContent, setIntroContent] = useState<FeaturedProgramsContent>({
    subtitle_en: "",
    subtitle_zh: "",
    title_en: "",
    title_zh: "",
    link_text_en: "",
    link_text_zh: "",
    link_url: "/programs"
  });

  const [programs, setPrograms] = useState<FeaturedProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newProgram, setNewProgram] = useState<Omit<FeaturedProgram, 'id' | 'order_index'>>({
    image: "/placeholder.svg",
    title_en: "",
    title_zh: "",
    description_en: "",
    description_zh: "",
    location_en: "",
    location_zh: "",
    duration: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch intro content
        const contentData = await getFeaturedProgramsContent();
        if (contentData) {
          setIntroContent(contentData);
        }

        // Fetch programs
        const programsData = await getFeaturedPrograms();
        if (programsData) {
          setPrograms(programsData);
        }
      } catch (error) {
        console.error("Error fetching featured programs data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a new program
  const addProgram = async () => {
    if (newProgram.title_en && newProgram.title_zh) {
      const orderIndex = programs.length > 0 
        ? Math.max(...programs.map(program => program.order_index ?? 0)) + 1 
        : 1;
      
      const programToAdd = {
        ...newProgram,
        order_index: orderIndex
      };

      const addedProgram = await addFeaturedProgram(programToAdd);
      if (addedProgram) {
        setPrograms([...programs, addedProgram]);
        setNewProgram({
          image: "/placeholder.svg",
          title_en: "",
          title_zh: "",
          description_en: "",
          description_zh: "",
          location_en: "",
          location_zh: "",
          duration: "",
        });
      }
    }
  };

  // Remove a program
  const removeProgram = async (id: string) => {
    const success = await removeFeaturedProgram(id);
    if (success) {
      setPrograms(programs.filter(program => program.id !== id));
    }
  };

  // Move a program up or down to change the order
  const moveProgram = async (id: string, direction: 'up' | 'down') => {
    const index = programs.findIndex(program => program.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === programs.length - 1)
    ) {
      return;
    }

    const newPrograms = [...programs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap items
    [newPrograms[index], newPrograms[targetIndex]] = [newPrograms[targetIndex], newPrograms[index]];
    
    // Update order property
    newPrograms.forEach((program, idx) => {
      program.order_index = idx + 1;
    });
    
    setPrograms(newPrograms);
    await updateProgramsOrder(newPrograms);
  };

  // Save intro content
  const saveIntroContent = async () => {
    const success = await updateFeaturedProgramsContent(introContent);
    return success;
  };

  // Save all changes
  const saveAllChanges = async () => {
    const contentSaved = await saveIntroContent();
    return contentSaved;
  };

  return {
    introContent,
    setIntroContent,
    programs,
    newProgram,
    setNewProgram,
    addProgram,
    removeProgram,
    moveProgram,
    saveIntroContent,
    saveAllChanges,
    isLoading
  };
};
