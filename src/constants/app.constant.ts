/**
 * Application Configuration
 * Central place for app-wide settings like name, description, logo paths, etc.
 */

export const APP_CONFIG = {
  // App Identity
  name: 'Ventidole Admin',
  shortName: 'Ventidole',
  description: 'Admin dashboard for Ventidole marketplace management',
  version: '1.0.0',

  // Branding
  logo: {
    light: '/images/logo/logo.svg',
    dark: '/images/logo/logo-dark.svg',
    icon: '/images/logo/logo-icon.svg',
    favicon: '/favicon.ico',
  },

  // SEO
  seo: {
    title: 'Ventidole Admin - Marketplace Management Dashboard',
    description:
      'Manage your marketplace with ease. Handle users, products, orders, and analytics all in one place.',
    keywords: [
      'admin',
      'dashboard',
      'marketplace',
      'ecommerce',
      'management',
      'ventidole',
    ],
  },

  // URLs
  urls: {
    website: 'https://ventidole.com',
    support: 'https://support.ventidole.com',
    docs: 'https://docs.ventidole.com',
  },

  // Contact
  contact: {
    email: 'admin@ventidole.com',
    phone: '+1 (555) 123-4567',
  },

  // Social Media
  social: {
    twitter: 'https://twitter.com/ventidole',
    facebook: 'https://facebook.com/ventidole',
    linkedin: 'https://linkedin.com/company/ventidole',
    instagram: 'https://instagram.com/ventidole',
  },

  // Features
  features: {
    darkMode: true,
    notifications: true,
    analytics: true,
  },
} as const;
