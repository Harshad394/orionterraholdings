import React from 'react';
import { getPublishedProperties } from '@/services/property.service';
import { PropertiesClient } from './PropertiesClient';
import { MOCK_PROPERTIES } from '@/data/mockProperties';
import { Property as PropertyDTO } from '@/types/property';

// Fast ISR caching with instant revalidation on admin actions
export const revalidate = 10;

export default async function PropertiesPage() {
  let initialProperties: PropertyDTO[] = [];
  try {
    const result = await getPublishedProperties({ page: 1, limit: 50 });
    initialProperties = result.data;
  } catch (error) {
    console.warn('MongoDB query warning in PropertiesPage, falling back to mock dataset:', error);
  }

  // Fallback to MOCK_PROPERTIES only if DB returns 0 properties
  const propertiesToDisplay = initialProperties.length > 0 ? initialProperties : MOCK_PROPERTIES;

  return <PropertiesClient initialProperties={propertiesToDisplay} />;
}
