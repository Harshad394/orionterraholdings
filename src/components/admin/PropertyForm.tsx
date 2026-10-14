'use client';

import { FormEvent, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Link as LinkIcon, Plus, Save, Trash2 } from 'lucide-react';
import {
  LAND_AREA_UNITS,
  OPPORTUNITY_TYPES,
  PRICE_VISIBILITY,
  PROPERTY_STATUS,
  PROPERTY_TYPES,
} from '@/constants/enums';
import { cn } from '@/lib/utils';

interface ImageItem {
  url: string;
  publicId: string;
}

interface PropertyFormValue {
  id?: string;
  title: string;
  propertyId: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
  };
  landArea: string;
  landAreaUnit: string;
  propertyType: string;
  opportunityType: string;
  price: string;
  priceVisibility: string;
  images: ImageItem[];
  featured: boolean;
  status: string;
  sellerSubmissionId?: string;
}

interface PropertyFormProps {
  mode: 'create' | 'edit';
  initialValue?: Partial<PropertyFormValue>;
  backHref?: string;
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white outline-none transition focus:border-amber-500/60';
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-400';

function emptyValue(): PropertyFormValue {
  return {
    title: '',
    propertyId: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'India',
      latitude: '',
      longitude: '',
    },
    landArea: '',
    landAreaUnit: 'sq.ft',
    propertyType: 'Residential',
    opportunityType: 'Direct Sale',
    price: '',
    priceVisibility: 'CONTACT',
    images: [],
    featured: false,
    status: 'DRAFT',
  };
}

