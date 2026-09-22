import React from 'react';
import { siteConfig } from '@/config/site';

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
      <div className="border-b border-white/10 pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Legal & Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Last updated: February 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Introduction</h2>
          <p>
            At Orion Terra, accessible from our web platform, protecting the privacy of our visitors, landowners, buyers, and developers is paramount. This Privacy Policy document outlines the types of information collected and how it is used.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide when inquiring about a property or submitting your land details. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
            <li>Full Name, Phone Number, and Email Address.</li>
            <li>Property address, city, land area, survey details, and seller expectations.</li>
            <li>Messages submitted through buyer inquiry or contact forms.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
            <li>Evaluate land seller submissions and qualify opportunities.</li>
            <li>Respond to buyer inquiries and facilitate offline communication between relevant parties.</li>
            <li>Improve website functionality and catalog discovery.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Confidentiality of Seller Contact Details</h2>
          <p>
            Landowner personal contact details (phone number, email address) are strictly protected by Orion Terra admin workflows and are NEVER published on the public website catalog without explicit permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
          <p>
            For privacy inquiries or data update requests, reach out to us at{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-emerald-400 underline">
              {siteConfig.contact.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
