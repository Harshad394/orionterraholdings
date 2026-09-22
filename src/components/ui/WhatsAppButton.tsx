'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

interface WhatsAppButtonProps {
  propertyId?: string;
  propertyTitle?: string;
  className?: string;
}

export function WhatsAppButton({ propertyId, propertyTitle, className }: WhatsAppButtonProps) {
  const link = getWhatsAppLink(propertyId, propertyTitle);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-xl hover:bg-emerald-400 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0B1320] ${className || ''}`}
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="h-5 w-5 fill-current" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
