export interface Achievement {
  id: string;
  title: string;
  type: "feature" | "support" | "cooperation" | "other";
  ticketKeys?: string[]; // Related Jira ticket keys
  period: string; // e.g., "Q3 2025", "July 2025"
  savedCategory?: string;
  savedDescription?: string;
  savedImpact?: string;
}

export interface AchievementFormData {
  category: string;
  description: string;
  impact: string;
}
