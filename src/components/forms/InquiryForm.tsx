'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';
import { postApi } from '@/lib/api/client';

interface InquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

export function InquiryForm({ propertyId, propertyTitle }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: propertyTitle
      ? `I am interested in property ${propertyId || ''} (${propertyTitle}). Please contact me with further details and arrange a discussion.`
      : 'I would like to inquire about land opportunities available through Orion Terra.',
    website: '', // Honeypot field for bot spam detection
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; propertyId?: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleResetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: propertyTitle
        ? `I am interested in property ${propertyId || ''} (${propertyTitle}). Please contact me with further details and arrange a discussion.`
        : 'I would like to inquire about land opportunities available through Orion Terra.',
      website: '',
    });
    setSubmittedData(null);
    setFieldErrors({});
    setGeneralError(null);
  };

  const validateFrontend = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Prevent duplicate submits if already loading
    if (submitting) return;

    if (!validateFrontend()) {
      setGeneralError('Please fix the errors in the form before sending your inquiry.');
      return;
    }

    setSubmitting(true);

    const payload = {
      propertyId: propertyId || '',
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      message: formData.message,
      website: formData.website, // Honeypot
    };

    const res = await postApi<{ id: string; propertyId?: string }>('/api/inquiries', payload);

    setSubmitting(false);

    if (res.success && res.data) {
      setSubmittedData({
        id: res.data.id || 'INQUIRY_RECEIVED',
        propertyId: res.data.propertyId || propertyId,
      });
    } else {
      if (res.error?.fields) {
        setFieldErrors(res.error.fields);
      }
      setGeneralError(
        res.error?.message || 'We could not send your inquiry right now. Please try again.'
      );
    }
  };

  const whatsappLink = getWhatsAppLink(propertyId, propertyTitle);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 shadow-xl space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Inquire About This Opportunity</h3>
        <p className="text-xs text-gray-400 mt-1">
          Directly connect with the Orion Terra land advisory team regarding{' '}
          <span className="text-emerald-400 font-semibold">{propertyId || 'this property'}</span>.
        </p>
      </div>

      {submittedData ? (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-bold text-white">Thank You for Your Interest</h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            Your inquiry for property{' '}
            <span className="text-emerald-400 font-semibold">{submittedData.propertyId || propertyId}</span> has been received. Our advisory team will contact you at{' '}
            <span className="text-white font-semibold">{formData.phone}</span>.
          </p>

          <div className="text-[11px] text-gray-400 bg-white/5 p-3 rounded-lg border border-white/10 text-center">
            Status: <span className="text-emerald-400 font-semibold">New Inquiry Logged</span>
            <br />
            Reference ID: <span className="font-mono text-gray-300">{submittedData.id}</span>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="btn-primary w-full py-2.5 text-xs justify-center flex"
            >
              Submit Another Inquiry
            </button>
            <Link
              href="/properties"
              className="btn-secondary w-full py-2 text-xs text-center justify-center flex"
            >
              Back to Properties Catalog
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Honeypot field (hidden from normal users, filled by automated bots) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="inquiry_website">Leave this field blank</label>
            <input
              type="text"
              id="inquiry_website"
              name="inquiry_website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {generalError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Full Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              disabled={submitting}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Vikram Sharma"
              className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                fieldErrors.name ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'
              }`}
            />
            {fieldErrors.name && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Phone Number <span className="text-emerald-400">*</span>
              </label>
              <input
                type="tel"
                required
                disabled={submitting}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                  fieldErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled={submitting}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="vikram@example.com"
                className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                  fieldErrors.email ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Message / Specific Requirements <span className="text-emerald-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              disabled={submitting}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                fieldErrors.message ? 'border-red-500' : 'border-white/10 focus:border-emerald-500'
              }`}
            />
            {fieldErrors.message && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.message}</p>
            )}
          </div>

          <p className="text-[11px] text-gray-400">
            By submitting, you agree to allow Orion Terra to contact you regarding this property inquiry.
          </p>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed justify-center flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Inquiry to Orion Terra</span>
                </>
              )}
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full py-2.5 text-xs text-center justify-center flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4 fill-current" />
              <span>Instant WhatsApp Inquiry</span>
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
