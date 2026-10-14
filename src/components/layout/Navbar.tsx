'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Compass, Building2, PlusCircle, Info, Mail } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Properties', href: '/properties', icon: Compass },
    { name: 'Solutions', href: '/solutions', icon: Building2 },
    { name: 'Sell Your Land', href: '/sell-your-land', icon: PlusCircle },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B1320]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:border-amber-500/60 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <span className="font-bold text-xl tracking-wider gold-gradient-text">OT</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              ORION TERRA HOLDING&apos;S
            </span>
            <span className="text-[10px] tracking-widest text-amber-400/80 font-medium uppercase">
              Land Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${active
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Admin link */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin/login"
            className="text-xs font-medium text-gray-400 hover:text-amber-400 transition-colors px-2 py-1"
          >
            Admin Access
          </Link>
          <Link href="/properties" className="btn-primary text-sm py-2 px-4">
            <span>Explore Properties</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0B1320] px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1 py-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${active
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <IconComponent className="w-5 h-5 text-amber-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full text-center py-3"
            >
              Explore All Properties
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs text-gray-400 hover:text-amber-400 py-2"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
