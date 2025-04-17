
export interface NewsletterSubscription {
  id: string;
  email: string;
  language: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriptionInput {
  email: string;
  language: string;
  status: 'active';
  subscribed_at: string;
}
