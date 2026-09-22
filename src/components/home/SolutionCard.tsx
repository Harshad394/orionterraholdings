import React from 'react';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface SolutionCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  ctaText?: string;
}

export function SolutionCard({
  id,
  title,
  description,
  icon: Icon,
  href,
  ctaText = 'Explore Opportunity',
}: SolutionCardProps) {
  return (
    <div id={id} className="glass-card flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#111C2E] hover:border-emerald-500/40 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>

      <div className="pt-6">
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>{ctaText}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

interface CTASectionProps {
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function CTASection({
  title,
  description,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: CTASectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#111C2E] via-[#17243A] to-[#0B1320] p-8 sm:p-12 lg:p-16 my-12 shadow-2xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="text-base text-gray-300 leading-relaxed max-w-2xl">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href={primaryCtaHref} className="btn-primary py-3 px-6 text-sm">
            {primaryCtaText}
          </Link>
          {secondaryCtaText && secondaryCtaHref && (
            <Link href={secondaryCtaHref} className="btn-secondary py-3 px-6 text-sm">
              {secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
