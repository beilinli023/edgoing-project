
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Program } from '@/types/programTypes';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ProgramPrimaryInfoProps {
  program: Program;
  imageIndex: number;
  setImageIndex: (index: number) => void;
}

const ProgramPrimaryInfo: React.FC<ProgramPrimaryInfoProps> = ({ 
  program, 
  imageIndex, 
  setImageIndex 
}) => {
  const { currentLanguage } = useLanguage();
  
  const title = currentLanguage === 'en' ? program.title_en : program.title_zh;
  const description = currentLanguage === 'en' 
    ? program.description_en || '暂无描述' 
    : program.description_zh || '暂无描述';
  
  const programImages = program.gallery_images 
    ? [program.image || "/placeholder.svg", ...program.gallery_images] 
    : [program.image || "/placeholder.svg"];
  
  return (
    <div className="col-span-2">
      {programImages.length > 1 ? (
        <Carousel 
          className="w-full mb-6" 
          setApi={(api) => {
            api?.on("select", () => {
              setImageIndex(api.selectedScrollSnap());
            });
          }}
        >
          <CarouselContent>
            {programImages.map((img, index) => (
              <CarouselItem key={index}>
                <img 
                  src={img} 
                  alt={`${title} - ${index + 1}`} 
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
          
          <div className="flex justify-center gap-1 mt-2">
            {programImages.map((_, index) => (
              <span 
                key={index} 
                className={`inline-block h-2 w-2 rounded-full transition-colors ${
                  index === imageIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </Carousel>
      ) : (
        <img 
          src={program.image || "/placeholder.svg"} 
          alt={title} 
          className="w-full h-80 object-cover rounded-lg shadow-md mb-6"
        />
      )}
      
      <p className="text-gray-700 mb-6">{description}</p>
    </div>
  );
};

export default ProgramPrimaryInfo;
