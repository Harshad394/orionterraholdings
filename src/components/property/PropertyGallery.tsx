'use client';

import React, { useState } from 'react';
import { Property } from '@/types/property';
import { formatArea, formatPrice } from '@/lib/utils';
import { Maximize2, Tag, Briefcase, IndianRupee, ShieldCheck } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
  const galleryImages = images.length > 0 ? images : [fallbackImage];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111C2E] shadow-2xl">
        <img
          src={galleryImages[activeImageIndex]}
          alt={`${title} - image ${activeImageIndex + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-transparent to-black/20" />
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border transition-all ${
                activeImageIndex === idx
                  ? 'border-emerald-500 ring-2 ring-emerald-500/50'
                  : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface PropertyInfoProps {
  property: Property;
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 space-y-6">
      <h2 className="text-lg font-bold text-white uppercase tracking-wider text-emerald-400">
        Property Key Specifications
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="rounded-xl bg-[#17243A] p-4 border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Maximize2 className="h-4 w-4 text-emerald-400" />
            <span>Land Area</span>
          </div>
          <p className="text-base font-bold text-white">
            {formatArea(property.landArea, property.landAreaUnit)}
          </p>
        </div>

        <div className="rounded-xl bg-[#17243A] p-4 border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Tag className="h-4 w-4 text-amber-400" />
            <span>Property Type</span>
          </div>
          <p className="text-base font-bold text-white">{property.propertyType}</p>
        </div>

        <div className="rounded-xl bg-[#17243A] p-4 border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Briefcase className="h-4 w-4 text-emerald-400" />
            <span>Opportunity</span>
          </div>
          <p className="text-base font-bold text-white">{property.opportunityType}</p>
        </div>

        <div className="rounded-xl bg-[#17243A] p-4 border border-white/5 space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <IndianRupee className="h-4 w-4 text-amber-400" />
            <span>Investment / Price</span>
          </div>
          <p className="text-base font-bold text-white gold-gradient-text">
            {formatPrice(property.price, property.priceVisibility)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>
          Opportunity curated & presented by Orion Terra for deal facilitation. Legal verification and title check are conducted offline during negotiations.
        </span>
      </div>
    </div>
  );
}
