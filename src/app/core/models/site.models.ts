import { SafeHtml } from '@angular/platform-browser';

export interface NavLink {
  label: string;
  path: string;
  exact?: boolean;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: SafeHtml;
}

export interface StepItem {
  order: string;
  title: string;
  description: string;
  emoji: string;
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
}

export interface Brand {
  name: string;
  color: string;
  font?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}
