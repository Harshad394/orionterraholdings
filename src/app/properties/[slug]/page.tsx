import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ArrowLeft, Phone, Map, MessageSquare, Send } from 'lucide-react';
import { getPublishedPropertyBySlug } from '@/services/property.service';
import { getMockPropertyBySlug, MOCK_PROPERTIES } from '@/data/mockProperties';
import { PropertyGallery, PropertyInfo } from '@/components/property/PropertyGallery';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { getWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface PropertyDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return MOCK_PROPERTIES.map((property) => ({
    slug: property.slug,
  }));
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  let property = null;

  try {
    property = await getPublishedPropertyBySlug(slug);
  } catch (error) {
    console.warn('MongoDB query warning for slug, falling back to mock dataset:', error);
  }

  if (!property) {
    property = getMockPropertyBySlug(slug) || null;
  }

  if (!property || property.status !== 'PUBLISHED') {
    notFound();
  }

  const whatsappLink = getWhatsAppLink(property.propertyId, property.title);

  return (
    <div className="pb-24 md:pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Properties</span>
          </Link>
        </div>

        {/* Property Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
              {property.propertyId}
            </span>
            <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
              {property.opportunityType}
            </span>
            {property.featured && (
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
                Featured Opportunity
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span>
              {property.location.address ? `${property.location.address}, ` : ''}
              {property.location.city}, {property.location.state}
            </span>
          </div>
        </div>

        {/* Main Grid: Gallery & Information vs Inquiry Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Gallery & Description */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery images={property.images} title={property.title} />

            <PropertyInfo property={property} />

            {/* Description */}
            <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white border-b border-white/10 pb-3">
                About This Opportunity
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Location Section */}
            <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xl font-bold text-white border-b border-white/10 pb-3">
                <Map className="h-5 w-5 text-emerald-400" />
                <h2>Location & Micro-Market Context</h2>
              </div>
              <div className="rounded-xl bg-[#17243A] p-6 border border-white/5 space-y-2">
                <p className="text-base font-semibold text-white">
                  {property.location.city}, {property.location.state}
                </p>
                {property.location.address && (
                  <p className="text-xs text-gray-400">{property.location.address}</p>
                )}
                <p className="text-xs text-gray-400 pt-2 border-t border-white/5">
                  Exact survey numbers and site visits are facilitated by Orion Terra representatives upon initial inquiry qualification.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form & Quick Contact */}
          <div className="space-y-6" id="inquiry-form">
            <InquiryForm propertyId={property.id || property.propertyId} propertyTitle={property.title} />

            <div className="rounded-2xl border border-white/10 bg-[#142033] p-6 text-center space-y-4">
              <h3 className="text-base font-bold text-white">Prefer Direct Assistance?</h3>
              <p className="text-xs text-gray-400">
                Speak directly with an Orion Terra land advisor regarding title details, site visit scheduling, or seller negotiation.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="btn-secondary w-full py-2.5 text-xs justify-center flex items-center gap-2"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Call {siteConfig.contact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile Screens */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B1320]/95 backdrop-blur-md p-3 md:hidden flex items-center gap-3">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold flex-1 py-2.5 text-xs justify-center flex items-center gap-1.5"
        >
          <MessageSquare className="h-4 w-4 fill-current" />
          <span>WhatsApp</span>
        </a>
        <a
          href="#inquiry-form"
          className="btn-primary flex-1 py-2.5 text-xs justify-center flex items-center gap-1.5"
        >
          <Send className="h-4 w-4" />
          <span>Send Inquiry</span>
        </a>
      </div>
    </div>
  );
}
