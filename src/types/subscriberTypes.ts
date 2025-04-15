
export interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  status: "active" | "unsubscribed" | "bounced";
  subscribedAt: string;
  lastEmaildAt?: string | null;  // Made optional for consistency
  lastEmailedAt: string | null;  // Match the field name used in components
  source: string;
  tags: string[];
}
