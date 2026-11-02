import { SystemConfiguration } from '../models/SystemConfiguration.js';

export const getAllowedEmailDomains = async (): Promise<string[]> => {
  try {
    const config = await SystemConfiguration.findOne({ key: 'allowedEmailDomains' });
    if (config && Array.isArray(config.value) && config.value.length > 0) {
      return config.value.map((d: string) => d.trim().toLowerCase());
    }
  } catch (err) {
    console.warn('Could not load allowed domains from DB, using env fallback');
  }

  const envDomains = process.env.UNIVERSITY_EMAIL_DOMAINS || 'silicon.ac.in';
  return envDomains.split(',').map((d) => d.trim().toLowerCase());
};

export const isAllowedEmailDomain = async (email: string): Promise<boolean> => {
  const allowed = await getAllowedEmailDomains();
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return allowed.includes(domain);
};

