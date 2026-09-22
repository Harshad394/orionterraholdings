import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PriceVisibility } from '@/types/property';
import { siteConfig } from '@/config/site';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Indian Rupee format (Cr / Lakh) or return "Price on Request"
 */
export function formatPrice(price?: number | null, visibility: PriceVisibility = 'CONTACT'): string {
  if (visibility === 'CONTACT' || price === null || price === undefined || price <= 0) {
    return 'Price on Request';
  }

  if (price >= 10000000) {
    const crValue = price / 10000000;
    return `₹${crValue % 1 === 0 ? crValue : crValue.toFixed(2)} Cr`;
  }

  if (price >= 100000) {
    const lakhValue = price / 100000;
    return `₹${lakhValue % 1 === 0 ? lakhValue : lakhValue.toFixed(2)} Lakh`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format land area with comma separators and unit
 */
export function formatArea(area: number, unit: string): string {
  return `${area.toLocaleString('en-IN')} ${unit}`;
}

/**
 * Generate a pre-filled WhatsApp link for a property inquiry or general inquiry
 */
export function getWhatsAppLink(propertyId?: string, propertyTitle?: string): string {
  const number = siteConfig.contact.whatsappNumber.replace(/[^0-9]/g, '');
  let text = 'Hello Orion Terra, I would like to inquire about land opportunities.';
  
  if (propertyId && propertyTitle) {
    text = `Hello Orion Terra, I am interested in property ${propertyId} (${propertyTitle}). Please share more details.`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
