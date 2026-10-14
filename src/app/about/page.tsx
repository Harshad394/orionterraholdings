import Link from 'next/link';
import { Compass, ShieldCheck, Users, Handshake, Building2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          About Orion Terra
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Centralizing Land Opportunities. <br />
          <span className="gold-gradient-text">Facilitating Meaningful Deals.</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          Orion Terra is a dedicated land aggregation, property discovery, and deal facilitation platform designed to bridge the gap between landowners, buyers, developers, and investors.
        </p>
      </div>

      {/* Core Philosophy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl border border-white/10 bg-[#111C2E] p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">What We Do</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Traditionally, land transactions suffer from fragmented information, unverified listings, and inefficient communication channels. Orion Terra solves this by providing a clean, curated digital platform where landowners can present their properties and prospective buyers can discover strategic opportunities.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Every submission undergoes admin review before being published. Once an inquiry is received, our advisory team facilitates structured communication between the interested parties.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-500/30 bg-[#142033] p-8 space-y-6 shadow-[0_4px_20px_rgba(245,158,11,0.08)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Offline Deal Facilitation</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            We explicitly prioritize simplicity and trust. Orion Terra is NOT an online transaction or automated booking gateway.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            All legal verification, title checks, price negotiations, sale agreements, and monetary transactions take place offline directly between the relevant parties with Orion Terra assisting communication.
          </p>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Our Core Platform Pillars
          </h2>
          <p className="text-sm text-gray-400">
            Built for clarity, privacy, and transparent communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Curated Catalog</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Clean property details, transparent area units, opportunity categories, and pricing visibility controls.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Privacy Protection</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Landowner personal contact information is kept strictly confidential and never displayed publicly.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Handshake className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Human Advisory</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Experienced team coordination to arrange site visits, qualify buyer intent, and facilitate seller discussions.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#111C2E] to-[#17243A] p-8 sm:p-12 text-center space-y-6 shadow-[0_0_40px_rgba(245,158,11,0.08)]">
        <h2 className="text-3xl font-bold text-white">Get Started With Orion Terra</h2>
        <p className="text-sm text-gray-300 max-w-xl mx-auto">
          Whether you want to discover land opportunities or submit your property for redevelopment and sale, we are here to assist.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/properties" className="btn-primary py-3 px-6 text-sm">
            <span>Explore Properties</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/sell-your-land" className="btn-secondary py-3 px-6 text-sm">
            <span>List Your Land</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