export function PropertyForm({ mode, initialValue, backHref = '/admin/properties' }: PropertyFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const initial = useMemo<PropertyFormValue>(() => {
    const base = emptyValue();
    return {
      ...base,
      ...initialValue,
      location: {
        ...base.location,
        ...initialValue?.location,
      },
      images: initialValue?.images ?? [],
    };
  }, [initialValue]);

  const [form, setForm] = useState<PropertyFormValue>(initial);

  const setField = (field: keyof PropertyFormValue, value: string | boolean | ImageItem[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const setLocationField = (field: keyof PropertyFormValue['location'], value: string) => {
    setForm((current) => ({
      ...current,
      location: {
        ...current.location,
        [field]: value,
      },
    }));
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    setSuccess('');
    setIsUploading(true);

    try {
      const body = new FormData();
      Array.from(files).forEach((file) => body.append('images', file));

      const res = await fetch('/api/admin/images', {
        method: 'POST',
        body,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Image upload failed');
      }

      setForm((current) => ({
        ...current,
        images: [...current.images, ...json.data],
      }));
      setSuccess('Images uploaded successfully. Save the property to apply changes.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const addImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setError('Please enter a valid HTTP or HTTPS image URL.');
      return;
    }

    setForm((current) => ({
      ...current,
      images: [...current.images, { url: trimmed, publicId: '' }],
    }));
    setUrlInput('');
    setSuccess('Image URL added. Save the property to keep changes.');
  };

  const removeImage = async (index: number) => {
    const image = form.images[index];
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));

    if (mode === 'create' && image?.publicId) {
      await fetch('/api/admin/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: image.publicId }),
      });
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= form.images.length) return;
    setForm((current) => {
      const images = [...current.images];
      const [item] = images.splice(index, 1);
      images.splice(nextIndex, 0, item);
      return { ...current, images };
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      title: form.title,
      propertyId: form.propertyId,
      description: form.description,
      location: {
        address: form.location.address,
        city: form.location.city,
        state: form.location.state,
        country: form.location.country || 'India',
        latitude: form.location.latitude || null,
        longitude: form.location.longitude || null,
      },
      landArea: form.landArea,
      landAreaUnit: form.landAreaUnit,
      propertyType: form.propertyType,
      opportunityType: form.opportunityType,
      price: form.price || null,
      priceVisibility: form.priceVisibility,
      images: form.images,
      featured: form.featured,
      status: form.status,
      sellerSubmissionId: form.sellerSubmissionId || undefined,
    };

    startTransition(async () => {
      try {
        const url = mode === 'create' ? '/api/admin/properties' : `/api/admin/properties/${form.id}`;
        const res = await fetch(url, {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || 'Unable to save property');
        }

        setSuccess(mode === 'create' ? 'Property created successfully.' : 'Property updated successfully.');
        router.refresh();
        if (mode === 'create') {
          router.push(`/admin/properties/${json.data.id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to save property');
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm text-gray-300 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="btn-primary py-2.5 px-6 text-sm disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isPending ? 'Saving...' : 'Save Property'}</span>
        </button>
      </div>

      {(error || success) && (
        <div
          className={cn(
            'rounded-xl border px-4 py-3 text-sm font-medium',
            error ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
          )}
        >
          {error || success}
        </div>
      )}

      <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">Core Property Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Property Title *</label>
            <input className={inputClass} value={form.title} onChange={(e) => setField('title', e.target.value)} required placeholder="e.g. 20 Acre Prime Highway Commercial Land" />
          </div>
          <div>
            <label className={labelClass}>Property ID *</label>
            <input className={inputClass} value={form.propertyId} onChange={(e) => setField('propertyId', e.target.value)} required placeholder="e.g. OT-MH-010" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea
              className={cn(inputClass, 'min-h-32 resize-y')}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              required
              placeholder="Detailed property description, road access, frontage, zoning..."
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">Location Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Street Address / Area</label>
            <input className={inputClass} value={form.location.address} onChange={(e) => setLocationField('address', e.target.value)} placeholder="e.g. Sector 12, Ghodbunder Road" />
          </div>
          <div>
            <label className={labelClass}>City *</label>
            <input className={inputClass} value={form.location.city} onChange={(e) => setLocationField('city', e.target.value)} required placeholder="e.g. Thane" />
          </div>
          <div>
            <label className={labelClass}>State *</label>
            <input className={inputClass} value={form.location.state} onChange={(e) => setLocationField('state', e.target.value)} required placeholder="e.g. Maharashtra" />
          </div>
          <div>
            <label className={labelClass}>Country *</label>
            <input className={inputClass} value={form.location.country} onChange={(e) => setLocationField('country', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Latitude</label>
              <input className={inputClass} value={form.location.latitude} onChange={(e) => setLocationField('latitude', e.target.value)} inputMode="decimal" placeholder="19.2183" />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input className={inputClass} value={form.location.longitude} onChange={(e) => setLocationField('longitude', e.target.value)} inputMode="decimal" placeholder="72.9781" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">Listing Attributes & Pricing</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Land Area *</label>
            <input className={inputClass} value={form.landArea} onChange={(e) => setField('landArea', e.target.value)} inputMode="decimal" required placeholder="e.g. 45000" />
          </div>
          <div>
            <label className={labelClass}>Area Unit</label>
            <select className={inputClass} value={form.landAreaUnit} onChange={(e) => setField('landAreaUnit', e.target.value)}>
              {LAND_AREA_UNITS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Property Type</label>
            <select className={inputClass} value={form.propertyType} onChange={(e) => setField('propertyType', e.target.value)}>
              {PROPERTY_TYPES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Opportunity Type</label>
            <select className={inputClass} value={form.opportunityType} onChange={(e) => setField('opportunityType', e.target.value)}>
              {OPPORTUNITY_TYPES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input className={inputClass} value={form.price} onChange={(e) => setField('price', e.target.value)} inputMode="numeric" placeholder="e.g. 50000000" />
          </div>
          <div>
            <label className={labelClass}>Price Visibility</label>
            <select className={inputClass} value={form.priceVisibility} onChange={(e) => setField('priceVisibility', e.target.value)}>
              {PRICE_VISIBILITY.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Listing Status *</label>
            <select className={cn(inputClass, form.status === 'PUBLISHED' ? 'border-emerald-500/60 text-emerald-300' : 'border-amber-500/60 text-amber-300')} value={form.status} onChange={(e) => setField('status', e.target.value)}>
              {PROPERTY_STATUS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">
              {form.status === 'PUBLISHED' ? '✅ Visible on public /properties website.' : '⚠️ Set to PUBLISHED to show on public website.'}
            </p>
          </div>
          <div className="flex items-center pt-5">
            <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-white/10 bg-[#0A1120] px-4 py-2.5 text-sm text-gray-300 w-full">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField('featured', e.target.checked)}
                className="h-4 w-4 accent-amber-500 rounded"
              />
              <span className="font-semibold text-white">Mark as Featured Opportunity</span>
            </label>
          </div>
        </div>
      </section>

      {/* Property Images Section */}
      <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-base font-bold text-white">Property Images</h2>
            <p className="mt-0.5 text-xs text-gray-400">The first image will be used as the main cover photo.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <ImagePlus className="h-4 w-4" />
            <span>{isUploading ? 'Uploading to Cloudinary...' : 'Upload Image Files'}</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              multiple
              className="hidden"
              onChange={(event) => uploadImages(event.target.files)}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Option: Add Direct Image URL */}
        <div className="flex flex-col sm:flex-row gap-2 bg-[#0A1120] p-3 rounded-lg border border-white/5">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Or paste direct image URL (https://images.unsplash.com/...)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={addImageUrl}
            className="btn-secondary text-xs py-1.5 px-3 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add URL</span>
          </button>
        </div>

        {form.images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 px-4 py-10 text-center text-xs text-gray-500">
            No images uploaded yet. Upload images above or add a direct image URL.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 pt-2">
            {form.images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="overflow-hidden rounded-lg border border-white/10 bg-[#0A1120] group relative">
                <div className="aspect-[4/3] bg-black/20 relative">
                  <img src={image.url} alt="" className="h-full w-full object-cover" />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-black rounded shadow">
                      Cover
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-2 bg-[#111C2E]">
                  <span className="text-xs font-semibold text-gray-400">
                    {index === 0 ? 'Primary' : `Photo ${index + 1}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveImage(index, -1)} className="rounded p-1.5 text-gray-400 hover:bg-white/5 hover:text-white" title="Move up">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => moveImage(index, 1)} className="rounded p-1.5 text-gray-400 hover:bg-white/5 hover:text-white" title="Move down">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => removeImage(index)} className="rounded p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400" title="Remove image">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </form>
  );
}
