import React from 'react';
import { SellerForm } from '@/components/forms/SellerForm';
import { ShieldCheck, Sparkles, Building2, Handshake } from 'lucide-react';

export default function SellYourLandPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>For Landowners & Property Representatives</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Have Land to Sell or Develop?
        </h1>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          Submit your property details and our advisory team will review the opportunity for direct acquisition, joint venture, or redevelopment listing on Orion Terra.
        </p>
      </div>

      {/* Benefits Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="rounded-xl border border-white/10 bg-[#111C2E] p-5 space-y-2 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-1">
            <Building2 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Targeted Exposure</h3>
          <p className="text-xs text-gray-400">Present your land plot directly to active developers, investors, and corporate buyers.</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111C2E] p-5 space-y-2 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 mb-1">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Privacy & Admin Control</h3>
          <p className="text-xs text-gray-400">Private owner contact info is never published. Admin reviews all data prior to public listing.</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111C2E] p-5 space-y-2 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-1">
            <Handshake className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Human-Assisted Deals</h3>
          <p className="text-xs text-gray-400">Orion Terra facilitates meetings, due diligence, and negotiation offline without online transaction friction.</p>
        </div>
      </div>

      {/* Seller Submission Form */}
      <SellerForm />
    </div>
  );
}
