import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  PROPERTY_TYPES,
  OPPORTUNITY_TYPES,
  LAND_AREA_UNITS,
  PRICE_VISIBILITY,
  PROPERTY_STATUS,
  PropertyTypeEnum,
  OpportunityTypeEnum,
  LandAreaUnitEnum,
  PriceVisibilityEnum,
  PropertyStatusEnum,
} from '@/constants/enums';

export interface IPropertyLocation {
  address?: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface IProperty extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  propertyId: string;
  description: string;
  location: IPropertyLocation;
  landArea: number;
  landAreaUnit: LandAreaUnitEnum;
  propertyType: PropertyTypeEnum;
  opportunityType: OpportunityTypeEnum;
  price?: number | null;
  priceVisibility: PriceVisibilityEnum;
  images: string[];           // Array of image URLs (Unsplash or Cloudinary)
  imagePublicIds: string[];   // Cloudinary public IDs — parallel to images, empty for legacy images
  featured: boolean;
  status: PropertyStatusEnum;
  sellerSubmissionId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyLocationSchema = new Schema<IPropertyLocation>(
  {
    address: { type: String, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true, index: true },
    country: { type: String, default: 'India', trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    propertyId: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    location: { type: PropertyLocationSchema, required: true },
    landArea: { type: Number, required: true, min: 0 },
    landAreaUnit: {
      type: String,
      required: true,
      enum: LAND_AREA_UNITS,
    },
    propertyType: {
      type: String,
      required: true,
      enum: PROPERTY_TYPES,
      index: true,
    },
    opportunityType: {
      type: String,
      required: true,
      enum: OPPORTUNITY_TYPES,
      index: true,
    },
    price: { type: Number, default: null },
    priceVisibility: {
      type: String,
      required: true,
      enum: PRICE_VISIBILITY,
      default: 'CONTACT',
    },
    images: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      required: true,
      enum: PROPERTY_STATUS,
      default: 'DRAFT',
      index: true,
    },
    sellerSubmissionId: {
      type: Schema.Types.ObjectId,
      ref: 'SellerSubmission',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal search and filtering
PropertySchema.index({ status: 1, createdAt: -1 });
PropertySchema.index({ status: 1, featured: 1, createdAt: -1 });
PropertySchema.index({ status: 1, 'location.city': 1 });
PropertySchema.index({ status: 1, 'location.state': 1 });
PropertySchema.index({ status: 1, propertyType: 1 });
PropertySchema.index({ status: 1, opportunityType: 1 });
PropertySchema.index({ createdAt: -1 });

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
