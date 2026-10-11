import React, { useState, useEffect } from 'react';
import { Building2, MessageCircle, ExternalLink, Save, Check, RefreshCw } from 'lucide-react';

interface CompanySettings {
  companyName: string;
  description: string;
  yearsOfExperience: number;
  aboutContent: string;
  address: string;
  emailContact: string;
  phoneContact: string;
  whatsAppNumber: string;
  socialFacebook: string;
  socialLinkedIn: string;
  socialInstagram: string;
  whatsAppUrl: string;
}

interface CompanySettingsLabProps {
  token: string | null;
  onQuickLogin: () => void;
}

export const CompanySettingsLab: React.FC<CompanySettingsLabProps> = ({ token, onQuickLogin }) => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dynamic WhatsApp tester state
  const [testProductSlug, setTestProductSlug] = useState('hdpe-pn16-industrial-pipe');
  const [customMsg, setCustomMsg] = useState('');
  const [generatedWaUrl, setGeneratedWaUrl] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/company');
      const data = await res.json();
      if (data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateWhatsAppTestUrl = async () => {
    try {
      let url = '/api/contact/whatsapp-url?';
      if (customMsg) {
        url += `message=${encodeURIComponent(customMsg)}`;
      } else if (testProductSlug) {
        url += `productSlug=${encodeURIComponent(testProductSlug)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.url) setGeneratedWaUrl(data.url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    updateWhatsAppTestUrl();
  }, [testProductSlug, customMsg]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !token) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchSettings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-slate-400 gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
        <span>Loading company configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Configurable Company Information & WhatsApp Integration</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Demonstrates Phase 10: Single row SQL configuration avoiding hardcoded strings, with dynamic encoded click-to-chat links.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: WhatsApp Generator & Live Click Preview */}
        <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Integration Utility
            </span>
            <h3 className="text-sm font-semibold text-slate-100 mt-0.5">
              WhatsApp Dynamic Link Generator
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Constructs sanitized wa.me URLs with URL-encoded inquiry payloads.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-300">Target Product</label>
              <select
                value={testProductSlug}
                onChange={e => {
                  setTestProductSlug(e.target.value);
                  setCustomMsg('');
                }}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="hdpe-pn16-industrial-pipe">HDPE PN16 Industrial Pipe</option>
                <option value="pa66-gf30-engineering-polymer">Glass-Fiber Reinforced PA66</option>
                <option value="uv-black-carbon-masterbatch-om-cb90">UV Black Carbon Masterbatch</option>
                <option value="schedule-80-cpvc-industrial-flange">Schedule 80 CPVC Flange</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300">Custom Inquiry Message (Optional)</label>
              <textarea
                rows={2}
                placeholder="Or type a custom customer inquiry..."
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded p-3 space-y-2">
              <span className="text-[11px] font-mono text-slate-400">Generated API Response URL:</span>
              <p className="text-xs font-mono text-emerald-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                {generatedWaUrl || 'Generating...'}
              </p>

              <a
                href={generatedWaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors mt-2"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Test WhatsApp Click-to-Chat</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Admin Company Settings Editor */}
        <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                SQL Server Table: dbo.CompanySettings
              </span>
              <h3 className="text-sm font-semibold text-slate-100 mt-0.5">
                Editable Company Profile & Trust Data
              </h3>
            </div>

            {!token && (
              <button
                onClick={onQuickLogin}
                className="px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded"
              >
                Login as Admin to Save
              </button>
            )}
          </div>

          {saveSuccess && (
            <div className="bg-emerald-950/60 border border-emerald-800/80 rounded p-2.5 text-xs text-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Company settings saved to database.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300">Years of Experience</label>
                <input
                  type="number"
                  value={settings.yearsOfExperience}
                  onChange={e => setSettings({ ...settings, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300">Company Description</label>
              <textarea
                rows={2}
                value={settings.description}
                onChange={e => setSettings({ ...settings, description: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300">Email Contact</label>
                <input
                  type="email"
                  value={settings.emailContact}
                  onChange={e => setSettings({ ...settings, emailContact: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300">Phone Contact</label>
                <input
                  type="text"
                  value={settings.phoneContact}
                  onChange={e => setSettings({ ...settings, phoneContact: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsAppNumber}
                  onChange={e => setSettings({ ...settings, whatsAppNumber: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300">Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !token}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Updating SQL Record...' : 'Update Settings (PUT /api/admin/company)'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
