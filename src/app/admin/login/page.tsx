import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Building2, Shield } from 'lucide-react';

export const metadata = {
  title: 'Admin Login | Orion Terra',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Already logged in — redirect to dashboard
  const session = await getAdminSession();
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-[#0A1120] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-700/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#111C2E] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-900/50 mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Orion Terra</h1>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Admin Portal
            </p>
          </div>

          <AdminLoginForm />
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          This area is restricted to authorized Orion Terra administrators only.
        </p>
      </div>
    </div>
  );
}
