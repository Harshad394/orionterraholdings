'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields (*).');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111C2E] p-6 sm:p-8 shadow-xl space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Send Us a Direct Message</h3>
        <p className="text-xs text-gray-400 mt-1">
          Have specific land acquisition, joint venture, or redevelopment queries? Reach out to our team.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-bold text-white">Message Received</h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            Thank you, <span className="text-white font-semibold">{formData.name}</span>. Our advisory team will get in touch with you shortly.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-medium text-gray-400 hover:text-white underline"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Full Name <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Anish Mehta"
              className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Phone Number <span className="text-emerald-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="anish@example.com"
                className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Message <span className="text-emerald-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can Orion Terra assist you?"
              className="w-full rounded-lg bg-[#17243A] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-sm">
            <Send className="h-4 w-4" />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
}
