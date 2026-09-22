import { MessageSquare, Clock } from 'lucide-react';

export const metadata = { title: 'Inquiries | Orion Terra Admin' };

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Buyer Inquiries</h1>
        <p className="text-sm text-gray-400 mt-1">Track and manage buyer inquiry requests</p>
      </div>
      <div className="bg-[#111C2E] border border-white/10 rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <MessageSquare className="w-7 h-7 text-blue-400" />
        </div>
        <div>
          <p className="text-white font-semibold mb-1">Coming in Phase 8</p>
          <p className="text-sm text-gray-500 max-w-sm">
            Buyer inquiry management — view, respond, and update inquiry status across the workflow.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Inquiries are already being captured from property pages</span>
        </div>
      </div>
    </div>
  );
}
