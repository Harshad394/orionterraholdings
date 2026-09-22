'use client';

import { FormEvent, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Save, Trash2 } from 'lucide-react';
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
  'w-full rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500/60';
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500';

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
      setSuccess('Images uploaded. Save the property to keep these changes.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
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
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? 'Saving...' : 'Save Property'}
        </button>
      </div>

      {(error || success) && (
        <div
          className={cn(
            'rounded-lg border px-4 py-3 text-sm',
            error ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          )}
        >
          {error || success}
        </div>
      )}

      <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
        <h2 className="mb-5 text-sm font-semibold text-white">Core Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={form.title} onChange={(e) => setField('title', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Property ID</label>
            <input className={inputClass} value={form.propertyId} onChange={(e) => setField('propertyId', e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              className={cn(inputClass, 'min-h-32 resize-y')}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
        <h2 className="mb-5 text-sm font-semibold text-white">Location</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input className={inputClass} value={form.location.address} onChange={(e) => setLocationField('address', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input className={inputClass} value={form.location.city} onChange={(e) => setLocationField('city', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input className={inputClass} value={form.location.state} onChange={(e) => setLocationField('state', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input className={inputClass} value={form.location.country} onChange={(e) => setLocationField('country', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Latitude</label>
              <input className={inputClass} value={form.location.latitude} onChange={(e) => setLocationField('latitude', e.target.value)} inputMode="decimal" />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input className={inputClass} value={form.location.longitude} onChange={(e) => setLocationField('longitude', e.target.value)} inputMode="decimal" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
        <h2 className="mb-5 text-sm font-semibold text-white">Listing Attributes</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Land Area</label>
            <input className={inputClass} value={form.landArea} onChange={(e) => setField('landArea', e.target.value)} inputMode="decimal" required />
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
            <label className={labelClass}>Price</label>
            <input className={inputClass} value={form.price} onChange={(e) => setField('price', e.target.value)} inputMode="numeric" />
          </div>
          <div>
            <label className={labelClass}>Price Visibility</label>
            <select className={inputClass} value={form.priceVisibility} onChange={(e) => setField('priceVisibility', e.target.value)}>
              {PRICE_VISIBILITY.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => setField('status', e.target.value)}>
              {PROPERTY_STATUS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A1120] px-3 py-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setField('featured', e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            Featured
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#111C2E] p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Images</h2>
            <p className="mt-1 text-xs text-gray-500">The first image is used as the cover image.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-500/15">
            <ImagePlus className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Images'}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(event) => uploadImages(event.target.files)}
              disabled={isUploading}
            />
          </label>
        </div>

        {form.images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 px-4 py-10 text-center text-sm text-gray-500">
            No images uploaded.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {form.images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="overflow-hidden rounded-lg border border-white/10 bg-[#0A1120]">
                <div className="aspect-[4/3] bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between gap-2 p-2">
                  <span className="text-xs text-gray-500">{index === 0 ? 'Cover' : `Image ${index + 1}`}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveImage(index, -1)} className="rounded p-1.5 text-gray-400 hover:bg-white/5 hover:text-white" title="Move up">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => moveImage(index, 1)} className="rounded p-1.5 text-gray-400 hover:bg-white/5 hover:text-white" title="Move down">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => removeImage(index)} className="rounded p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-300" title="Remove image">
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
