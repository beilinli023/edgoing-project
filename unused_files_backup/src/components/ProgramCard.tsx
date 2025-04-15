import React from 'react';
import { Program } from '@/types/programTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const { currentLanguage } = useLanguage();
  const isEnglish = currentLanguage === 'en';
  
  const title = isEnglish ? program.title_en : program.title_zh;
  const location = isEnglish ? program.location_en : program.location_zh;
  const duration = isEnglish ? program.duration_en : program.duration_zh;
  const types = isEnglish ? program.program_type_en : program.program_type_zh;
  const overview = isEnglish ? program.overview_en : program.overview_zh;
  const gradeLevels = isEnglish ? program.grade_level_en : program.grade_level_zh;
  
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        {program.image && (
          <img 
            src={program.image} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // 设置回退图片
              const target = e.target as HTMLImageElement;
              console.error(`图片加载失败: ${program.image}`);
              target.src = '/images/programs/placeholder.jpg';
            }}
          />
        )}
        {!program.image && (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            无图片
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2 h-14">{title}</CardTitle>
        <CardDescription className="flex items-center space-x-2">
          <span>{location}</span>
          <span>•</span>
          <span>{duration}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-1 mb-3">
          {types && types.map((type, index) => (
            <Badge key={`type-${index}`} variant="outline">{type}</Badge>
          ))}
          {gradeLevels && gradeLevels.map((level, index) => (
            <Badge key={`grade-${index}`} variant="secondary">{level}</Badge>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-3">
          {overview || "暂无项目概述"}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2 text-sm text-gray-500">
        ID: {program.id} | ProgramID: {program.program_id}
      </CardFooter>
    </Card>
  );
}; 