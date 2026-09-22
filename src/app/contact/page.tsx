import React from 'react';
import { Phone, Mail, MessageSquare, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { siteConfig } from '@/config/site';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Let&apos;s Talk About Land
        </h1>
        <p className="text-base text-gray-300">
          Have questions regarding a listed property, land redevelopment, or submitting your land? Connect with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">
              Direct Channels
            </h3>

            {/* Phone */}
            <a
              href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-start gap-4 group p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-medium">Phone Assistance</span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {siteConfig.contact.phone}
                </span>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 group p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-medium">WhatsApp Support</span>
                <span className="text-sm font-bold text-emerald-400 group-hover:underline">
                  Chat Instantly on WhatsApp
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-start gap-4 group p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-medium">Email Inquiry</span>
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {siteConfig.contact.email}
                </span>
              </div>
            </a>
          </div>

          {/* Office Address Placeholder */}
          <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>Office Location</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {siteConfig.contact.addressPlaceholder}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-2 border-t border-white/5">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span>Monday – Saturday: 9:30 AM – 6:30 PM IST</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
