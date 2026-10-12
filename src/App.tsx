/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { AngularPortal } from './components/AngularPortal.js';
import { ApiExplorer } from './components/ApiExplorer.js';
import { SolutionExplorer } from './components/SolutionExplorer.js';
import { DatabaseInspector } from './components/DatabaseInspector.js';
import { RequirementsManager } from './components/RequirementsManager.js';
import { CompanySettingsLab } from './components/CompanySettingsLab.js';
import { AdminUsersManager } from './components/AdminUsersManager.js';
import { LogsViewer } from './components/LogsViewer.js';
import { KeyRound, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('angular');
  const [token, setToken] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@ompolymer.com');
  const [loginPassword, setLoginPassword] = useState('Admin@123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Restore session from localStorage if present
  useEffect(() => {
    const savedToken = localStorage.getItem('om_token');
    const savedName = localStorage.getItem('om_admin_name');
    if (savedToken) {
      setToken(savedToken);
      setAdminName(savedName || 'System Administrator');
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const receivedToken = data.data.token;
        const fullName = data.data.fullName;
        setToken(receivedToken);
        setAdminName(fullName);
        localStorage.setItem('om_token', receivedToken);
        localStorage.setItem('om_admin_name', fullName);
        setShowLoginModal(false);
      } else {
        setLoginError(data.message || (data.errors && data.errors[0]) || 'Authentication failed');
      }
    } catch {
      setLoginError('Network error connecting to API');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setAdminName(null);
    localStorage.removeItem('om_token');
    localStorage.removeItem('om_admin_name');
  };

  const handleQuickLogin = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        token={token}
        onQuickLogin={handleQuickLogin}
        onLogout={handleLogout}
        adminName={adminName}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {activeTab === 'angular' && (
          <AngularPortal token={token} onQuickLogin={handleQuickLogin} />
        )}
        {activeTab === 'logs' && (
          <LogsViewer token={token} onQuickLogin={handleQuickLogin} />
        )}
        {activeTab === 'explorer' && (
          <ApiExplorer token={token} onSetToken={t => setToken(t)} />
        )}
        {activeTab === 'solution' && <SolutionExplorer />}
        {activeTab === 'admin_users' && (
          <AdminUsersManager token={token} onQuickLogin={handleQuickLogin} />
        )}
        {activeTab === 'database' && <DatabaseInspector />}
        {activeTab === 'leads' && (
          <RequirementsManager token={token} onQuickLogin={handleQuickLogin} />
        )}
        {activeTab === 'company' && (
          <CompanySettingsLab token={token} onQuickLogin={handleQuickLogin} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>OM Polymer Architecture & Full-Stack Platform · ASP.NET Core 10 LTS · Angular 19 Standalone</span>
          <span className="font-mono text-[11px] text-slate-400">
            Ahmedabad & Dhoraji, Gujarat · ISO 9001 Certified · 13+ Years Experience
          </span>
        </div>
      </footer>


      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Admin JWT Authentication
                </h3>
                <p className="text-[11px] text-slate-400">
                  Endpoint: <code className="text-blue-400 font-mono">POST /api/admin/auth/login</code>
                </p>
              </div>
            </div>

            {loginError && (
              <div className="mb-4 bg-rose-950/60 border border-rose-800/80 rounded p-2.5 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Pre-seeded Test Credentials:</div>
                <div>Email: <span className="font-mono text-blue-400">admin@ompolymer.com</span></div>
                <div>Password: <span className="font-mono text-blue-400">Admin@123</span></div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors disabled:opacity-50"
              >
                {loginLoading ? 'Authenticating & Issuing Token...' : 'Authenticate & Issue Bearer JWT'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
