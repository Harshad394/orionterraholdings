'use client';

import React, { useState, useMemo } from 'react';
import { Property } from '@/types/property';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyFilters } from '@/components/property/PropertyFilters';

interface PropertiesClientProps {
  initialProperties: Property[];
}

export function PropertiesClient({ initialProperties }: PropertiesClientProps) {
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    opportunityType: '',
    city: '',
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      propertyType: '',
      opportunityType: '',
      city: '',
    });
  };

  const filteredProperties = useMemo(() => {
    return initialProperties.filter((prop) => {
      // Must be published
      if (prop.status !== 'PUBLISHED') return false;

      // Search matching (title, location, city, propertyId)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesCity = prop.location.city.toLowerCase().includes(q);
        const matchesAddress = prop.location.address?.toLowerCase().includes(q) || false;
        const matchesId = prop.propertyId.toLowerCase().includes(q);

        if (!matchesTitle && !matchesCity && !matchesAddress && !matchesId) {
          return false;
        }
      }

      // City filter
      if (filters.city && prop.location.city !== filters.city) {
        return false;
      }

      // Property type filter
      if (filters.propertyType && prop.propertyType !== filters.propertyType) {
        return false;
      }

      // Opportunity type filter
      if (filters.opportunityType && prop.opportunityType !== filters.opportunityType) {
        return false;
      }

      return true;
    });
  }, [initialProperties, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Land Opportunities Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Explore Land Properties
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
          Browse verified land opportunities available for acquisition, redevelopment, joint ventures, and strategic investment.
        </p>
      </div>

      {/* Filters & Search */}
      <PropertyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        totalCount={filteredProperties.length}
      />

      {/* Properties Grid */}
      <PropertyGrid properties={filteredProperties} onResetFilters={handleReset} />
    </div>
  );
}
