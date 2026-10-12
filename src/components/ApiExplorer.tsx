import React, { useState } from 'react';
import { Play, Copy, Check, Lock, Unlock, Zap, RefreshCw, AlertTriangle, FileCode } from 'lucide-react';

interface EndpointDef {
  id: string;
  category: 'Company' | 'Products' | 'Blogs' | 'Requirements' | 'Testimonials' | 'Admin Auth' | 'Admin Users' | 'Media Uploads' | 'System Logs';
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  requiresAuth: boolean;
  rateLimited?: string;
  defaultParams?: Record<string, string>;
  defaultBody?: string;
}

const ENDPOINTS: EndpointDef[] = [
  // Auth
  {
    id: 'auth-login',
    category: 'Admin Auth',
    method: 'POST',
    path: '/api/admin/auth/login',
    summary: 'Admin login and JWT token issuance',
    requiresAuth: false,
    rateLimited: '5 req/min',
    defaultBody: JSON.stringify({ email: 'admin@ompolymer.com', password: 'Admin@123' }, null, 2)
  },
  {
    id: 'auth-forgot',
    category: 'Admin Auth',
    method: 'POST',
    path: '/api/admin/auth/forgot-password',
    summary: 'Request password reset link (rate-limited, generic response)',
    requiresAuth: false,
    rateLimited: '3 req/5min',
    defaultBody: JSON.stringify({ email: 'admin@ompolymer.com' }, null, 2)
  },
  {
    id: 'auth-reset',
    category: 'Admin Auth',
    method: 'POST',
    path: '/api/admin/auth/reset-password',
    summary: 'Execute password reset with token & BCrypt hashing',
    requiresAuth: false,
    defaultBody: JSON.stringify({
      email: 'admin@ompolymer.com',
      token: 'PASTE_RESET_TOKEN_HERE',
      newPassword: 'NewSecurePassword@123',
      confirmPassword: 'NewSecurePassword@123'
    }, null, 2)
  },
  {
    id: 'auth-change',
    category: 'Admin Auth',
    method: 'POST',
    path: '/api/admin/auth/change-password',
    summary: 'Change password for authenticated administrator',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      currentPassword: 'Admin@123',
      newPassword: 'NewChangedPassword@123',
      confirmPassword: 'NewChangedPassword@123'
    }, null, 2)
  },
  {
    id: 'auth-verify',
    category: 'Admin Auth',
    method: 'GET',
    path: '/api/admin/auth/verify',
    summary: 'Verify current JWT token claims and expiry',
    requiresAuth: true
  },

  // Admin User Management
  {
    id: 'admin-users-list',
    category: 'Admin Users',
    method: 'GET',
    path: '/api/admin/users',
    summary: 'Paginated admin users with search and role/status filtering',
    requiresAuth: true,
    defaultParams: { page: '1', pageSize: '10', role: 'All', status: 'All', search: '' }
  },
  {
    id: 'admin-users-get',
    category: 'Admin Users',
    method: 'GET',
    path: '/api/admin/users/1',
    summary: 'Get single admin details by ID (password hash excluded)',
    requiresAuth: true
  },
  {
    id: 'admin-users-create',
    category: 'Admin Users',
    method: 'POST',
    path: '/api/admin/users',
    summary: 'Create admin user with BCrypt hash and duplicate email check',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      fullName: 'Sanjay Mehta',
      email: 'sanjay@ompolymer.com',
      password: 'SecurePassword@123',
      role: 'Admin',
      profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isActive: true
    }, null, 2)
  },
  {
    id: 'admin-users-update',
    category: 'Admin Users',
    method: 'PUT',
    path: '/api/admin/users/2',
    summary: 'Update admin details (with last SuperAdmin safety guard)',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      fullName: 'Priya Sharma (Operations Lead)',
      email: 'priya.ops@ompolymer.com',
      role: 'Admin',
      isActive: true
    }, null, 2)
  },
  {
    id: 'admin-users-status',
    category: 'Admin Users',
    method: 'PATCH',
    path: '/api/admin/users/2/status',
    summary: 'Activate or deactivate admin account',
    requiresAuth: true,
    defaultBody: JSON.stringify({ isActive: false }, null, 2)
  },
  {
    id: 'admin-users-delete',
    category: 'Admin Users',
    method: 'DELETE',
    path: '/api/admin/users/2',
    summary: 'Soft-delete admin account (last SuperAdmin protected)',
    requiresAuth: true
  },

  // Company
  {
    id: 'company-get',
    category: 'Company',
    method: 'GET',
    path: '/api/company',
    summary: 'Retrieve company info (13 years exp, address, WhatsApp URL)',
    requiresAuth: false
  },
  {
    id: 'company-whatsapp',
    category: 'Company',
    method: 'GET',
    path: '/api/contact/whatsapp-url',
    summary: 'Generate dynamic URL-encoded WhatsApp chat link',
    requiresAuth: false,
    defaultParams: { productSlug: 'hdpe-pn16-industrial-pipe' }
  },
  {
    id: 'company-put',
    category: 'Company',
    method: 'PUT',
    path: '/api/admin/company',
    summary: 'Admin update configurable company details and contacts',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      companyName: 'OM Polymer Industries',
      description: 'Leading manufacturer of high-grade engineering polymers and HDPE piping systems.',
      yearsOfExperience: 13,
      aboutContent: 'Established in 2011 with over 13 years of polymer manufacturing excellence.',
      address: 'Plot 48/B, Industrial Area Phase II, G.I.D.C., Ahmedabad, Gujarat 382445, India',
      emailContact: 'inquiry@ompolymer.com',
      phoneContact: '+91 79 4002 9180',
      whatsAppNumber: '+919876543210'
    }, null, 2)
  },

  // Products
  {
    id: 'prod-list',
    category: 'Products',
    method: 'GET',
    path: '/api/products',
    summary: 'Get active products with pagination and category search',
    requiresAuth: false,
    defaultParams: { page: '1', pageSize: '10', search: '' }
  },
  {
    id: 'prod-slug',
    category: 'Products',
    method: 'GET',
    path: '/api/products/slug/hdpe-pn16-industrial-pipe',
    summary: 'Get single product by unique slug with gallery images',
    requiresAuth: false
  },
  {
    id: 'prod-featured',
    category: 'Products',
    method: 'GET',
    path: '/api/products/featured',
    summary: 'Get featured products for homepage catalog showcase',
    requiresAuth: false
  },
  {
    id: 'prod-categories',
    category: 'Products',
    method: 'GET',
    path: '/api/products/categories',
    summary: 'List active product categories',
    requiresAuth: false
  },
  {
    id: 'prod-create',
    category: 'Products',
    method: 'POST',
    path: '/api/admin/products',
    summary: 'Admin create product with slug uniqueness enforcement',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      productName: 'Cross-Linked Polyethylene (PEX-A) Heating Pipe',
      slug: 'pex-a-underfloor-heating-pipe',
      categoryId: 1,
      shortDescription: 'Flexible oxygen-barrier PEX-a piping for radiant floor heating and plumbing.',
      fullDescription: 'High-density Engel method peroxide cross-linked polyethylene pipe designed for hydronic heating applications.',
      specifications: 'Standard: DIN 4726 / ASTM F876; Max Temp: 95°C; Max Working Pressure: 10 bar.',
      mainImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      additionalImages: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
      ]
    }, null, 2)
  },
  {
    id: 'prod-status',
    category: 'Products',
    method: 'PATCH',
    path: '/api/admin/products/1/status',
    summary: 'Admin toggle product active/inactive state',
    requiresAuth: true
  },

  // Blogs
  {
    id: 'blog-list',
    category: 'Blogs',
    method: 'GET',
    path: '/api/blogs',
    summary: 'Get published blog posts (drafts strictly excluded)',
    requiresAuth: false,
    defaultParams: { page: '1', pageSize: '10' }
  },
  {
    id: 'blog-slug',
    category: 'Blogs',
    method: 'GET',
    path: '/api/blogs/advances-in-pe100-rc-resins-trenchless-installation',
    summary: 'Get published article by slug with meta tags',
    requiresAuth: false
  },
  {
    id: 'blog-create',
    category: 'Blogs',
    method: 'POST',
    path: '/api/admin/blogs',
    summary: 'Admin create blog post (can be draft or published)',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      title: 'Thermoplastic Elastomers in Medical Devices: Regulatory Trends 2026',
      slug: 'tpe-medical-devices-regulatory-trends',
      blogCategoryId: 1,
      shortDescription: 'How medical grade TPE is replacing PVC in infusion tubing and diagnostic seals.',
      content: '<p>With stringent USP Class VI guidelines, medical compounding has shifted towards plasticizer-free TPE formulations.</p>',
      featuredImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      author: 'Regulatory Affairs Team',
      metaTitle: 'Medical Grade TPE Trends | OM Polymer',
      metaDescription: 'Regulatory compliance for medical polymer compounding.',
      isPublished: true
    }, null, 2)
  },
  {
    id: 'blog-publish',
    category: 'Blogs',
    method: 'PATCH',
    path: '/api/admin/blogs/3/publish',
    summary: 'Admin publish draft article',
    requiresAuth: true
  },

  // Client Requirements (Leads)
  {
    id: 'req-submit',
    category: 'Requirements',
    method: 'POST',
    path: '/api/requirements',
    summary: 'Public customer quotation & requirement submission',
    requiresAuth: false,
    rateLimited: '2 req/min',
    defaultBody: JSON.stringify({
      fullName: 'Vikramaditya Rao',
      companyName: 'Larsen & Infra Construction Ltd',
      email: 'v.rao@larseningra.com',
      phoneNumber: '+919825123456',
      productOfInterest: 'HDPE PN16 Industrial Pipe',
      quantity: '3,500 meters (OD 250mm)',
      requirementDescription: 'Need quotation and hydrostatic burst test reports for raw water intake line in Dahej SEZ.',
      city: 'Bharuch',
      state: 'Gujarat'
    }, null, 2)
  },
  {
    id: 'req-list',
    category: 'Requirements',
    method: 'GET',
    path: '/api/admin/requirements',
    summary: 'Admin review customer submissions with internal remarks',
    requiresAuth: true,
    defaultParams: { page: '1', pageSize: '10', status: 'All' }
  },
  {
    id: 'req-status',
    category: 'Requirements',
    method: 'PATCH',
    path: '/api/admin/requirements/1/status',
    summary: 'Admin update lead status and internal sales remarks',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      status: 'In Progress',
      adminRemarks: 'Technical team reviewed specs. Dispatching official proforma quote on Monday.'
    }, null, 2)
  },

  // Testimonials
  {
    id: 'test-get',
    category: 'Testimonials',
    method: 'GET',
    path: '/api/testimonials',
    summary: 'Get approved and published customer reviews',
    requiresAuth: false
  },
  {
    id: 'test-admin-list',
    category: 'Testimonials',
    method: 'GET',
    path: '/api/admin/testimonials',
    summary: 'Admin view all testimonials (including unapproved)',
    requiresAuth: true
  },
  {
    id: 'test-create',
    category: 'Testimonials',
    method: 'POST',
    path: '/api/admin/testimonials',
    summary: 'Admin add authorized customer review',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      displayName: 'Kiran Dave',
      companyOrDesignation: 'Project Director, Mehsana Irrigation Project',
      reviewText: 'The quality of OM Polymer HDPE coils met all BIS testing standards with zero ovality defects.',
      rating: 5,
      isApproved: true,
      isPublished: true
    }, null, 2)
  },

  // Media Uploads
  {
    id: 'upload-image',
    category: 'Media Uploads',
    method: 'POST',
    path: '/api/uploads/image',
    summary: 'Upload image file via UploadImageRequest DTO (Category + File)',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      category: 'products',
      fileName: 'hdpe_sample_photo.webp',
      contentType: 'image/webp'
    }, null, 2)
  },
  {
    id: 'upload-delete',
    category: 'Media Uploads',
    method: 'DELETE',
    path: '/api/uploads/image',
    summary: 'Delete physical image file by relative path',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      path: '/uploads/products/hdpe_sample_photo.webp'
    }, null, 2)
  },

  // System Logs
  {
    id: 'logs-list',
    category: 'System Logs',
    method: 'GET',
    path: '/api/admin/logs',
    summary: 'Stream live structured logs from host /logs directory',
    requiresAuth: true,
    defaultParams: {
      filename: 'ompolymer-api.log',
      level: 'ALL',
      limit: '100'
    }
  },
  {
    id: 'logs-files',
    category: 'System Logs',
    method: 'GET',
    path: '/api/admin/logs/files',
    summary: 'List available physical log files on host disk',
    requiresAuth: true
  },
  {
    id: 'logs-clear',
    category: 'System Logs',
    method: 'POST',
    path: '/api/admin/logs/clear',
    summary: 'Rotate and clear active server log file',
    requiresAuth: true,
    defaultBody: JSON.stringify({
      filename: 'ompolymer-api.log'
    }, null, 2)
  }
];

