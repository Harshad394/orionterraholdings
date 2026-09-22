'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Pencil, Star, Trash2, UploadCloud, EyeOff } from 'lucide-react';

interface AdminPropertyActionsProps {
  id: string;
  slug: string;
  title: string;
  status: string;
  featured: boolean;
}

async function patchJson(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || 'Request failed');
  }
  return json;
}

export function AdminPropertyActions({
  id,
  slug,
  title,
  status,
  featured,
}: AdminPropertyActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const run = (action: () => Promise<void>) => {
    setError('');
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Action failed');
      }
    });
  };

  const deleteProperty = () => {
    if (!window.confirm(`Delete "${title}"? This will also remove Cloudinary images stored for this property.`)) {
      return;
    }
    run(async () => {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Delete failed');
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {status === 'PUBLISHED' && (
          <Link
            href={`/properties/${slug}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            title="View public listing"
          >
            <Eye className="h-4 w-4" />
          </Link>
        )}
        <Link
          href={`/admin/properties/${id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
          title="Edit property"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => patchJson(`/api/admin/properties/${id}/status`, { status: status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED' }))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
          title={status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
        >
          {status === 'PUBLISHED' ? <EyeOff className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => patchJson(`/api/admin/properties/${id}/featured`, { featured: !featured }))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
          title={featured ? 'Remove featured' : 'Mark featured'}
        >
          <Star className={featured ? 'h-4 w-4 fill-amber-300 text-amber-300' : 'h-4 w-4'} />
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={deleteProperty}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          title="Delete property"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="max-w-xs text-xs text-red-300">{error}</p>}
    </div>
  );
}
