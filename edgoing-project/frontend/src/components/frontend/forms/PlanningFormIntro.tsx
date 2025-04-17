
import React from "react";

interface PlanningFormIntroProps {
  title: string;
  responseTimeText: string;
  phoneContact: string;
}

const PlanningFormIntro: React.FC<PlanningFormIntroProps> = ({ 
  title, 
  responseTimeText, 
  phoneContact 
}) => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-xl mb-2 font-medium">{title}</h2>
      <p className="text-gray-600 mb-1">{responseTimeText}</p>
      <p className="text-gray-600">{phoneContact}</p>
    </div>
  );
};

export default PlanningFormIntro;
