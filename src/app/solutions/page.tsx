import React from 'react';
import Link from 'next/link';
import { Building2, Layers, Handshake, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CTASection } from '@/components/home/SolutionCard';

export default function SolutionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Land & Real Estate Opportunities
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Opportunities Beyond Plain Land
        </h1>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          Orion Terra structures land opportunities across four primary transaction models to match buyer requirements with landowner goals.
        </p>
      </div>

      {/* 1. Land Acquisition */}
      <section id="acquisition" className="rounded-3xl border border-white/10 bg-[#111C2E] p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Model 01</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Land Acquisition</h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl">
          Identify and acquire strategically located land parcels for immediate or long-term development. Orion Terra curates clean, accessible plots suited for residential towers, commercial corporate parks, industrial warehouses, or institutional projects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl bg-[#17243A] p-4 border border-white/5 space-y-1">
            <h4 className="text-sm font-bold text-white">Strategic Location Search</h4>
            <p className="text-xs text-gray-400">Filter by highway corridors, upcoming metro belts, and growth nodes.</p>
          </div>
          <div className="rounded-xl bg-[#17243A] p-4 border border-white/5 space-y-1">
            <h4 className="text-sm font-bold text-white">Direct Owner Submissions</h4>
            <p className="text-xs text-gray-400">Catalog of properties submitted directly by verified landowners.</p>
          </div>
          <div className="rounded-xl bg-[#17243A] p-4 border border-white/5 space-y-1">
            <h4 className="text-sm font-bold text-white">Offline Negotiation</h4>
            <p className="text-xs text-gray-400">Human-assisted meetings to align valuation and transaction terms.</p>
          </div>
        </div>

        <div className="pt-2">
          <Link href="/properties" className="btn-primary text-xs py-2.5 px-5">
            <span>Explore Land Acquisition Properties</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 2. Redevelopment */}
      <section id="redevelopment" className="rounded-3xl border border-white/10 bg-[#111C2E] p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Layers className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Model 02</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Redevelopment Opportunities</h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl">
          Connect land and property owners with potential redevelopment opportunities. Older structures, infill plots, or underutilized commercial land parcels often hold tremendous upside through high-FSI redevelopment into modern towers or mixed-use complexes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3 rounded-xl bg-[#17243A] p-4 border border-white/5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Maximized Land Valuation</h4>
              <p className="text-xs text-gray-400">Transform aging land assets into high-value urban real estate.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-[#17243A] p-4 border border-white/5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Developer Alignment</h4>
              <p className="text-xs text-gray-400">Match property owners with reputed developers having proven track records.</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Link href="/sell-your-land" className="btn-gold text-xs py-2.5 px-5">
            <span>Discuss a Redevelopment Opportunity</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 3. Joint Ventures */}
      <section id="joint-ventures" className="rounded-3xl border border-white/10 bg-[#111C2E] p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Handshake className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Model 03</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Joint Ventures (JV)</h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl">
          Facilitate collaborative partnerships between landowners who provide land equity and property developers who bring capital, construction expertise, and sales distribution. Joint ventures allow landowners to retain long-term upside while mitigating direct construction risk.
        </p>

        <div className="pt-2">
          <Link href="/contact" className="btn-primary text-xs py-2.5 px-5">
            <span>Discuss a Joint Venture Partnership</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4. Investment Opportunities */}
      <section id="investment" className="rounded-3xl border border-white/10 bg-[#111C2E] p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Model 04</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Investment Land Parcels</h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl">
          Explore selected land opportunities positioned along upcoming infrastructure corridors, proposed highways, and industrial zones. Suitable for long-term land banking and strategic portfolio expansion.
        </p>

        <div className="pt-2">
          <Link href="/properties" className="btn-secondary text-xs py-2.5 px-5">
            <span>Browse Investment Land Opportunities</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Discuss Your Land Requirement?"
        description="Whether you are acquiring land for a project or presenting land for redevelopment, our advisory team is ready to assist."
        primaryCtaText="Explore All Properties"
        primaryCtaHref="/properties"
        secondaryCtaText="Contact Orion Terra"
        secondaryCtaHref="/contact"
      />
    </div>
  );
}
