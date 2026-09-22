import Link from 'next/link';
import connectToDatabase from '@/lib/db/mongodb';
import Property from '@/models/Property';
import SellerSubmission from '@/models/SellerSubmission';
import { PropertyForm } from '@/components/admin/PropertyForm';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { isValidObjectId } from '@/services/admin-property.service';

export const metadata = { title: 'New Property | Orion Terra Admin' };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function value(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const item = searchParams[key];
  return Array.isArray(item) ? item[0] : item;
}

export default async function NewPropertyPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const submissionId = value(raw, 'submissionId');

  let initialValue = undefined;
  let existingProperty: { id: string; title: string } | null = null;
  let submissionStatus: string | null = null;

  if (submissionId && isValidObjectId(submissionId)) {
    await connectToDatabase();
    const [submission, converted] = await Promise.all([
      SellerSubmission.findById(submissionId).exec(),
      Property.findOne({ sellerSubmissionId: submissionId }).exec(),
    ]);

    if (converted) {
      existingProperty = {
        id: converted._id.toString(),
        title: converted.title,
      };
    }

    if (submission) {
      submissionStatus = submission.status;
      initialValue = {
        title: `${submission.landArea} ${submission.landAreaUnit} ${submission.propertyType} Land in ${submission.city}`,
        propertyId: '',
        description: submission.description,
        location: {
          address: submission.propertyLocation,
          city: submission.city,
          state: submission.state,
          country: 'India',
          latitude: '',
          longitude: '',
        },
        landArea: String(submission.landArea),
        landAreaUnit: submission.landAreaUnit,
        propertyType: submission.propertyType,
        opportunityType: submission.opportunityType,
        price: submission.expectedPrice ? String(submission.expectedPrice) : '',
        priceVisibility: 'CONTACT',
        images: (submission.images || []).map((url) => ({ url, publicId: '' })),
        featured: false,
        status: 'DRAFT',
        sellerSubmissionId: submission._id.toString(),
      };
    }
  }

  if (existingProperty) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Create Property</h1>
          <p className="mt-1 text-sm text-gray-400">This seller submission is already linked to a property.</p>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-5">
          <p className="text-sm text-amber-100">
            A property has already been created from this submission: <span className="font-semibold">{existingProperty.title}</span>
          </p>
          <Link
            href={`/admin/properties/${existingProperty.id}`}
            className="mt-4 inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400"
          >
            Open Existing Property
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create Property</h1>
        <p className="mt-1 text-sm text-gray-400">New listings default to draft unless you explicitly publish them.</p>
      </div>

      {submissionId && submissionStatus && (
        <div className="rounded-xl border border-white/10 bg-[#111C2E] p-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span>Prefilled from seller submission</span>
            <StatusBadge status={submissionStatus} />
            {submissionStatus !== 'APPROVED' && (
              <span className="text-amber-300">Approve the submission before saving this property.</span>
            )}
          </div>
        </div>
      )}

      <PropertyForm mode="create" initialValue={initialValue} backHref={submissionId ? `/admin/submissions/${submissionId}` : '/admin/properties'} />
    </div>
  );
}
