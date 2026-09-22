'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Properties', href: '/admin/properties', icon: MapPin },
  { label: 'Submissions', href: '/admin/submissions', icon: FileText },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
];

interface AdminSidebarProps {
  adminEmail: string;
}

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    });
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/40">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Orion Terra</p>
          <p className="text-xs text-emerald-400 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  active ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'
                )}
              />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 text-emerald-400/60" />}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="px-3 py-4 border-t border-white/10 space-y-3">
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Signed in as</p>
          <p className="text-sm text-gray-300 truncate font-medium">{adminEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
          <span>{isPending ? 'Signing out…' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#0D1929] border-r border-white/10 fixed left-0 top-0 bottom-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0D1929] border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Orion Terra Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0D1929] border-r border-white/10 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="text-sm font-semibold text-white">Navigation</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
