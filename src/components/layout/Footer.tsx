import Link from 'next/link';
import { Phone, Mail, MessageSquare, MapPin } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070D17] text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="font-bold text-xl gold-gradient-text">OT</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">ORION TERRA</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-emerald-400 transition-colors">Browse Properties</Link>
              </li>
              <li>
                <Link href="/sell-your-land" className="hover:text-emerald-400 transition-colors">Sell Your Land</Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions & Opportunities</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Solutions</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/solutions#acquisition" className="hover:text-emerald-400 transition-colors">Land Acquisition</Link>
              </li>
              <li>
                <Link href="/solutions#redevelopment" className="hover:text-emerald-400 transition-colors">Redevelopment</Link>
              </li>
              <li>
                <Link href="/solutions#joint-ventures" className="hover:text-emerald-400 transition-colors">Joint Ventures</Link>
              </li>
              <li>
                <Link href="/solutions#investment" className="hover:text-emerald-400 transition-colors">Investment Land</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal & Compliance</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">Platform Disclaimer</Link>
              </li>
            </ul>
            <div className="pt-2 text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{siteConfig.contact.addressPlaceholder}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Orion Terra. All rights reserved. Land discovery & deal facilitation platform.</p>
          <div className="flex items-center gap-4">
            <Link href="/disclaimer" className="hover:text-gray-400">Offline Deal Facilitation Disclaimer</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-gray-400">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
