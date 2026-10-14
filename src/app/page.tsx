import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Layers, Handshake, TrendingUp, Compass } from 'lucide-react';
import { getFeaturedMockProperties } from '@/data/mockProperties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { HowItWorks } from '@/components/home/HowItWorks';
import { SolutionCard, CTASection } from '@/components/home/SolutionCard';

export default function HomePage() {
  const featuredProperties = getFeaturedMockProperties();

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/10 bg-[#070D17]">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80"
            alt="Strategic Land Opportunity"
            className="h-full w-full object-cover object-center opacity-25 scale-105 animate-pulse transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/75 to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Compass className="h-3.5 w-3.5 text-amber-400" />
            <span>Centralized Land Discovery & Deal Facilitation</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Discover Land. <br />
            <span className="gold-gradient-text">Unlock Opportunities.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore strategically located land opportunities for acquisition, redevelopment, joint ventures, and high-yield investment.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/properties" className="btn-primary w-full sm:w-auto text-base py-3.5 px-8">
              <span>Explore Properties</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/sell-your-land" className="btn-secondary w-full sm:w-auto text-base py-3.5 px-8">
              <span>List Your Land</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
        {/* 2. TRUST / INTRO SECTION */}
        <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-amber-500/20 text-center max-w-4xl mx-auto space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            A Smarter Way to Discover Land
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Centralizing Prime Land Opportunities Across Growth Corridors
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Orion Terra acts as a dedicated discovery catalog and deal facilitator. We present verified, high-potential land assets to landowners, buyers, developers, and investors—enabling structured offline communication, due diligence, and negotiation.
          </p>
        </section>

        {/* 3. FEATURED PROPERTIES */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Curated Listings
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
                Featured Properties
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Explore selected land opportunities available through Orion Terra.
              </p>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Explore All Properties</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* 4. OPPORTUNITIES / SOLUTIONS */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Solutions & Use Cases
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Explore Land Opportunities
            </h2>
            <p className="text-sm text-gray-400">
              Tailored approaches for acquisition, joint development, redevelopment, and investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <SolutionCard
              id="acquisition"
              title="Land Acquisition"
              description="Identify and acquire strategically located land opportunities for residential, commercial, or industrial development."
              icon={Building2}
              href="/solutions#acquisition"
              ctaText="Explore Acquisition Opportunities"
            />
            <SolutionCard
              id="redevelopment"
              title="Redevelopment"
              description="Connect land and property owners with potential redevelopment opportunities to unlock maximum land valuation."
              icon={Layers}
              href="/solutions#redevelopment"
              ctaText="Explore Redevelopment"
            />
            <SolutionCard
              id="joint-ventures"
              title="Joint Ventures"
              description="Facilitate collaborative partnerships between landowners and reputed property developers for mutual profit sharing."
              icon={Handshake}
              href="/solutions#joint-ventures"
              ctaText="Explore Joint Ventures"
            />
            <SolutionCard
              id="investment"
              title="Investment Opportunities"
              description="Explore selected high-appreciation land parcels suitable for long-term capital preservation and strategic land banking."
              icon={TrendingUp}
              href="/solutions#investment"
              ctaText="Explore Investment Land"
            />
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <HowItWorks />

        {/* 6. SELL YOUR LAND CTA */}
        <CTASection
          title="Have Land to Sell or Develop?"
          description="Submit your property details through our seller form. Our advisory team will review the opportunity and connect with you to discuss potential listing and buyer facilitation."
          primaryCtaText="Submit Your Property"
          primaryCtaHref="/sell-your-land"
          secondaryCtaText="Talk to Advisory Team"
          secondaryCtaHref="/contact"
        />
      </div>
    </div>
  );
}
