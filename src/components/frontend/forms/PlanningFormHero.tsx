import React from "react";

interface PlanningFormHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const PlanningFormHero: React.FC<PlanningFormHeroProps> = ({ 
  title, 
  subtitle, 
  backgroundImage 
}) => {
  return (
    <div 
      className="relative pt-20 pb-32 text-white"
      style={{
        backgroundImage: `url('/Edgoing/LetsPlan.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container-fluid w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center mt-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">{title}</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 text-center">{subtitle}</p>
      </div>
    </div>
  );
};

export default PlanningFormHero;
