import { getAdminSession } from '@/lib/auth';
import Link from 'next/link';
import connectToDatabase from '@/lib/db/mongodb';
import Property from '@/models/Property';
import SellerSubmission from '@/models/SellerSubmission';
import Inquiry from '@/models/Inquiry';
import {
  MapPin,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'emerald' | 'blue' | 'amber' | 'rose';
  description?: string;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    APPROVED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    REJECTED: 'bg-red-500/15 text-red-400 border-red-500/25',
    MORE_INFORMATION_REQUIRED: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    NEW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    CONTACTED: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    IN_PROGRESS: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    CLOSED: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        map[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25'
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  await connectToDatabase();

  const [
    totalProperties,
    publishedProperties,
    draftProperties,
    pendingSubmissions,
    totalSubmissions,
    newInquiries,
    totalInquiries,
    recentSubmissions,
    recentInquiries,
  ] = await Promise.all([
    Property.countDocuments({}),
    Property.countDocuments({ status: 'PUBLISHED' }),
    Property.countDocuments({ status: 'DRAFT' }),
    SellerSubmission.countDocuments({ status: 'PENDING' }),
    SellerSubmission.countDocuments({}),
    Inquiry.countDocuments({ status: 'NEW' }),
    Inquiry.countDocuments({}),
    SellerSubmission.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .exec(),
    Inquiry.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('propertyId', 'title propertyId slug')
      .lean()
      .exec(),
  ]);

  const statCards: StatCard[] = [
    {
      label: 'Total Properties',
      value: totalProperties,
      icon: MapPin,
      color: 'emerald',
      description: `${publishedProperties} published · ${draftProperties} draft`,
    },
    {
      label: 'Published',
      value: publishedProperties,
      icon: Eye,
      color: 'blue',
      description: 'Live on public site',
    },
    {
      label: 'Pending Submissions',
      value: pendingSubmissions,
      icon: FileText,
      color: 'amber',
      description: `${totalSubmissions} total submissions`,
    },
    {
      label: 'New Inquiries',
      value: newInquiries,
      icon: MessageSquare,
      color: 'rose',
      description: `${totalInquiries} total inquiries`,
    },
  ];

  const colorMap = {
    emerald: {
      card: 'border-emerald-500/20 bg-emerald-500/5',
      icon: 'bg-emerald-500/15 text-emerald-400',
      value: 'text-emerald-400',
    },
    blue: {
      card: 'border-blue-500/20 bg-blue-500/5',
      icon: 'bg-blue-500/15 text-blue-400',
      value: 'text-blue-400',
    },
    amber: {
      card: 'border-amber-500/20 bg-amber-500/5',
      icon: 'bg-amber-500/15 text-amber-400',
      value: 'text-amber-400',
    },
    rose: {
      card: 'border-rose-500/20 bg-rose-500/5',
      icon: 'bg-rose-500/15 text-rose-400',
      value: 'text-rose-400',
    },
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Welcome back,{' '}
            <span className="text-emerald-400 font-medium">{session?.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Live data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const colors = colorMap[card.color];
          return (
            <div
              key={card.label}
              className={cn(
                'rounded-xl border p-5 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.02]',
                colors.card
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 font-medium">{card.label}</p>
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', colors.icon)}>
                  <card.icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className={cn('text-3xl font-bold', colors.value)}>{card.value}</p>
                {card.description && (
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-[#111C2E] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Recent Submissions</h2>
            </div>
            {pendingSubmissions > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                {pendingSubmissions} pending
              </span>
            )}
          </div>

          <div className="divide-y divide-white/5">
            {recentSubmissions.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No submissions yet
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              recentSubmissions.map((sub: any) => (
                <div key={sub._id.toString()} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <p className="text-sm font-medium text-white truncate">{sub.sellerName}</p>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {sub.city}, {sub.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {sub.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {formatDate(sub.createdAt)}
                      </div>
                    </div>
                    <StatusBadge status={sub.status} />
                  </div>
                </div>
              ))
            )}
          </div>

          {totalSubmissions > 5 && (
            <div className="px-6 py-3 border-t border-white/5">
              <Link href="/admin/submissions" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                View all {totalSubmissions} submissions →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-[#111C2E] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Recent Inquiries</h2>
            </div>
            {newInquiries > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {newInquiries} new
              </span>
            )}
          </div>

          <div className="divide-y divide-white/5">
            {recentInquiries.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No inquiries yet
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              recentInquiries.map((inq: any) => (
                <div key={inq._id.toString()} className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <p className="text-sm font-medium text-white truncate">{inq.name}</p>
                      </div>
                      {inq.propertyId && (
                        <p className="text-xs text-emerald-400/80 truncate mb-1">
                          {inq.propertyId.title ?? inq.propertyId.propertyId}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {inq.phone}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[140px]">
                          <Mail className="w-3 h-3" />
                          {inq.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {formatDate(inq.createdAt)}
                      </div>
                    </div>
                    <StatusBadge status={inq.status} />
                  </div>
                </div>
              ))
            )}
          </div>

          {totalInquiries > 5 && (
            <div className="px-6 py-3 border-t border-white/5">
              <a href="/admin/inquiries" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                View all {totalInquiries} inquiries →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
