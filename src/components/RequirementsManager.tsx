import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Clock, Shield, Search, RefreshCw, MessageSquare } from 'lucide-react';

interface Requirement {
  requirementId: number;
  fullName: string;
  companyName?: string;
  email: string;
  phoneNumber: string;
  productOfInterest?: string;
  quantity?: string;
  requirementDescription: string;
  city?: string;
  state?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Rejected';
  adminRemarks?: string;
  createdAt: string;
}

interface RequirementsManagerProps {
  token: string | null;
  onQuickLogin: () => void;
}

export const RequirementsManager: React.FC<RequirementsManagerProps> = ({ token, onQuickLogin }) => {
  // Public form state
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    productOfInterest: 'HDPE PN16 Industrial Pipe',
    quantity: '500 Meters',
    requirementDescription: '',
    city: 'Ahmedabad',
    state: 'Gujarat'
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string[] | null>(null);

  // Admin Leads state
  const [leads, setLeads] = useState<Requirement[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Requirement | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editStatus, setEditStatus] = useState<string>('New');
  const [editRemarks, setEditRemarks] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchLeads = async () => {
    if (!token) return;
    setLeadsLoading(true);
    try {
      let url = `/api/admin/requirements?page=1&pageSize=50`;
      if (statusFilter !== 'All') url += `&status=${statusFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.data && json.data.items) {
        setLeads(json.data.items);
        if (!selectedLead && json.data.items.length > 0) {
          setSelectedLead(json.data.items[0]);
          setEditStatus(json.data.items[0].status);
          setEditRemarks(json.data.items[0].adminRemarks || '');
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [token, statusFilter, searchQuery]);

  const handleSubmitPublicForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(data.message || 'Requirement recorded successfully.');
        setFormData({
          fullName: '',
          companyName: '',
          email: '',
          phoneNumber: '',
          productOfInterest: 'HDPE PN16 Industrial Pipe',
          quantity: '500 Meters',
          requirementDescription: '',
          city: 'Ahmedabad',
          state: 'Gujarat'
        });
        // Auto refresh admin list if logged in
        if (token) fetchLeads();
      } else {
        setSubmitError(data.errors || [data.detail || data.message || 'Validation error']);
      }
    } catch (err) {
      setSubmitError(['Network error: Failed to connect to server']);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUpdateStatusAndRemarks = async () => {
    if (!selectedLead || !token) return;
    setUpdateLoading(true);
    try {
      const res = await fetch(`/api/admin/requirements/${selectedLead.requirementId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editStatus,
          adminRemarks: editRemarks
        })
      });
      const json = await res.json();
      if (res.ok) {
        setSelectedLead(json.data);
        fetchLeads();
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return 'text-blue-400 bg-blue-950/60 border-blue-800';
      case 'Contacted': return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'In Progress': return 'text-purple-400 bg-purple-950/60 border-purple-800';
      case 'Completed': return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
      case 'Rejected': return 'text-rose-400 bg-rose-950/60 border-rose-800';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Client Requirements & Lead Management Pipeline</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Demonstrates Phase 8 & Phase 11: Rate-limited public RFQ submission form paired with protected admin lead triage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Public Visitor Form */}
        <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Public Portal
            </span>
            <h3 className="text-sm font-semibold text-slate-100 mt-0.5">
              Submit Product Requirement / RFQ
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Rate-limited to 2 submissions / min. Saves permanently in SQL Server.
            </p>
          </div>

          {submitSuccess && (
            <div className="flex items-start gap-2 bg-emerald-950/60 border border-emerald-800/80 rounded-md p-3 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {submitError && (
            <div className="flex items-start gap-2 bg-rose-950/60 border border-rose-800/80 rounded-md p-3 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                {submitError.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitPublicForm} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajiv Menon"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Precision Pipes Ltd"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98250 12345"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300">Product of Interest</label>
                <select
                  value={formData.productOfInterest}
                  onChange={e => setFormData({ ...formData, productOfInterest: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="HDPE PN16 Industrial Pipe">HDPE PN16 Industrial Pipe</option>
                  <option value="Glass-Fiber Reinforced PA66">Glass-Fiber Reinforced PA66</option>
                  <option value="UV-Stabilized Black Carbon Masterbatch">UV Black Carbon Masterbatch</option>
                  <option value="Schedule 80 CPVC Flange Fitting">Schedule 80 CPVC Flange Fitting</option>
                  <option value="Custom Polymer Compound">Custom Polymer Compounding</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-300">Required Quantity</label>
                <input
                  type="text"
                  placeholder="e.g. 500 Meters / 10 MT"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300">Technical Requirement / Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Specify pressure rating, application environment, outer diameter, or standard specifications..."
                value={formData.requirementDescription}
                onChange={e => setFormData({ ...formData, requirementDescription: e.target.value })}
                className="w-full mt-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitLoading ? 'Transmitting to SQL Server...' : 'Submit Quotation Request'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Protected Admin Inbox */}
        <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Admin Panel
              </span>
              <h3 className="text-sm font-semibold text-slate-100 mt-0.5">
                Client Inquiries & CRM Leads
              </h3>
            </div>

            {!token ? (
              <button
                onClick={onQuickLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-md transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login to Access</span>
              </button>
            ) : (
              <button
                onClick={fetchLeads}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            )}
          </div>

          {!token ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              This section requires JWT Authorization with the <code className="text-slate-400 font-mono">Admin</code> role.
              Click "Admin Login to Access" above.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by name, company, email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {['All', 'New', 'Contacted', 'In Progress', 'Completed'].map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiries List & Detail Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Leads List */}
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {leadsLoading ? (
                    <div className="text-center py-8 text-xs text-slate-500">Loading leads...</div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">No leads matching filter.</div>
                  ) : (
                    leads.map(lead => {
                      const isSel = selectedLead?.requirementId === lead.requirementId;
                      return (
                        <div
                          key={lead.requirementId}
                          onClick={() => {
                            setSelectedLead(lead);
                            setEditStatus(lead.status);
                            setEditRemarks(lead.adminRemarks || '');
                          }}
                          className={`p-2.5 rounded border cursor-pointer transition-colors ${
                            isSel
                              ? 'bg-slate-900 border-blue-500/80'
                              : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-slate-200 truncate">
                              {lead.fullName}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${getStatusBadge(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {lead.companyName || 'Independent Inquirer'} · {lead.productOfInterest}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Lead Detail & Internal Remarks updater */}
                {selectedLead ? (
                  <div className="bg-slate-900/50 border border-slate-800 rounded p-3.5 space-y-3">
                    <div className="border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-bold text-slate-100">
                        {selectedLead.fullName}
                      </span>
                      <p className="text-[11px] text-slate-400">{selectedLead.companyName}</p>
                    </div>

                    <div className="text-[11px] space-y-1 font-mono text-slate-300">
                      <div><strong className="text-slate-500">Email:</strong> {selectedLead.email}</div>
                      <div><strong className="text-slate-500">Phone:</strong> {selectedLead.phoneNumber}</div>
                      <div><strong className="text-slate-500">Product:</strong> {selectedLead.productOfInterest}</div>
                      <div><strong className="text-slate-500">Quantity:</strong> {selectedLead.quantity}</div>
                      <div><strong className="text-slate-500">Location:</strong> {selectedLead.city}, {selectedLead.state}</div>
                    </div>

                    <div className="text-xs bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">
                      {selectedLead.requirementDescription}
                    </div>

                    {/* Status & Remarks editor */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-300">Status</label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300">Internal Admin Remarks (Private)</label>
                        <textarea
                          rows={2}
                          value={editRemarks}
                          onChange={e => setEditRemarks(e.target.value)}
                          placeholder="Add internal notes for sales reps..."
                          className="w-full mt-1 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-200"
                        />
                      </div>

                      <button
                        onClick={handleUpdateStatusAndRemarks}
                        disabled={updateLoading}
                        className="w-full py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors disabled:opacity-50"
                      >
                        {updateLoading ? 'Updating...' : 'Save Remarks & Status'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-xs text-slate-500">
                    Select a lead to inspect details.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
