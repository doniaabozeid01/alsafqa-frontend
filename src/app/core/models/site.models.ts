import { SafeHtml } from '@angular/platform-browser';

export interface NavLink {
  label: string;
  path: string;
  exact?: boolean;
  fragment?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: SafeHtml;
}

export interface BrandCard {
  title: string;
  items: string[];
  icon: SafeHtml;
}

export interface StepItem {
  order: string;
  title: string;
  description: string;
  emoji: string;
}

export interface JourneyStep {
  order: string;
  title: string;
  description: string;
  icon: SafeHtml;
  isFinal?: boolean;
}

export interface NewsItem {
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface PageHero {
  tag: string;
  title: string;
  subtitle: string;
}

export interface AboutPageContent {
  intro: string[];
  goal: {
    title: string;
    description: string;
    image: string;
  };
  vision: {
    title: string;
    items: string[];
  };
  stats: Array<{
    value: number;
    prefix: string;
    suffix: string;
    label: string;
  }>;
  phones: string[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export interface StatItem {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  icon: SafeHtml;
}

export interface ProductCategory {
  title: string;
  subtitle: string;
  image: string;
  brand: string;
}

export interface Brand {
  name: string;
  color: string;
  font?: string;
}

export interface ContactInfo {
  phone: string;
  phones: string[];
  email: string;
  address: string;
}
