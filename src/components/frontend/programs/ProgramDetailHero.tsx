
import React from 'react';
import { MapPin, Users, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Program } from '@/types/programTypes';

interface ProgramDetailHeroProps {
  program: Program;
}

const ProgramDetailHero: React.FC<ProgramDetailHeroProps> = ({ program }) => {
  const { currentLanguage } = useLanguage();
  
  const title = currentLanguage === 'en' ? program.title_en : program.title_zh;
  const location = currentLanguage === 'en' ? program.location_en : program.location_zh;
  const inquireText = currentLanguage === 'en' ? 'Inquire About This Program' : '咨询此项目';
  const gradeLevels = program.grade_levels && program.grade_levels.length > 0 
    ? program.grade_levels.join(', ') 
    : currentLanguage === 'en' ? 'All grades' : '所有年级';
  
  return (
    <div 
      className="relative bg-cover bg-center py-16 md:py-32 text-white"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${program.image})` 
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {program.tags && program.tags.map((tag, index) => (
              <Badge 
                key={index}
                className="bg-white/20 hover:bg-white/30 text-white border-none py-1"
              >
                {currentLanguage === 'en' ? tag.name_en : tag.name_zh}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>{gradeLevels}</span>
            </div>
          </div>
          
          <Button className="bg-white text-blue-900 hover:bg-blue-50 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {inquireText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailHero;
