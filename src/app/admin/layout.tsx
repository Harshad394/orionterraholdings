import { headers } from 'next/headers';
import { getAdminSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Panel | Orion Terra',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read request path to skip sidebar on the login page
  const headersList = await headers();
  const pathname = headersList.get('x-next-pathname') ?? '';
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login');

  // For protected pages, get session (middleware already enforces auth, this is for display)
  const session = isLoginPage ? null : await getAdminSession();

  // If this is the login page, render children without admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0A1120] text-gray-100">
      <AdminSidebar adminEmail={session?.email ?? ''} />
      {/* Main content — offset for desktop sidebar */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
