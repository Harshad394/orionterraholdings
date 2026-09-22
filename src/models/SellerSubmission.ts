import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  PROPERTY_TYPES,
  OPPORTUNITY_TYPES,
  LAND_AREA_UNITS,
  SUBMISSION_STATUS,
  DOCUMENTS_AVAILABLE,
  PropertyTypeEnum,
  OpportunityTypeEnum,
  LandAreaUnitEnum,
  SubmissionStatusEnum,
  DocumentsAvailableEnum,
} from '@/constants/enums';

export interface ISellerSubmission extends Document {
  _id: mongoose.Types.ObjectId;
  sellerName: string;
  phone: string;
  email?: string;
  company?: string;
  propertyLocation: string;
  city: string;
  state: string;
  landArea: number;
  landAreaUnit: LandAreaUnitEnum;
  propertyType: PropertyTypeEnum;
  opportunityType: OpportunityTypeEnum;
  expectedPrice?: number | null;
  description: string;
  images: string[];
  documentsAvailable: DocumentsAvailableEnum;
  status: SubmissionStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSubmissionSchema = new Schema<ISellerSubmission>(
  {
    sellerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    company: { type: String, trim: true },
    propertyLocation: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    state: { type: String, required: true, trim: true, index: true },
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
    },
    opportunityType: {
      type: String,
      required: true,
      enum: OPPORTUNITY_TYPES,
    },
    expectedPrice: { type: Number, default: null },
    description: { type: String, default: '', trim: true },
    images: { type: [String], default: [] },
    documentsAvailable: {
      type: String,
      enum: DOCUMENTS_AVAILABLE,
      default: 'Yes',
    },
    status: {
      type: String,
      required: true,
      enum: SUBMISSION_STATUS,
      default: 'PENDING',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

SellerSubmissionSchema.index({ status: 1, createdAt: -1 });
SellerSubmissionSchema.index({ city: 1, state: 1 });

const SellerSubmission: Model<ISellerSubmission> =
  mongoose.models.SellerSubmission ||
  mongoose.model<ISellerSubmission>('SellerSubmission', SellerSubmissionSchema);

export default SellerSubmission;
