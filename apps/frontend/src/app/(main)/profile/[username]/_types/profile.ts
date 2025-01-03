export interface Profile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  image?: string | null;
  bio?: string;
  location?: string;
  company?: string;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  expertise?: string[];
  availability?: {
    timezone: string;
    schedule: {
      day: string;
      slots: string[];
    }[];
  };
  createdAt: string;
  updatedAt: string;
} 