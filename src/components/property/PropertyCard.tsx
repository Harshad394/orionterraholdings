import React from 'react';
import Link from 'next/link';
import { MapPin, Maximize2, Tag, ArrowRight } from 'lucide-react';
import { Property } from '@/types/property';
import { formatPrice, formatArea } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-card group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#142033] hover:border-amber-500/40 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]">
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
        <img
          src={mainImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142033] via-transparent to-black/20" />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="rounded-md bg-[#0B1320]/85 backdrop-blur-md border border-amber-500/30 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
            {property.propertyId}
          </span>
          <span className="rounded-md bg-amber-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-black shadow-sm">
            {property.opportunityType}
          </span>
        </div>

        {property.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="rounded-md bg-gradient-to-r from-amber-400 to-yellow-500 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold text-black uppercase tracking-wider shadow-md">
              ★ Featured
            </span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{property.location.city}, {property.location.state}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
            {property.title}
          </h3>
        </div>

        {/* Specs Pill Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-gray-300">
          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold text-white">{formatArea(property.landArea, property.landAreaUnit)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <Tag className="h-3.5 w-3.5 text-amber-400" />
            <span className="truncate font-medium">{property.propertyType}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              Investment / Price
            </span>
            <span className="text-base font-bold text-white gold-gradient-text">
              {formatPrice(property.price, property.priceVisibility)}
            </span>
          </div>

          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
