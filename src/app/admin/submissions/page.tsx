import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongodb';
import SellerSubmission from '@/models/SellerSubmission';
import { OPPORTUNITY_TYPES, PROPERTY_TYPES, SUBMISSION_STATUS } from '@/constants/enums';
import { formatArea, formatPrice } from '@/lib/utils';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { adminSubmissionQuerySchema } from '@/lib/validations/seller-submission';
import { escapeRegex } from '@/services/admin-property.service';
import { mapAdminSubmission } from '@/services/admin-submission.service';

export const metadata = { title: 'Submissions | Orion Terra Admin' };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function value(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const item = searchParams[key];
  return Array.isArray(item) ? item[0] : item;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const query = adminSubmissionQuerySchema.parse({
    search: value(raw, 'search') || '',
    status: value(raw, 'status') || '',
    city: value(raw, 'city') || '',
    state: value(raw, 'state') || '',
    propertyType: value(raw, 'propertyType') || '',
    opportunityType: value(raw, 'opportunityType') || '',
    page: value(raw, 'page') || 1,
    limit: 20,
  });

  await connectToDatabase();

  const filter: Record<string, unknown> = {};
  if (query.search.trim()) {
    const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
    filter.$or = [
      { sellerName: regex },
      { phone: regex },
      { email: regex },
      { propertyLocation: regex },
      { city: regex },
      { state: regex },
    ];
  }
  if (query.status) filter.status = query.status;
  if (query.city.trim()) filter.city = new RegExp(`^${escapeRegex(query.city.trim())}$`, 'i');
  if (query.state.trim()) filter.state = new RegExp(`^${escapeRegex(query.state.trim())}$`, 'i');
  if (query.propertyType) filter.propertyType = query.propertyType;
  if (query.opportunityType) filter.opportunityType = query.opportunityType;

  const skip = (query.page - 1) * query.limit;
  const [docs, total] = await Promise.all([
    SellerSubmission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).exec(),
    SellerSubmission.countDocuments(filter),
  ]);
  const submissions = docs.map(mapAdminSubmission);
  const totalPages = Math.ceil(total / query.limit) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Seller Submissions</h1>
        <p className="mt-1 text-sm text-gray-400">Review seller details and approve listings for conversion.</p>
      </div>

      <form className="rounded-xl border border-white/10 bg-[#111C2E] p-4">
        <div className="grid gap-3 lg:grid-cols-6">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              name="search"
              defaultValue={query.search}
              placeholder="Seller, phone, location"
              className="w-full rounded-lg border border-white/10 bg-[#0A1120] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-500/60"
            />
          </label>
          <input name="city" defaultValue={query.city} placeholder="City" className="rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white" />
          <input name="state" defaultValue={query.state} placeholder="State" className="rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white" />
          <select name="status" defaultValue={query.status} className="rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white">
            <option value="">All statuses</option>
            {SUBMISSION_STATUS.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select name="propertyType" defaultValue={query.propertyType} className="rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white">
            <option value="">All property types</option>
            {PROPERTY_TYPES.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select name="opportunityType" defaultValue={query.opportunityType} className="rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white">
            <option value="">All opportunities</option>
            {OPPORTUNITY_TYPES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5">Apply Filters</button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111C2E]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Land</th>
                <th className="px-4 py-3">Opportunity</th>
                <th className="px-4 py-3">Expected Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">No seller submissions found.</td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission.id} className="align-top hover:bg-white/[0.02]">
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">{submission.sellerName}</p>
                      <p className="mt-1 text-xs text-gray-500">{submission.phone}</p>
                      {submission.email && <p className="mt-1 text-xs text-gray-500">{submission.email}</p>}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      <p>{submission.propertyLocation}</p>
                      <p className="mt-1 text-xs text-gray-500">{submission.city}, {submission.state}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      <p>{formatArea(submission.landArea, submission.landAreaUnit)}</p>
                      <p className="mt-1 text-xs text-gray-500">{submission.propertyType}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{submission.opportunityType}</td>
                    <td className="px-4 py-4 text-gray-300">{formatPrice(submission.expectedPrice, 'PUBLIC')}</td>
                    <td className="px-4 py-4"><StatusBadge status={submission.status} /></td>
                    <td className="px-4 py-4 text-gray-400">{formatDate(submission.createdAt)}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/submissions/${submission.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
                        title="Review submission"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Page {query.page} of {totalPages}</span>
          <div className="flex gap-2">
            {query.page > 1 && <Link className="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5" href={`/admin/submissions?page=${query.page - 1}`}>Previous</Link>}
            {query.page < totalPages && <Link className="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5" href={`/admin/submissions?page=${query.page + 1}`}>Next</Link>}
          </div>
        </div>
      )}
    </div>
  );
}
