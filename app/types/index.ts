export interface ExperienceItemLinks {
  github?: string;
  live?: string;
}

export interface ExperienceItem {
  title: string;
  date: string;
  company: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  stats: string;
  images: string[];
  tags: string[];
  details?: string;
  skills?: string[];
  highlights?: string[];
  links?: ExperienceItemLinks;
}
