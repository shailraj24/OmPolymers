import React from 'react';
import { Download, ShieldCheck, KeyRound, LogOut, Sparkles } from 'lucide-react';
import { exportSolutionZip, exportAngularZip } from '../utils/zipExporter.js';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  token: string | null;
  onQuickLogin: () => void;
  onLogout: () => void;
  adminName: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  token,
  onQuickLogin,
  onLogout,
  adminName
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await exportAngularZip();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setDownloading(false);
    }
  };

  const navLinks = [
    { id: 'angular', label: 'Angular 19 App', highlight: true },
    { id: 'logs', label: 'System Logs' },
    { id: 'explorer', label: 'API Explorer' },
    { id: 'solution', label: '.NET 10 Solution' },
    { id: 'admin_users', label: 'Admin Security' },
    { id: 'database', label: 'SQL Server DB' },
    { id: 'leads', label: 'Inquiries CRM' },
    { id: 'company', label: 'Company & WhatsApp' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-sm">
            OM
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-slate-100 tracking-tight leading-none whitespace-nowrap">
              OM Polymer
            </span>
            <span className="text-[11px] text-slate-400 font-mono tracking-wide leading-tight mt-0.5 whitespace-nowrap">
              ASP.NET Core 10 & Angular 19
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  isActive
                    ? 'border-blue-500 text-blue-400'
                    : link.highlight
                    ? 'border-transparent text-amber-400 hover:text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.highlight && <Sparkles className="w-3 h-3 text-amber-400" />}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & JWT Auth Status */}
        <div className="flex items-center gap-3 shrink-0">
          {token ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/70 rounded-md px-2.5 py-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-medium truncate max-w-[120px]">
                {adminName || 'Admin'}
              </span>
              <button
                onClick={onLogout}
                title="Logout and revoke current Bearer token"
                className="text-slate-400 hover:text-rose-400 ml-1 p-0.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onQuickLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
              title="Authenticate with default admin credentials (admin@ompolymer.com)"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Login</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Packing...' : 'Download Angular 19 ZIP'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

