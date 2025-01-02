export interface Profile {
  id: string;
  username: string;
  name?: string;
  bio?: string;
  location?: string;
  image?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
} 