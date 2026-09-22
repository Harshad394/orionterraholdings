export const PROPERTY_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Agricultural',
  'Mixed Use',
  'Other',
] as const;

export type PropertyTypeEnum = (typeof PROPERTY_TYPES)[number];

export const OPPORTUNITY_TYPES = [
  'Direct Sale',
  'Redevelopment',
  'Joint Venture',
  'Long-term Development',
  'Investment',
  'Other',
] as const;

export type OpportunityTypeEnum = (typeof OPPORTUNITY_TYPES)[number];

export const LAND_AREA_UNITS = [
  'sq.ft',
  'sq.m',
  'acre',
  'hectare',
  'guntha',
  'other',
] as const;

export type LandAreaUnitEnum = (typeof LAND_AREA_UNITS)[number];

export const PRICE_VISIBILITY = ['PUBLIC', 'CONTACT'] as const;
export type PriceVisibilityEnum = (typeof PRICE_VISIBILITY)[number];

export const PROPERTY_STATUS = ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'] as const;
export type PropertyStatusEnum = (typeof PROPERTY_STATUS)[number];

export const SUBMISSION_STATUS = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'MORE_INFORMATION_REQUIRED',
] as const;
export type SubmissionStatusEnum = (typeof SUBMISSION_STATUS)[number];

export const INQUIRY_STATUS = [
  'NEW',
  'CONTACTED',
  'IN_PROGRESS',
  'CLOSED',
] as const;
export type InquiryStatusEnum = (typeof INQUIRY_STATUS)[number];

export const DOCUMENTS_AVAILABLE = ['Yes', 'No', 'Not sure'] as const;
export type DocumentsAvailableEnum = (typeof DOCUMENTS_AVAILABLE)[number];
