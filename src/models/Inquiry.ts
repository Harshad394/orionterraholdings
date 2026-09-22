import mongoose, { Schema, Document, Model } from 'mongoose';
import { INQUIRY_STATUS, InquiryStatusEnum } from '@/constants/enums';

export interface IInquiry extends Document {
  _id: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: InquiryStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: INQUIRY_STATUS,
      default: 'NEW',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

InquirySchema.index({ propertyId: 1, status: 1 });
InquirySchema.index({ status: 1, createdAt: -1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
