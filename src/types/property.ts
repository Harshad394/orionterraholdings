export type PropertyType =
  | "Residential"
  | "Commercial"
  | "Industrial"
  | "Agricultural"
  | "Mixed Use"
  | "Other";

export type OpportunityType =
  | "Direct Sale"
  | "Redevelopment"
  | "Joint Venture"
  | "Long-term Development"
  | "Investment"
  | "Other";

export type LandAreaUnit = "sq.ft" | "sq.m" | "acre" | "hectare" | "guntha" | "other";

export type PriceVisibility = "PUBLIC" | "CONTACT";

export type PropertyStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

export type SubmissionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "MORE_INFORMATION_REQUIRED";

export type InquiryStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED";

export interface LocationInfo {
  address?: string;
  city: string;
  state: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface Property {
  id: string;
  _id?: string;
  propertyId: string; // e.g. OT-MH-001
  slug: string;
  title: string;
  description: string;
  location: LocationInfo;
  landArea: number;
  landAreaUnit: LandAreaUnit;
  propertyType: PropertyType;
  opportunityType: OpportunityType;
  price?: number | null; // Price in INR
  priceVisibility: PriceVisibility;
  images: string[];
  featured: boolean;
  status: PropertyStatus;
  sellerSubmissionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterOptions {
  search?: string;
  city?: string;
  propertyType?: string;
  opportunityType?: string;
  minArea?: number;
  maxArea?: number;
  priceVisibility?: string;
  featuredOnly?: boolean;
}
