import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, KeyRound, ShieldAlert, CheckCircle2, 
  AlertCircle, Search, RefreshCw, Edit, Trash2, Power, 
  ShieldCheck, Send, Lock, ArrowRight, UserCheck, Shield
} from 'lucide-react';

interface AdminUser {
  adminId: number;
  fullName: string;
  email: string;
  role: 'SuperAdmin' | 'Admin';
  profileImageUrl?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

interface AdminUsersManagerProps {
  token: string | null;
  onQuickLogin: () => void;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({
  token,
  onQuickLogin
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  
  // Create Admin Form State
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Admin' as 'SuperAdmin' | 'Admin',
    profileImageUrl: '',
    isActive: true
  });

  // Edit Admin Form State
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    role: 'Admin' as 'SuperAdmin' | 'Admin',
    profileImageUrl: '',
    isActive: true
  });

  // Password Recovery Simulator State
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'recovery'>('users');
  const [forgotEmail, setForgotEmail] = useState('admin@ompolymer.com');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResponse, setForgotResponse] = useState<string | null>(null);
  const [resetTokenReceived, setResetTokenReceived] = useState<string>('');
  
  const [resetEmail, setResetEmail] = useState('admin@ompolymer.com');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetResponse, setResetResponse] = useState<{ success: boolean; message: string } | null>(null);

  const fetchAdmins = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
        ...(roleFilter !== 'All' ? { role: roleFilter } : {}),
        ...(statusFilter !== 'All' ? { status: statusFilter } : {}),
        ...(search.trim() ? { search: search.trim() } : {})
      });

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setAdmins(json.data.items || []);
        setTotalPages(json.data.totalPages || 1);
        setTotalCount(json.data.totalCount || 0);
      } else {
        setError(json.message || 'Failed to fetch administrator accounts.');
      }
    } catch {
      setError('Network error while querying admin users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdmins();
    }
  }, [token, page, roleFilter, statusFilter, search]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createForm)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMsg(`Administrator '${createForm.fullName}' successfully created.`);
        setShowCreateModal(false);
        setCreateForm({
          fullName: '',
          email: '',
          password: '',
          role: 'Admin',
          profileImageUrl: '',
          isActive: true
        });
        fetchAdmins();
      } else {
        setError(json.message || (json.errors && json.errors[0]) || 'Failed to create administrator.');
      }
    } catch {
      setError('Network failure while creating administrator.');
    }
  };

  const handleEditClick = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEditForm({
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      profileImageUrl: admin.profileImageUrl || '',
      isActive: admin.isActive
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingAdmin) return;

    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/users/${editingAdmin.adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMsg(`Administrator '${editForm.fullName}' successfully updated.`);
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        setError(json.message || (json.errors && json.errors[0]) || 'Failed to update administrator.');
      }
    } catch {
      setError('Network failure while updating administrator.');
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    if (!token) return;
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/users/${admin.adminId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !admin.isActive })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMsg(`Account '${admin.fullName}' is now ${!admin.isActive ? 'Active' : 'Inactive'}.`);
        fetchAdmins();
      } else {
        setError(json.message || (json.errors && json.errors[0]) || 'Failed to change account status.');
      }
    } catch {
      setError('Network error toggling administrator status.');
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to soft-delete administrator '${admin.fullName}'?`)) return;

    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/users/${admin.adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMsg(`Account '${admin.fullName}' has been soft-deleted.`);
        fetchAdmins();
      } else {
        setError(json.message || (json.errors && json.errors[0]) || 'Failed to delete administrator.');
      }
    } catch {
      setError('Network error deleting administrator.');
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotResponse(null);

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const json = await res.json();
      if (json.success) {
        setForgotResponse(json.message);
        if (json.data && json.data.debugTokenHint) {
          setResetTokenReceived(json.data.debugTokenHint);
          setResetToken(json.data.debugTokenHint);
          setResetEmail(forgotEmail);
        }
      } else {
        setForgotResponse(json.message || 'Request failed.');
      }
    } catch {
      setForgotResponse('Network error calling forgot-password endpoint.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Reset password handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetResponse(null);

    try {
      const res = await fetch('/api/admin/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          token: resetToken,
          newPassword,
          confirmPassword
        })
      });

      const json = await res.json();
      setResetResponse({
        success: json.success,
        message: json.message || (json.errors && json.errors[0]) || 'Operation completed.'
      });

      if (json.success) {
        setNewPassword('');
        setConfirmPassword('');
        if (token) fetchAdmins();
      }
    } catch {
      setResetResponse({
        success: false,
        message: 'Network error calling reset-password endpoint.'
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Subtab Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-semibold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Admin User Management & Security
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ASP.NET Core Identity & BCrypt security, role-based access control, and password recovery lifecycle.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center bg-slate-950 p-1 rounded-md border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubTab === 'users'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Administrators ({totalCount})
          </button>
          <button
            onClick={() => setActiveSubTab('recovery')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'recovery'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Password Recovery
          </button>
        </div>
      </div>

      {/* Global Toast / Feedback */}
      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-sm px-4 py-3 rounded-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-300 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-950/40 border border-red-800/80 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* SUBTAB 1: USERS DIRECTORY */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {!token ? (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-semibold text-slate-100">
                  Authentication Required
                </h3>
                <p className="text-xs text-slate-400">
                  Administrative user management requires an authorized JWT Bearer token with SuperAdmin or Admin role privileges.
                </p>
              </div>
              <button
                onClick={onQuickLogin}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                Sign In as Super Administrator
              </button>
            </div>
          ) : (
            <>
              {/* Controls Toolbar: Search, Filters, and New Admin Button */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-lg">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  {/* Search bar */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search admin by name or email..."
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Role filter */}
                  <select
                    value={roleFilter}
                    onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                    className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Roles</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                    <option value="Admin">Admin</option>
                  </select>

                  {/* Status filter */}
                  <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active Accounts</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>

                  <button
                    onClick={fetchAdmins}
                    disabled={loading}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-md transition-colors"
                    title="Refresh data"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Administrator
                </button>
              </div>

              {/* Security Guard Notice */}
              <div className="bg-slate-900/60 border border-blue-900/40 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-blue-300">Enterprise Security Guarantees:</span>{' '}
                  Passwords are never stored in plain text or returned in any API responses (BCrypt hashed). Inactive administrators are immediately blocked from logging in. Global safety rules prevent the last active SuperAdmin from being deactivated, deleted, or demoted.
                </div>
              </div>

              {/* Admins Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Administrator</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Last Login</th>
                        <th className="py-3 px-4">Created Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                            Loading administrator directory...
                          </td>
                        </tr>
                      ) : admins.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No administrators found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        admins.map(admin => (
                          <tr key={admin.adminId} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {admin.profileImageUrl ? (
                                  <img
                                    src={admin.profileImageUrl}
                                    alt={admin.fullName}
                                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs">
                                    {admin.fullName.slice(0, 2).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-slate-100">{admin.fullName}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">{admin.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                admin.role === 'SuperAdmin'
                                  ? 'bg-purple-950/60 text-purple-300 border-purple-800/80'
                                  : 'bg-blue-950/60 text-blue-300 border-blue-800/80'
                              }`}>
                                <Shield className="w-3 h-3" />
                                {admin.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                admin.isActive
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                                  : 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                {admin.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                              {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Never'}
                            </td>
                            <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                              {new Date(admin.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Toggle Active Status */}
                                <button
                                  onClick={() => handleToggleStatus(admin)}
                                  className={`p-1.5 rounded transition-colors ${
                                    admin.isActive
                                      ? 'text-amber-400 hover:bg-amber-950/50 hover:text-amber-300'
                                      : 'text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300'
                                  }`}
                                  title={admin.isActive ? 'Deactivate Account' : 'Activate Account'}
                                >
                                  <Power className="w-4 h-4" />
                                </button>

                                {/* Edit Button */}
                                <button
                                  onClick={() => handleEditClick(admin)}
                                  className="p-1.5 rounded text-blue-400 hover:bg-blue-950/50 hover:text-blue-300 transition-colors"
                                  title="Edit Administrator"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                {/* Soft Delete Button */}
                                <button
                                  onClick={() => handleDelete(admin)}
                                  className="p-1.5 rounded text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors"
                                  title="Soft Delete Administrator"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
                  <div>
                    Showing {admins.length} of {totalCount} accounts (Page {page} of {totalPages})
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* SUBTAB 2: PASSWORD RECOVERY & RESET SIMULATOR */}
      {activeSubTab === 'recovery' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1: Forgot Password Request */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-7 h-7 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  1. Request Password Reset Link
                </h3>
                <p className="text-[11px] text-slate-400">
                  Rate-limited via <code className="text-blue-300 font-mono">ForgotPasswordPolicy</code> (3 requests / 5 min).
                </p>
              </div>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Registered Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="admin@ompolymer.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Always returns a generic success response to prevent account enumeration.
                </p>
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {forgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Dispatch Reset Email & Token
              </button>
            </form>

            {forgotResponse && (
              <div className="bg-slate-950 border border-slate-800 rounded-md p-3 space-y-2 text-xs">
                <div className="font-semibold text-slate-200">Server Response (RFC Compliant):</div>
                <div className="text-slate-300 bg-slate-900 p-2 rounded text-[11px]">
                  {forgotResponse}
                </div>

                {resetTokenReceived && (
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium mb-1">
                      <span>Cryptographically Generated Single-Use Token:</span>
                      <span className="text-[10px] text-slate-400">Expires in 1 Hour</span>
                    </div>
                    <div className="font-mono text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 p-2 rounded break-all select-all">
                      {resetTokenReceived}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResetToken(resetTokenReceived);
                        setResetEmail(forgotEmail);
                      }}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-medium"
                    >
                      Autofill into Step 2 below <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Reset Password with Token */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-7 h-7 rounded bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  2. Execute Password Reset
                </h3>
                <p className="text-[11px] text-slate-400">
                  Validates token SHA-256 hash, invalidates all active tokens, and hashes password via BCrypt.
                </p>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Single-Use Reset Token (Hex 64-char)
                </label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={e => setResetToken(e.target.value)}
                  placeholder="Paste or autofill token here"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    New Password (Min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-md text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {resetLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Reset & Invalidate Token
              </button>
            </form>

            {resetResponse && (
              <div className={`p-3 rounded-md border text-xs ${
                resetResponse.success
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                  : 'bg-red-950/40 border-red-800/80 text-red-200'
              }`}>
                <div className="flex items-center gap-2 font-semibold">
                  {resetResponse.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span>{resetResponse.success ? 'Password Reset Succeeded' : 'Password Reset Rejected'}</span>
                </div>
                <p className="mt-1 text-[11px]">{resetResponse.message}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE ADMIN USER */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold text-slate-100">
                  Create New Administrator
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.fullName}
                  onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="ramesh@ompolymer.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Initial Password * (Min 8 chars, hashed with BCrypt)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={createForm.password}
                  onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="SecurePassword@123"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Role *
                  </label>
                  <select
                    value={createForm.role}
                    onChange={e => setCreateForm({ ...createForm, role: e.target.value as 'SuperAdmin' | 'Admin' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={createForm.isActive ? 'true' : 'false'}
                    onChange={e => setCreateForm({ ...createForm, isActive: e.target.value === 'true' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Profile Avatar URL (Optional)
                </label>
                <input
                  type="url"
                  value={createForm.profileImageUrl}
                  onChange={e => setCreateForm({ ...createForm, profileImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ADMIN USER */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold text-slate-100">
                  Edit Administrator: {editingAdmin.fullName}
                </h3>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Role *
                  </label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm({ ...editForm, role: e.target.value as 'SuperAdmin' | 'Admin' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Account Status
                  </label>
                  <select
                    value={editForm.isActive ? 'true' : 'false'}
                    onChange={e => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Profile Avatar URL
                </label>
                <input
                  type="url"
                  value={editForm.profileImageUrl}
                  onChange={e => setEditForm({ ...editForm, profileImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
