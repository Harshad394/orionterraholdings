import connectToDatabase from '@/lib/db/mongodb';
import Property, { IProperty } from '@/models/Property';
import { propertyQuerySchema, PropertyQueryInput } from '@/lib/validations/property';
import { Property as PropertyDTO } from '@/types/property';

export function mapPropertyToDTO(doc: IProperty): PropertyDTO {
  return {
    id: doc._id.toString(),
    propertyId: doc.propertyId,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    location: {
      address: doc.location.address,
      city: doc.location.city,
      state: doc.location.state,
      country: doc.location.country,
      latitude: doc.location.latitude,
      longitude: doc.location.longitude,
    },
    landArea: doc.landArea,
    landAreaUnit: doc.landAreaUnit,
    propertyType: doc.propertyType,
    opportunityType: doc.opportunityType,
    price: doc.priceVisibility === 'PUBLIC' ? doc.price : null,
    priceVisibility: doc.priceVisibility,
    images: doc.images || [],
    featured: doc.featured || false,
    status: doc.status,
    sellerSubmissionId: doc.sellerSubmissionId ? doc.sellerSubmissionId.toString() : undefined,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function getPublishedProperties(params: PropertyQueryInput = {}) {
  await connectToDatabase();

  const validated = propertyQuerySchema.parse(params);

  const {
    page,
    limit,
    search,
    city,
    state,
    propertyType,
    opportunityType,
    priceVisibility,
    featured,
    minArea,
    maxArea,
  } = validated;

  const filterQuery: Record<string, unknown> = {
    status: 'PUBLISHED',
  };

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filterQuery.$or = [
      { title: searchRegex },
      { propertyId: searchRegex },
      { 'location.city': searchRegex },
      { 'location.state': searchRegex },
      { 'location.address': searchRegex },
    ];
  }

  if (city && city.trim()) {
    filterQuery['location.city'] = new RegExp(`^${city.trim()}$`, 'i');
  }

  if (state && state.trim()) {
    filterQuery['location.state'] = new RegExp(`^${state.trim()}$`, 'i');
  }

  if (propertyType && propertyType.trim()) {
    filterQuery.propertyType = propertyType;
  }

  if (opportunityType && opportunityType.trim()) {
    filterQuery.opportunityType = opportunityType;
  }

  if (priceVisibility && priceVisibility.trim()) {
    filterQuery.priceVisibility = priceVisibility;
  }

  if (featured !== undefined) {
    filterQuery.featured = featured;
  }

  if (minArea !== undefined || maxArea !== undefined) {
    const areaRange: Record<string, number> = {};
    if (minArea !== undefined) areaRange.$gte = minArea;
    if (maxArea !== undefined) areaRange.$lte = maxArea;
    filterQuery.landArea = areaRange;
  }

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Property.find(filterQuery)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    Property.countDocuments(filterQuery),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data: docs.map(mapPropertyToDTO),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getPublishedPropertyBySlug(slug: string): Promise<PropertyDTO | null> {
  await connectToDatabase();

  const doc = await Property.findOne({ slug, status: 'PUBLISHED' }).exec();
  if (!doc) {
    return null;
  }

  return mapPropertyToDTO(doc);
}

export async function getPublishedPropertyById(id: string): Promise<PropertyDTO | null> {
  await connectToDatabase();

  const doc = await Property.findOne({ _id: id, status: 'PUBLISHED' }).exec();
  if (!doc) {
    return null;
  }

  return mapPropertyToDTO(doc);
}
