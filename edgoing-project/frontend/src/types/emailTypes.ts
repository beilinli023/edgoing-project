
export interface EmailTemplate {
  subject: string;
  content: string;
  enabled: boolean;
}

export interface EmailSettings {
  companyEmails: string[];
  userAutoReply: {
    en: EmailTemplate;
    zh: EmailTemplate;
  };
  companyNotification: EmailTemplate;
}

export interface EmailVariable {
  key: string;
  description: string;
}
