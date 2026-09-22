'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { PropertyType, OpportunityType } from '@/types/property';

interface PropertyFilterState {
  search: string;
  propertyType: string;
  opportunityType: string;
  city: string;
}

interface PropertyFiltersProps {
  filters: PropertyFilterState;
  onFilterChange: (newFilters: Partial<PropertyFilterState>) => void;
  onReset: () => void;
  totalCount: number;
}

const PROPERTY_TYPES: PropertyType[] = [
  'Residential',
  'Commercial',
  'Industrial',
  'Agricultural',
  'Mixed Use',
  'Other',
];

const OPPORTUNITY_TYPES: OpportunityType[] = [
  'Direct Sale',
  'Redevelopment',
  'Joint Venture',
  'Long-term Development',
  'Investment',
  'Other',
];

const CITIES = ['Thane', 'Mumbai', 'Navi Mumbai', 'Pune', 'Raigad'];

export function PropertyFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
}: PropertyFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.propertyType || filters.opportunityType || filters.city;

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-[#111C2E] p-4 sm:p-6 mb-8 shadow-xl">
      {/* Search Input Row */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search location, city, title, or Property ID (e.g. OT-MH-001)..."
          className="w-full rounded-lg bg-[#17243A] border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
        />
      </div>

      {/* Filter Selects Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* City Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">City / Region</label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange({ city: e.target.value })}
            className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Property Type</label>
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange({ propertyType: e.target.value })}
            className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Property Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Opportunity Type Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Opportunity Type</label>
          <select
            value={filters.opportunityType}
            onChange={(e) => onFilterChange({ opportunityType: e.target.value })}
            className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Opportunities</option>
            {OPPORTUNITY_TYPES.map((opp) => (
              <option key={opp} value={opp}>
                {opp}
              </option>
            ))}
          </select>
        </div>

        {/* Reset / Status button */}
        <div className="flex items-end">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-center px-3 py-2 text-xs text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <span>{totalCount} Opportunities Found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