interface ApiExplorerProps {
  token: string | null;
  onSetToken: (token: string) => void;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ token }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [params, setParams] = useState<Record<string, string>>(selectedEndpoint.defaultParams || {});
  const [requestBody, setRequestBody] = useState<string>(selectedEndpoint.defaultBody || '');
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [rateLimitTesting, setRateLimitTesting] = useState(false);

  // When endpoint changes, refresh params and body
  const selectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setParams(ep.defaultParams || {});
    setRequestBody(ep.defaultBody || '');
    setResponseStatus(null);
    setResponseBody(null);
    setDurationMs(null);
  };

  const executeRequest = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseBody(null);
    setDurationMs(null);

    // Build URL with query params
    let url = selectedEndpoint.path;
    const queryParts: string[] = [];
    Object.entries(params).forEach(([k, v]) => {
      if (v) queryParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    });
    if (queryParts.length > 0 && selectedEndpoint.method === 'GET') {
      url += `?${queryParts.join('&')}`;
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
      headers['Content-Type'] = 'application/json';
    }

    const startTime = performance.now();
    try {
      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers,
        body: ['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) ? requestBody : undefined
      });
      const endTime = performance.now();
      setDurationMs(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      // Collect headers
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });
      setResponseHeaders(resHeaders);

      const data = await res.json();
      setResponseBody(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      const endTime = performance.now();
      setDurationMs(Math.round(endTime - startTime));
      setResponseStatus(500);
      setResponseBody(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // Simulate Rate Limit spam test (send 3 rapid POST to /api/requirements)
  const testRateLimiting = async () => {
    setRateLimitTesting(true);
    const reqEndpoint = ENDPOINTS.find(e => e.id === 'req-submit')!;
    selectEndpoint(reqEndpoint);

    const results = [];
    for (let i = 1; i <= 3; i++) {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: reqEndpoint.defaultBody
      });
      const data = await res.json();
      results.push({
        requestIndex: i,
        httpStatus: res.status,
        headers: {
          'x-ratelimit-limit': res.headers.get('x-ratelimit-limit'),
          'x-ratelimit-remaining': res.headers.get('x-ratelimit-remaining'),
          'retry-after': res.headers.get('retry-after')
        },
        payload: data
      });
    }

    setResponseStatus(results[2].httpStatus);
    setResponseBody(JSON.stringify({
      message: 'Rate Limit Benchmark Results (Policy: RequirementPolicy, 2 requests / minute)',
      sequence: results
    }, null, 2));
    setRateLimitTesting(false);
  };

  const copyResponse = () => {
    if (responseBody) {
      navigator.clipboard.writeText(responseBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categories = ['All', 'System Logs', 'Admin Auth', 'Admin Users', 'Media Uploads', 'Company', 'Products', 'Blogs', 'Requirements', 'Testimonials'];
  const filteredEndpoints = categoryFilter === 'All'
    ? ENDPOINTS
    : ENDPOINTS.filter(e => e.category === categoryFilter);

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'POST': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PUT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'PATCH': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'DELETE': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    if (status === 429) return 'text-amber-400 bg-amber-950/60 border-amber-800';
    if (status >= 400 && status < 500) return 'text-rose-400 bg-rose-950/60 border-rose-800';
    return 'text-red-400 bg-red-950/60 border-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Rate Limit Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>REST API Swagger & Execution Sandbox</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real endpoints running on live Express backend with RFC Problem Details, JWT validation, and Rate Limiting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={testRateLimiting}
            disabled={rateLimitTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-md transition-colors"
            title="Spam 3 requests to trigger HTTP 429 Too Many Requests"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{rateLimitTesting ? 'Triggering...' : 'Test Rate Limit (Spam 3 Req)'}</span>
          </button>
          <a
            href="/api/docs/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>OpenAPI 3.0 JSON</span>
          </a>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main 2-Column Split: Endpoints List & Request/Response Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Endpoints List */}
        <div className="lg:col-span-5 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredEndpoints.map(ep => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => selectEndpoint(ep)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500/70 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getMethodBadgeClass(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-200 truncate">
                      {ep.path}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {ep.requiresAuth ? (
                      <span title="Requires JWT Bearer Auth">
                        <Lock className="w-3 h-3 text-amber-400/80" />
                      </span>
                    ) : (
                      <span title="Public Endpoint">
                        <Unlock className="w-3 h-3 text-slate-500" />
                      </span>
                    )}
                    {ep.rateLimited && (
                      <span className="text-[10px] text-amber-400 font-mono" title={`Rate Limited: ${ep.rateLimited}`}>
                        ⚡
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {ep.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Execution Workbench */}
        <div className="lg:col-span-7 space-y-4 bg-slate-900/40 border border-slate-800 rounded-lg p-5">
          {/* Active Endpoint Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getMethodBadgeClass(selectedEndpoint.method)}`}>
                {selectedEndpoint.method}
              </span>
              <span className="text-sm font-mono font-semibold text-slate-100">
                {selectedEndpoint.path}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedEndpoint.requiresAuth && !token && (
                <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40">
                  <AlertTriangle className="w-3 h-3" />
                  <span>No JWT attached</span>
                </div>
              )}
              <button
                onClick={executeRequest}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>Execute Request</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            {selectedEndpoint.summary}
          </p>

          {/* Query Parameters (if any) */}
          {Object.keys(params).length > 0 && selectedEndpoint.method === 'GET' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Query Parameters
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(params).map(([key, val]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-mono text-slate-400">{key}</span>
                    <input
                      type="text"
                      value={val}
                      onChange={e => setParams({ ...params, [key]: e.target.value })}
                      className="bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body (for POST, PUT, PATCH) */}
          {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Request JSON Body
                </label>
                <span className="text-[11px] font-mono text-slate-500">application/json</span>
              </div>
              <textarea
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                rows={7}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-md p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>
          )}

          {/* Response Inspector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Response
                </span>
                {responseStatus !== null && (
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${getStatusBadge(responseStatus)}`}>
                    HTTP {responseStatus}
                  </span>
                )}
                {durationMs !== null && (
                  <span className="text-xs font-mono text-slate-400">
                    {durationMs}ms
                  </span>
                )}
              </div>

              {responseBody && (
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            {/* Rate limit headers badge if present */}
            {responseHeaders['x-ratelimit-remaining'] !== undefined && (
              <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 p-2 rounded border border-slate-800 flex gap-4">
                <span>Limit: <strong className="text-slate-200">{responseHeaders['x-ratelimit-limit']}</strong></span>
                <span>Remaining: <strong className="text-slate-200">{responseHeaders['x-ratelimit-remaining']}</strong></span>
                {responseHeaders['retry-after'] && (
                  <span className="text-amber-400">Retry After: {responseHeaders['retry-after']}s</span>
                )}
              </div>
            )}

            <div className="bg-slate-950 border border-slate-800 rounded-md p-3 max-h-[360px] overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-xs text-slate-400 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Executing HTTP request...</span>
                </div>
              ) : responseBody ? (
                <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap break-all">
                  {responseBody}
                </pre>
              ) : (
                <div className="text-center py-10 text-xs text-slate-500 font-mono">
                  Press "Execute Request" to dispatch HTTP call to the OM Polymer server
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
