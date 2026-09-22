import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db/mongodb';
import Property from '@/models/Property';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { isValidObjectId, mapAdminProperty } from '@/services/admin-property.service';

export const metadata = { title: 'Edit Property | Orion Terra Admin' };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectToDatabase();
  const doc = await Property.findById(id).exec();
  if (!doc) notFound();

  const property = mapAdminProperty(doc);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Property</h1>
        <p className="mt-1 text-sm text-gray-400">
          {property.propertyId} · {property.slug}
        </p>
      </div>
      <PropertyForm
        mode="edit"
        initialValue={{
          id: property.id,
          title: property.title,
          propertyId: property.propertyId,
          description: property.description,
          location: {
            address: property.location.address || '',
            city: property.location.city,
            state: property.location.state,
            country: property.location.country || 'India',
            latitude: property.location.latitude !== undefined ? String(property.location.latitude) : '',
            longitude: property.location.longitude !== undefined ? String(property.location.longitude) : '',
          },
          landArea: String(property.landArea),
          landAreaUnit: property.landAreaUnit,
          propertyType: property.propertyType,
          opportunityType: property.opportunityType,
          price: property.price ? String(property.price) : '',
          priceVisibility: property.priceVisibility,
          images: property.images,
          featured: property.featured,
          status: property.status,
          sellerSubmissionId: property.sellerSubmissionId,
        }}
      />
    </div>
  );
}
