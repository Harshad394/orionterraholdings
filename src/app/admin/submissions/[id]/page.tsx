import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongodb';
import Property from '@/models/Property';
import SellerSubmission from '@/models/SellerSubmission';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { SubmissionStatusActions } from '@/components/admin/SubmissionStatusActions';
import { formatArea, formatPrice } from '@/lib/utils';
import { isValidObjectId, mapAdminProperty } from '@/services/admin-property.service';
import { mapAdminSubmission } from '@/services/admin-submission.service';

export const metadata = { title: 'Seller Submission | Orion Terra Admin' };

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailItem({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <div className="mt-1 text-sm text-gray-200">{value || <span className="text-gray-500">Not provided</span>}</div>
    </div>
  );
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectToDatabase();
  const submissionDoc = await SellerSubmission.findById(id).exec();
  if (!submissionDoc) notFound();

  const convertedDoc = await Property.findOne({ sellerSubmissionId: id }).exec();
  const submission = mapAdminSubmission(submissionDoc);
  const convertedProperty = convertedDoc ? mapAdminProperty(convertedDoc) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/admin/submissions" className="mb-3 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to submissions
          </Link>
          <h1 className="text-2xl font-bold text-white">{submission.sellerName}</h1>
          <p className="mt-1 text-sm text-gray-400">{submission.city}, {submission.state}</p>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
            <h2 className="mb-5 text-sm font-semibold text-white">Seller Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem label="Seller Name" value={submission.sellerName} />
              <DetailItem label="Phone" value={submission.phone} />
              <DetailItem label="Email" value={submission.email} />
              <DetailItem label="Company" value={submission.company} />
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
            <h2 className="mb-5 text-sm font-semibold text-white">Property Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem label="Location" value={submission.propertyLocation} />
              <DetailItem label="City / State" value={`${submission.city}, ${submission.state}`} />
              <DetailItem label="Land Area" value={formatArea(submission.landArea, submission.landAreaUnit)} />
              <DetailItem label="Property Type" value={submission.propertyType} />
              <DetailItem label="Opportunity Type" value={submission.opportunityType} />
              <DetailItem label="Expected Price" value={formatPrice(submission.expectedPrice, 'PUBLIC')} />
              <DetailItem label="Documents Available" value={submission.documentsAvailable} />
              <DetailItem label="Submitted" value={formatDate(submission.createdAt)} />
              <DetailItem label="Updated" value={formatDate(submission.updatedAt)} />
            </div>
            <div className="mt-5">
              <DetailItem label="Description" value={<p className="whitespace-pre-wrap leading-6">{submission.description}</p>} />
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
            <h2 className="mb-5 text-sm font-semibold text-white">Submitted Images</h2>
            {submission.images.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/10 px-4 py-10 text-center text-sm text-gray-500">
                No images submitted.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {submission.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="overflow-hidden rounded-lg border border-white/10 bg-[#0A1120]">
                    <div className="aspect-[4/3]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Review Status</h2>
            <SubmissionStatusActions submissionId={submission.id} currentStatus={submission.status} />
          </section>

          <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Property Listing</h2>
            {convertedProperty ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  This submission is linked to <span className="font-semibold text-white">{convertedProperty.title}</span>.
                </p>
                <Link
                  href={`/admin/properties/${convertedProperty.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Property
                </Link>
              </div>
            ) : submission.status === 'APPROVED' ? (
              <Link
                href={`/admin/properties/new?submissionId=${submission.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" />
                Create Property Listing
              </Link>
            ) : (
              <p className="text-sm text-gray-500">
                Approve this submission before creating a property listing.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
