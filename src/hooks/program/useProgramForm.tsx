
import { useState, useEffect } from "react";
import { ProgramData, ProgramFormData } from "@/types/programTypes";

export function useProgramForm(program: ProgramData | null, isAdding: boolean) {
  const [formData, setFormData] = useState<ProgramFormData | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [newTag, setNewTag] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "zh">("en");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when program data is loaded
  useEffect(() => {
    if (isAdding) {
      // Initialize form data for a new program
      setFormData({
        id: "",
        title: "", // Chinese title
        titleEn: "", // English title
        thumbnail: "",
        category: "",
        location: "",
        duration: "",
        gradeLevel: "",
        tags: [],
        description: "", // Chinese description
        descriptionEn: "", // English description
        highlights: "", // Chinese highlights (learning_outcomes)
        highlightsEn: "", // English highlights (learning_outcomes)
        itinerary: "", // Chinese itinerary (requirements)
        itineraryEn: "", // English itinerary (requirements)
        features: "", // Chinese features (instructor)
        featuresEn: "", // English features (instructor)
        information: "", // Chinese information
        informationEn: "", // English information
        price: "",
        images: []
      });
    } else if (program) {
      // Format existing program data from the database to the form format
      console.log("Retrieved program:", program);
      const programTags = program.program_tags || [];
      const tagNames = programTags.map((tag: any) => tag.name_en || "");
      
      // Map database fields to form fields
      setFormData({
        id: program.program_id || "",
        title: program.title_zh || "",
        titleEn: program.title_en || "",
        thumbnail: program.thumbnail || "",
        category: program.category_id || "",
        location: program.summary_en || "", // Use summary as location
        duration: program.duration_en || program.duration_zh || "",
        gradeLevel: "",
        tags: tagNames,
        description: program.description_zh || "",
        descriptionEn: program.description_en || "",
        highlights: program.learning_outcomes_zh || "", // Use learning_outcomes as highlights
        highlightsEn: program.learning_outcomes_en || "", 
        itinerary: program.requirements_zh || "", // Use requirements as itinerary
        itineraryEn: program.requirements_en || "", 
        features: program.instructor_zh || "", // Use instructor as features
        featuresEn: program.instructor_en || "", 
        information: program.description_zh || "", // Reuse description as information
        informationEn: program.description_en || "",
        price: program.price_original || "",
        images: program.gallery || []
      });
    }
  }, [program, isAdding]);

  // Handle form field changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Handle adding tags
  const handleAddTag = () => {
    if (formData && newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  // Handle removing tags
  const handleRemoveTag = (tag: string) => {
    if (formData) {
      setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) });
    }
  };

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    newTag,
    setNewTag,
    showPreview,
    setShowPreview,
    previewLanguage,
    setPreviewLanguage,
    isSaving,
    setIsSaving,
    handleInputChange,
    handleAddTag,
    handleRemoveTag
  };
}
