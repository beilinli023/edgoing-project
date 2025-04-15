
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 导入分离出的组件
import BasicInfoTab from "@/components/programs/edit/BasicInfoTab";
import DetailsTab from "@/components/programs/edit/DetailsTab";
import HighlightsTab from "@/components/programs/edit/HighlightsTab";
import ItineraryTab from "@/components/programs/edit/ItineraryTab";
import FeaturesTab from "@/components/programs/edit/FeaturesTab";
import InformationTab from "@/components/programs/edit/InformationTab";
import ImagesTab from "@/components/programs/edit/ImagesTab";
import ProgramPreview from "@/components/programs/edit/ProgramPreview";
import ProgramEditHeader from "@/components/programs/edit/ProgramEditHeader";

// 导入自定义hook
import { useProgramEdit } from "@/hooks/useProgramEdit";

const ProgramEdit = () => {
  const {
    isAdding,
    formData,
    programLoading,
    activeTab,
    setActiveTab,
    newTag,
    setNewTag,
    showPreview,
    previewLanguage,
    categories,
    locations,
    gradeLevels,
    handleInputChange,
    handleAddTag,
    handleRemoveTag,
    handleSave,
    handlePreview,
    handleClosePreview,
    isSaving
  } = useProgramEdit();
  
  if (programLoading || !formData) {
    return <div className="container mx-auto py-6">加载中...</div>;
  }
  
  return (
    <div className="container mx-auto py-6">
      <ProgramEditHeader 
        isAdding={isAdding}
        onSave={handleSave}
        onPreview={handlePreview}
        isSaving={isSaving}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 mb-4">
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="details">详细描述</TabsTrigger>
          <TabsTrigger value="highlights">亮点</TabsTrigger>
          <TabsTrigger value="itinerary">行程</TabsTrigger>
          <TabsTrigger value="features">特色</TabsTrigger>
          <TabsTrigger value="information">信息</TabsTrigger>
          <TabsTrigger value="images">图片管理</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <BasicInfoTab 
            formData={formData}
            handleInputChange={handleInputChange}
            newTag={newTag}
            setNewTag={setNewTag}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            categories={categories}
            locations={locations}
            gradeLevels={gradeLevels}
          />
        </TabsContent>
        
        <TabsContent value="details">
          <DetailsTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </TabsContent>
        
        <TabsContent value="highlights">
          <HighlightsTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </TabsContent>
        
        <TabsContent value="itinerary">
          <ItineraryTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </TabsContent>
        
        <TabsContent value="features">
          <FeaturesTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </TabsContent>
        
        <TabsContent value="information">
          <InformationTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </TabsContent>
        
        <TabsContent value="images">
          <ImagesTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </TabsContent>
      </Tabs>

      {showPreview && (
        <ProgramPreview
          formData={formData}
          onClose={handleClosePreview}
          language={previewLanguage}
        />
      )}
    </div>
  );
};

export default ProgramEdit;
