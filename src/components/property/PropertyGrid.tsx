import React from 'react';
import { Property } from '@/types/property';
import { PropertyCard } from './PropertyCard';
import { SearchX } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  onResetFilters?: () => void;
}

export function PropertyGrid({ properties, onResetFilters }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center my-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
          <SearchX className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Land Properties Found</h3>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          We couldn&apos;t find any land opportunities matching your current search or filter criteria. Try adjusting your parameters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="btn-secondary text-sm px-5 py-2.5"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.id || property.propertyId} property={property} />
      ))}
    </div>
  );
}
