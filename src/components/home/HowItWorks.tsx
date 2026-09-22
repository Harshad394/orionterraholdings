import React from 'react';
import { Search, MessageSquareText, Users, Handshake, ShieldCheck } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Explore',
      description: 'Browse curated, strategically located land opportunities on Orion Terra.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Inquire',
      description: 'Contact Orion Terra directly via website form, phone, or instant WhatsApp.',
      icon: MessageSquareText,
    },
    {
      number: '03',
      title: 'Connect',
      description: 'Our advisory team reviews your requirements and qualifies the opportunity.',
      icon: Users,
    },
    {
      number: '04',
      title: 'Meet',
      description: 'We facilitate structured introductory meetings between buyers, developers, and sellers.',
      icon: Handshake,
    },
    {
      number: '05',
      title: 'Proceed',
      description: 'Negotiation, due diligence, legal verification, and agreements happen offline smoothly.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="py-12">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Transparent Process
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          How Orion Terra Works
        </h2>
        <p className="text-sm text-gray-400">
          A seamless, human-assisted deal facilitation process connecting land sellers and buyers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="glass-card relative flex flex-col p-6 rounded-2xl border border-white/10 bg-[#111C2E] hover:border-emerald-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-gray-700 gold-gradient-text opacity-70">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
