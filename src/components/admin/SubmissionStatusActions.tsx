'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, HelpCircle, XCircle } from 'lucide-react';
import { SUBMISSION_STATUS } from '@/constants/enums';
import { cn } from '@/lib/utils';

const icons = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  MORE_INFORMATION_REQUIRED: HelpCircle,
};

export function SubmissionStatusActions({
  submissionId,
  currentStatus,
}: {
  submissionId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateStatus = (status: string) => {
    setError('');
    setSuccess('');
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/submissions/${submissionId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || 'Unable to update status');
        }
        setSuccess('Status updated.');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update status');
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SUBMISSION_STATUS.map((status) => {
          const Icon = icons[status];
          const active = status === currentStatus;
          return (
            <button
              key={status}
              type="button"
              disabled={isPending || active}
              onClick={() => updateStatus(status)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition disabled:opacity-60',
                active
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-white/10 text-gray-300 hover:bg-white/5'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {status.replace(/_/g, ' ')}
            </button>
          );
        })}
      </div>
      {(error || success) && (
        <p className={cn('text-xs', error ? 'text-red-300' : 'text-emerald-300')}>
          {error || success}
        </p>
      )}
    </div>
  );
}
