'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  RotateCcw,
  Phone,
  Mail,
  ExternalLink,
  Trash2,
  Calendar,
  User,
  MapPin,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { AdminInquiryDTO } from '@/services/admin-inquiry.service';
import { getApi, patchApi, deleteApi } from '@/lib/api/client';
import { cn } from '@/lib/utils';

interface InquiryResponse {
  inquiries: AdminInquiryDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  counts: {
    total: number;
    new: number;
    contacted: number;
    inProgress: number;
    closed: number;
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    NEW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    CONTACTED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    IN_PROGRESS: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    CLOSED: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
        map[status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30'
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<AdminInquiryDTO[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    inProgress: 0,
    closed: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Drawer state
  const [activeInquiry, setActiveInquiry] = useState<AdminInquiryDTO | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    queryParams.set('page', pagination.page.toString());
    queryParams.set('limit', pagination.limit.toString());
    if (search) queryParams.set('search', search);
    if (selectedStatus) queryParams.set('status', selectedStatus);

    const res = await getApi<InquiryResponse>(`/api/admin/inquiries?${queryParams.toString()}`);

    if (res.success && res.data) {
      setInquiries(res.data.inquiries);
      setPagination(res.data.pagination);
      setCounts(res.data.counts);
    } else {
      setError(res.error?.message || 'Failed to load inquiries');
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, search, selectedStatus]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    const res = await patchApi<{ inquiry: AdminInquiryDTO }>(`/api/admin/inquiries/${id}`, {
      status: newStatus,
    });
    setUpdatingStatus(false);

    if (res.success && res.data) {
      showToast(`Inquiry status updated to ${newStatus}`);
      if (activeInquiry && activeInquiry.id === id) {
        setActiveInquiry(res.data.inquiry);
      }
      fetchInquiries();
    } else {
      showToast(res.error?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteApi(`/api/admin/inquiries/${deleteId}`);
    setDeleting(false);

    if (res.success) {
      showToast('Inquiry deleted successfully');
      if (activeInquiry?.id === deleteId) {
        setActiveInquiry(null);
      }
      setDeleteId(null);
      fetchInquiries();
    } else {
      showToast(res.error?.message || 'Failed to delete inquiry');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedStatus('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-amber-500 text-black px-4 py-3 font-semibold shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-amber-400" />
            <span>Buyer Inquiries</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Review, contact, and track prospective buyer leads across published land properties.
          </p>
        </div>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => {
            setSelectedStatus('');
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all',
            selectedStatus === ''
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
              : 'bg-[#111C2E] border-white/10 text-gray-400 hover:bg-white/5'
          )}
        >
          <span className="block text-xs uppercase font-bold tracking-wider opacity-70">All</span>
          <span className="text-xl font-bold text-white mt-1 block">{counts.total}</span>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('NEW');
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all',
            selectedStatus === 'NEW'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-[#111C2E] border-white/10 text-gray-400 hover:bg-white/5'
          )}
        >
          <span className="block text-xs uppercase font-bold tracking-wider opacity-70 text-emerald-400">
            New
          </span>
          <span className="text-xl font-bold text-white mt-1 block">{counts.new}</span>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('CONTACTED');
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all',
            selectedStatus === 'CONTACTED'
              ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
              : 'bg-[#111C2E] border-white/10 text-gray-400 hover:bg-white/5'
          )}
        >
          <span className="block text-xs uppercase font-bold tracking-wider opacity-70 text-blue-400">
            Contacted
          </span>
          <span className="text-xl font-bold text-white mt-1 block">{counts.contacted}</span>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('IN_PROGRESS');
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all',
            selectedStatus === 'IN_PROGRESS'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
              : 'bg-[#111C2E] border-white/10 text-gray-400 hover:bg-white/5'
          )}
        >
          <span className="block text-xs uppercase font-bold tracking-wider opacity-70 text-amber-400">
            In Progress
          </span>
          <span className="text-xl font-bold text-white mt-1 block">{counts.inProgress}</span>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('CLOSED');
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className={cn(
            'p-3.5 rounded-xl border text-left transition-all',
            selectedStatus === 'CLOSED'
              ? 'bg-gray-500/20 border-gray-400 text-gray-300'
              : 'bg-[#111C2E] border-white/10 text-gray-400 hover:bg-white/5'
          )}
        >
          <span className="block text-xs uppercase font-bold tracking-wider opacity-70 text-gray-400">
            Closed
          </span>
          <span className="text-xl font-bold text-white mt-1 block">{counts.closed}</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#111C2E] p-4 rounded-xl border border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            placeholder="Search by buyer name, phone, email, or property title/ID..."
            className="w-full pl-10 pr-4 py-2 bg-[#17243A] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {(search || selectedStatus) && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Main Table View */}
      <div className="bg-[#111C2E] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-sm">Loading buyer inquiries...</p>
          </div>
        ) : error ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-red-400 text-center">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchInquiries}
              className="mt-2 text-xs text-amber-400 underline"
            >
              Try Again
            </button>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-white font-semibold">No buyer inquiries found</p>
            <p className="text-xs text-gray-500 max-w-sm">
              {search || selectedStatus
                ? 'Try adjusting your search query or filter selection.'
                : 'Inquiries submitted by buyers on public property pages will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#17243A]/60 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Buyer Name & Contact</th>
                  <th className="py-3.5 px-4 sm:px-6">Property</th>
                  <th className="py-3.5 px-4 sm:px-6">Inquiry Message</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {inquiries.map((inq) => {
                  const whatsappPhone = inq.phone.replace(/[^0-9]/g, '');
                  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello ${inq.name}, contacting you from Orion Terra regarding your inquiry.`
                  )}`;

                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Buyer Contact */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="space-y-1">
                          <p className="font-bold text-white flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{inq.name}</span>
                          </p>
                          <div className="flex flex-col gap-0.5 text-xs text-gray-400">
                            <a
                              href={`tel:${inq.phone.replace(/[^0-9+]/g, '')}`}
                              className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3 h-3 text-gray-500" />
                              <span>{inq.phone}</span>
                            </a>
                            {inq.email && (
                              <a
                                href={`mailto:${inq.email}`}
                                className="hover:text-amber-400 flex items-center gap-1.5 transition-colors truncate max-w-[200px]"
                              >
                                <Mail className="w-3 h-3 text-gray-500" />
                                <span>{inq.email}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Property Info */}
                      <td className="py-4 px-4 sm:px-6">
                        {inq.property ? (
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
                              {inq.property.propertyId}
                            </span>
                            <p className="font-semibold text-gray-200 line-clamp-1">
                              {inq.property.title}
                            </p>
                            {inq.property.city && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  {inq.property.city}, {inq.property.state}
                                </span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            Property ID: {inq.propertyId}
                          </span>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="py-4 px-4 sm:px-6 max-w-xs">
                        <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                          {inq.message}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(inq.createdAt)}</span>
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 sm:px-6">
                        <StatusBadge status={inq.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveInquiry(inq)}
                            className="btn-secondary text-xs py-1.5 px-3"
                          >
                            View
                          </button>
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setDeleteId(inq.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>
              Showing {inquiries.length} of {pagination.total} inquiries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg disabled:opacity-30 hover:bg-white/10"
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg disabled:opacity-30 hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#111C2E] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Buyer Inquiry Details
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{activeInquiry.name}</h3>
                <p className="text-xs text-gray-500">
                  Received on {formatDate(activeInquiry.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setActiveInquiry(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Buyer Contact Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${activeInquiry.phone.replace(/[^0-9+]/g, '')}`}
                className="btn-secondary text-xs py-2.5 justify-center"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {activeInquiry.phone}</span>
              </a>
              <a
                href={`https://wa.me/${activeInquiry.phone.replace(
                  /[^0-9]/g,
                  ''
                )}?text=${encodeURIComponent(
                  `Hello ${activeInquiry.name}, reaching out from Orion Terra regarding property inquiry.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs py-2.5 justify-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              {activeInquiry.email ? (
                <a
                  href={`mailto:${activeInquiry.email}`}
                  className="btn-secondary text-xs py-2.5 justify-center"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Buyer</span>
                </a>
              ) : (
                <div className="text-center py-2.5 text-xs text-gray-500 bg-white/5 rounded-lg border border-white/5">
                  No Email Provided
                </div>
              )}
            </div>

            {/* Property Reference */}
            {activeInquiry.property && (
              <div className="rounded-xl bg-[#17243A] p-4 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">
                      {activeInquiry.property.propertyId}
                    </span>
                  </div>
                  <Link
                    href={`/properties/${activeInquiry.property.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <h4 className="text-base font-bold text-white">{activeInquiry.property.title}</h4>
                {activeInquiry.property.city && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>
                      {activeInquiry.property.city}, {activeInquiry.property.state}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Buyer Message */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Inquiry Message
              </label>
              <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-sm text-gray-200 whitespace-pre-line leading-relaxed">
                {activeInquiry.message}
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Update Lead Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'] as const).map((st) => (
                  <button
                    key={st}
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(activeInquiry.id, st)}
                    className={cn(
                      'px-3.5 py-2 rounded-lg text-xs font-bold border transition-all',
                      activeInquiry.status === st
                        ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    )}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setDeleteId(activeInquiry.id)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry Record</span>
              </button>
              <button
                onClick={() => setActiveInquiry(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111C2E] border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Inquiry Record?</h3>
            <p className="text-xs text-gray-400">
              Are you sure you want to delete this buyer inquiry? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2 px-5 rounded-lg transition-colors flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
