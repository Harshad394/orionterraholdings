import React from 'react';

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
      <div className="border-b border-white/10 pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Important Notice
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Platform Disclaimer</h1>
        <p className="text-xs text-gray-400">Last updated: February 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-6 space-y-2 text-amber-200">
          <h3 className="font-bold text-base text-white">Independent Due Diligence Notice</h3>
          <p className="text-xs leading-relaxed">
            Property information displayed on Orion Terra is compiled based on owner/representative submissions and initial administrative review. Listings do NOT constitute formal legal ownership verification, title warranty, or government regulatory guarantee.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">Buyer & Investor Responsibility</h2>
          <p>
            All prospective buyers, developers, and investors are strongly advised to engage qualified legal counsel, conduct independent title searches, verify survey boundaries, and check local zoning permissions before entering into any transaction.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">Pricing & Availability</h2>
          <p>
            Land availability, pricing estimates, and opportunity terms are subject to change without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
}
