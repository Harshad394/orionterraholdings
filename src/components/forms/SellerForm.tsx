'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, FileCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { PropertyType, OpportunityType, LandAreaUnit } from '@/types/property';
import { postApi } from '@/lib/api/client';

export function SellerForm() {
  const [formData, setFormData] = useState({
    sellerName: '',
    phone: '',
    email: '',
    company: '',
    propertyLocation: '',
    city: '',
    state: 'Maharashtra',
    landArea: '',
    landAreaUnit: 'sq.ft' as LandAreaUnit,
    propertyType: 'Residential' as PropertyType,
    opportunityType: 'Redevelopment' as OpportunityType,
    expectedPrice: '',
    description: '',
    documentsAvailable: 'Yes',
    consent: false,
    website: '', // Honeypot field for bot spam detection
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleResetForm = () => {
    setFormData({
      sellerName: '',
      phone: '',
      email: '',
      company: '',
      propertyLocation: '',
      city: '',
      state: 'Maharashtra',
      landArea: '',
      landAreaUnit: 'sq.ft',
      propertyType: 'Residential',
      opportunityType: 'Redevelopment',
      expectedPrice: '',
      description: '',
      documentsAvailable: 'Yes',
      consent: false,
      website: '',
    });
    setSubmittedId(null);
    setFieldErrors({});
    setGeneralError(null);
  };

  const validateFrontend = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.sellerName.trim()) {
      errors.sellerName = 'Full Name is required.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone Number is required.';
    }
    if (!formData.propertyLocation.trim()) {
      errors.propertyLocation = 'Property Location is required.';
    }
    if (!formData.city.trim()) {
      errors.city = 'City is required.';
    }
    if (!formData.landArea || Number(formData.landArea) <= 0) {
      errors.landArea = 'Land Area must be a positive number.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    }
    if (!formData.consent) {
      errors.consent = 'You must accept the consent checkbox to submit.';
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
      setGeneralError('Please fix the errors in the form before submitting.');
      return;
    }

    setSubmitting(true);

    // Format numeric expected price
    let parsedPrice: number | undefined = undefined;
    if (formData.expectedPrice && formData.expectedPrice.trim()) {
      const numericVal = Number(formData.expectedPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericVal) && numericVal > 0) {
        parsedPrice = numericVal;
      }
    }

    const payload = {
      sellerName: formData.sellerName,
      phone: formData.phone,
      email: formData.email || undefined,
      company: formData.company || undefined,
      propertyLocation: formData.propertyLocation,
      city: formData.city,
      state: formData.state,
      landArea: Number(formData.landArea),
      landAreaUnit: formData.landAreaUnit,
      propertyType: formData.propertyType,
      opportunityType: formData.opportunityType,
      expectedPrice: parsedPrice,
      description: formData.description,
      documentsAvailable: formData.documentsAvailable,
      consent: formData.consent,
      website: formData.website, // Honeypot
    };

    const res = await postApi<{ id: string }>('/api/seller-submissions', payload);

    setSubmitting(false);

    if (res.success && res.data) {
      setSubmittedId(res.data.id || 'SUBMITTED');
    } else {
      if (res.error?.fields) {
        setFieldErrors(res.error.fields);
      }
      setGeneralError(
        res.error?.message || 'We could not submit your property right now. Please try again.'
      );
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 sm:p-8 lg:p-10 shadow-2xl max-w-4xl mx-auto space-y-8">
      {submittedId ? (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-8 text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Property Submitted Successfully</h3>
            <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
              Thank you for submitting your land details for{' '}
              <span className="text-white font-semibold">{formData.propertyLocation}</span> in{' '}
              <span className="text-amber-400 font-semibold">{formData.city}</span>.
            </p>
          </div>

          <div className="text-xs text-gray-300 bg-white/5 p-4 rounded-xl border border-white/10 max-w-md mx-auto space-y-1">
            <div className="text-amber-400 font-bold">Status: Pending Orion Terra Admin Review</div>
            <p className="text-[11px] text-gray-400">
              Reference Submission ID: <span className="font-mono text-white">{submittedId}</span>
            </p>
            <p className="text-[11px] text-gray-400 pt-1">
              Our advisory team will review the submitted information. Private contact details are kept strictly confidential and will never be published publicly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="btn-primary text-xs px-5 py-2.5"
            >
              Submit Another Property
            </button>
            <Link href="/" className="btn-secondary text-xs px-5 py-2.5">
              Back to Homepage
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Honeypot field (hidden from normal users, filled by automated bots) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Leave this field blank</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {generalError && (
            <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-xs text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Section 1: Seller Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Building2 className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Seller / Landowner Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  placeholder="e.g. Rajesh Patil"
                  className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                    fieldErrors.sellerName ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {fieldErrors.sellerName && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.sellerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Phone Number <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  disabled={submitting}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                    fieldErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled={submitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rajesh@example.com"
                  className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                    fieldErrors.email ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Company / Entity (Optional)</label>
                <input
                  type="text"
                  disabled={submitting}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Patil Realtors / Family Trust"
                  className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Land Location & Area */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Land Location & Specifications</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Property Location / Address <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={formData.propertyLocation}
                  onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                  placeholder="e.g. Plot No. 45, Ghodbunder Highway Sector 2"
                  className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                    fieldErrors.propertyLocation ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {fieldErrors.propertyLocation && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.propertyLocation}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  City <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Thane"
                  className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                    fieldErrors.city ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {fieldErrors.city && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">State</label>
                <input
                  type="text"
                  disabled={submitting}
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Land Area <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    disabled={submitting}
                    value={formData.landArea}
                    onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                    placeholder="25000"
                    className={`w-full rounded-lg bg-[#17243A] border px-3 py-2.5 text-sm text-white focus:outline-none ${
                      fieldErrors.landArea ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                    }`}
                  />
                  {fieldErrors.landArea && (
                    <p className="text-[11px] text-red-400 mt-1">{fieldErrors.landArea}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Unit</label>
                  <select
                    disabled={submitting}
                    value={formData.landAreaUnit}
                    onChange={(e) => setFormData({ ...formData, landAreaUnit: e.target.value as LandAreaUnit })}
                    className="w-full rounded-lg bg-[#17243A] border border-white/10 px-2 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="sq.m">sq.m</option>
                    <option value="acre">acre</option>
                    <option value="hectare">hectare</option>
                    <option value="guntha">guntha</option>
                    <option value="other">other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Property Type</label>
                <select
                  disabled={submitting}
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                  className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Mixed Use">Mixed Use</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Opportunity Type</label>
                <select
                  disabled={submitting}
                  value={formData.opportunityType}
                  onChange={(e) => setFormData({ ...formData, opportunityType: e.target.value as OpportunityType })}
                  className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="Direct Sale">Direct Sale</option>
                  <option value="Redevelopment">Redevelopment</option>
                  <option value="Joint Venture">Joint Venture</option>
                  <option value="Long-term Development">Long-term Development</option>
                  <option value="Investment Opportunity">Investment Opportunity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Expected Price (Optional)</label>
                <input
                  type="text"
                  disabled={submitting}
                  value={formData.expectedPrice}
                  onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                  placeholder="₹ e.g. 45000000"
                  className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Details & Documents */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileCheck className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Property Description & Documents</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Description <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                disabled={submitting}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about key highlights, road access, zoning, surrounding landmarks..."
                className={`w-full rounded-lg bg-[#17243A] border px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none ${
                  fieldErrors.description ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                }`}
              />
              {fieldErrors.description && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Are property title documents available for review?
              </label>
              <div className="flex items-center gap-6">
                {['Yes', 'No', 'Not sure'].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="radio"
                      name="documentsAvailable"
                      disabled={submitting}
                      value={option}
                      checked={formData.documentsAvailable === option}
                      onChange={(e) => setFormData({ ...formData, documentsAvailable: e.target.value })}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2 border-t border-white/10 space-y-4">
            <div>
              <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  required
                  disabled={submitting}
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded border-white/20 bg-[#17243A] text-amber-500 focus:ring-amber-500"
                />
                <span>
                  I confirm that the information provided is accurate to the best of my knowledge and agree to be contacted by Orion Terra regarding this submission.
                </span>
              </label>
              {fieldErrors.consent && (
                <p className="text-[11px] text-red-400 mt-1 ml-6">{fieldErrors.consent}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting Property Details...</span>
                </>
              ) : (
                <>
                  <span>Submit Property Details</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
