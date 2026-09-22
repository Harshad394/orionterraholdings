import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-slate-500/15 text-slate-300 border-slate-500/25',
  PUBLISHED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  UNPUBLISHED: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  APPROVED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  REJECTED: 'bg-red-500/15 text-red-400 border-red-500/25',
  MORE_INFORMATION_REQUIRED: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        statusStyles[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25'
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
