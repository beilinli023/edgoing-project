
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { PartnerUniversity } from '@/types/studyAbroadTypes';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PartnerUniversityListItemProps {
  university: PartnerUniversity;
}

const PartnerUniversityListItem: React.FC<PartnerUniversityListItemProps> = ({ university }) => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  
  const name = currentLanguage === 'en' ? university.name_en : university.name_zh;
  const location = currentLanguage === 'en' ? university.location_en : university.location_zh;
  const programs = currentLanguage === 'en' ? university.programs_en : university.programs_zh;
  
  const handleClick = () => {
    navigate(`/university/${university.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group mb-4"
      onClick={handleClick}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 md:h-auto md:w-1/4 overflow-hidden">
          <img 
            src={university.image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <CardContent className="p-5 md:w-3/4 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{name}</h3>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{location}</span>
            </div>
            
            <p className="text-gray-600 mb-4">{programs}</p>
          </div>
          
          <div className="flex justify-end mt-auto">
            <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              {currentLanguage === 'en' ? 'Learn more' : '了解更多'} 
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PartnerUniversityListItem;
