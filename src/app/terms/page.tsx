import React from 'react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
      <div className="border-b border-white/10 pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Platform Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Terms of Service</h1>
        <p className="text-xs text-gray-400">Last updated: February 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Platform Nature</h2>
          <p>
            Orion Terra operates solely as a digital land discovery catalog and lead facilitation platform. Orion Terra is not a licensed real estate broker, escrow service, or financial institution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Offline Transactions</h2>
          <p>
            No monetary transactions, property bookings, digital title transfers, or binding legal agreements occur on the website. All negotiations, title due diligence, legal verification, contracts, and payments are conducted offline between the respective parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. User Representation</h2>
          <p>
            Sellers submitting land information warrant that they have lawful authority or authorization to present the property for review.
          </p>
        </section>
      </div>
    </div>
  );
}
