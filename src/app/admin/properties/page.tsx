import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongodb';
import Property from '@/models/Property';
import { OPPORTUNITY_TYPES, PROPERTY_STATUS, PROPERTY_TYPES } from '@/constants/enums';
import { formatArea } from '@/lib/utils';
import { AdminPropertyActions } from '@/components/admin/AdminPropertyActions';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { adminPropertyQuerySchema } from '@/lib/validations/property';
import { escapeRegex, mapAdminProperty } from '@/services/admin-property.service';

export const metadata = { title: 'Properties | Orion Terra Admin' };

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

export default async function AdminPropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const query = adminPropertyQuerySchema.parse({
    search: value(raw, 'search') || '',
    status: value(raw, 'status') || '',
    city: value(raw, 'city') || '',
    propertyType: value(raw, 'propertyType') || '',
    opportunityType: value(raw, 'opportunityType') || '',
    page: value(raw, 'page') || 1,
    limit: 20,
  });

  await connectToDatabase();

  const filter: Record<string, unknown> = {};
  if (query.search.trim()) {
    const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
    filter.$or = [{ title: regex }, { propertyId: regex }, { slug: regex }];
  }
  if (query.status) filter.status = query.status;
  if (query.city.trim()) filter['location.city'] = new RegExp(`^${escapeRegex(query.city.trim())}$`, 'i');
  if (query.propertyType) filter.propertyType = query.propertyType;
  if (query.opportunityType) filter.opportunityType = query.opportunityType;

  const skip = (query.page - 1) * query.limit;
  const [docs, total] = await Promise.all([
    Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).exec(),
    Property.countDocuments(filter),
  ]);
  const properties = docs.map(mapAdminProperty);
  const totalPages = Math.ceil(total / query.limit) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Properties</h1>
          <p className="mt-1 text-sm text-gray-400">Create, edit, publish, feature, and delete listings.</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" />
          New Property
        </Link>
      </div>

      <form className="rounded-xl border border-white/10 bg-[#111C2E] p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <label className="relative md:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              name="search"
              defaultValue={query.search}
              placeholder="Title or ID"
              className="w-full rounded-lg border border-white/10 bg-[#0A1120] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-500/60"
            />
          </label>
          <input
            name="city"
            defaultValue={query.city}
            placeholder="City"
            className="rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/60"
          />
          <select name="status" defaultValue={query.status} className="rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white">
            <option value="">All statuses</option>
            {PROPERTY_STATUS.map((item) => <option key={item}>{item}</option>)}
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
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">No properties found.</td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="align-top hover:bg-white/[0.02]">
                    <td className="px-4 py-4">
                      <p className="font-medium text-white">{property.title}</p>
                      <p className="mt-1 text-xs text-gray-500">{property.propertyId}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {property.location.city}, {property.location.state}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      <p>{property.propertyType}</p>
                      <p className="mt-1 text-xs text-gray-500">{property.opportunityType}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{formatArea(property.landArea, property.landAreaUnit)}</td>
                    <td className="px-4 py-4"><StatusBadge status={property.status} /></td>
                    <td className="px-4 py-4 text-gray-300">{property.featured ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4 text-gray-400">{formatDate(property.createdAt)}</td>
                    <td className="px-4 py-4">
                      <AdminPropertyActions
                        id={property.id}
                        slug={property.slug}
                        title={property.title}
                        status={property.status}
                        featured={property.featured}
                      />
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
            {query.page > 1 && <Link className="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5" href={`/admin/properties?page=${query.page - 1}`}>Previous</Link>}
            {query.page < totalPages && <Link className="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5" href={`/admin/properties?page=${query.page + 1}`}>Next</Link>}
          </div>
        </div>
      )}
    </div>
  );
}
