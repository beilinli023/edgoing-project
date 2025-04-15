
import React from "react";
import { ContactInfoCard } from "./contact/ContactInfoCard";
import { useContactInfo } from "@/hooks/useContactInfo";

const ContactInfoManager: React.FC = () => {
  const { 
    contactInfo, 
    isLoading, 
    isPending, 
    handleInputChange, 
    handleSave 
  } = useContactInfo();

  return (
    <ContactInfoCard
      isLoading={isLoading}
      contactInfo={contactInfo}
      handleInputChange={handleInputChange}
      handleSave={handleSave}
      isPending={isPending}
    />
  );
};

export default ContactInfoManager;
