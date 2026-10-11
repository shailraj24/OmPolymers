import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  RefreshCw, 
  Sun, 
  Moon, 
  CheckCircle2, 
  AlertCircle,
  Code2,
  Terminal,
  BookOpen,
  Sparkles,
  Layout,
  Users,
  Package,
  Layers,
  LogOut,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { angularSolutionFiles, AngularCodeFile } from '../angular-solution/angularFiles.js';
import { exportAngularZip, exportFullStackZip } from '../utils/zipExporter.js';

interface AngularPortalProps {
  onQuickLogin: () => void;
  token: string | null;
}

export const AngularPortal: React.FC<AngularPortalProps> = ({ onQuickLogin, token }) => {
  const [subView, setSubView] = useState<'simulator' | 'code' | 'docs'>('simulator');
  
  // Simulator Experience: 'user' or 'admin'
  const [roleMode, setRoleMode] = useState<'user' | 'admin'>('user');
  
  // User Portal sub-tab
  const [userTab, setUserTab] = useState<'home' | 'catalog' | 'quote' | 'maintenance'>('home');
  
  // Admin Panel sub-tab
  const [adminTab, setAdminTab] = useState<'dashboard' | 'inquiries' | 'products' | 'company' | 'users'>('dashboard');

  // Code Explorer state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFile, setSelectedFile] = useState<AngularCodeFile>(
    angularSolutionFiles.find(f => f.path === 'src/app/app.routes.ts') || angularSolutionFiles[0]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  // Live Interactive Simulator state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | undefined>(undefined);
  const [leads, setLeads] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  // Quote Form
  const [quoteFullName, setQuoteFullName] = useState('');
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteDescription, setQuoteDescription] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteFeedback, setQuoteFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Admin Inquiries Status Update Modal
  const [activeLead, setActiveLead] = useState<any | null>(null);
  const [leadStatus, setLeadStatus] = useState<string>('Contacted');
  const [leadRemarks, setLeadRemarks] = useState<string>('');

  // Fetch live API data
  const loadData = async () => {
    const start = performance.now();
    try {
      const compRes = await fetch('/api/company');
      const compJson = await compRes.json();
      if (compJson.success && compJson.data) setCompanyData(compJson.data);

      const prodRes = await fetch('/api/products?page=1&pageSize=20');
      const prodJson = await prodRes.json();
      if (prodJson.success && prodJson.data) setProducts(prodJson.data.items);

      const catRes = await fetch('/api/products/categories');
      const catJson = await catRes.json();
      if (catJson.success && catJson.data) setCategories(catJson.data);

      if (token) {
        const leadRes = await fetch('/api/admin/requirements?page=1&pageSize=50', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const leadJson = await leadRes.json();
        if (leadJson.success && leadJson.data) setLeads(leadJson.data.items);

        const usersRes = await fetch('/api/admin/users?page=1&pageSize=50', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usersJson = await usersRes.json();
        if (usersJson.success && usersJson.data) setAdminUsers(usersJson.data.items);
      }

      setApiLatency(Math.round(performance.now() - start));
    } catch {
      setApiLatency(null);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAngularZip = async () => {
    try {
      setDownloadingZip(true);
      await exportAngularZip();
    } catch (err) {
      console.error('Failed to download Angular ZIP', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadFullStackZip = async () => {
    try {
      setDownloadingZip(true);
      await exportFullStackZip();
    } catch (err) {
      console.error('Failed to download Full-Stack ZIP', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteFullName || !quoteEmail || !quotePhone || !quoteDescription) {
      setQuoteFeedback({
        type: 'error',
        message: 'Please complete all required fields.'
      });
      return;
    }

    setSubmittingQuote(true);
    setQuoteFeedback(null);

    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: quoteFullName,
          companyName: quoteCompany,
          email: quoteEmail,
          phoneNumber: quotePhone,
          requirementDescription: quoteDescription,
          productOfInterest: 'Industrial Polymer Extrusion'
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setQuoteFeedback({
          type: 'success',
          message: data.message || 'Quotation request submitted! Sales desk notified.'
        });
        setQuoteFullName('');
        setQuoteCompany('');
        setQuoteEmail('');
        setQuotePhone('');
        setQuoteDescription('');
        loadData();
      } else {
        setQuoteFeedback({
          type: 'error',
          message: (data.errors && data.errors[0]) || data.message || 'Submission failed.'
        });
      }
    } catch {
      setQuoteFeedback({
        type: 'error',
        message: 'Network error connecting to API.'
      });
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleSaveLeadStatus = async () => {
    if (!activeLead || !token) return;
    try {
      const res = await fetch(`/api/admin/requirements/${activeLead.requirementId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: leadStatus,
          adminRemarks: leadRemarks
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveLead(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProduct = async (id: number) => {
    if (!token) return;
    try {
      await fetch(`/api/admin/products/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAdminStatus = async (id: number) => {
    if (!token) return;
    try {
      await fetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const categoriesList = [
    'All',
    'Configuration',
    'Core & Services',
    'Interceptors & Guards',
    'Models & DTOs',
    'Layouts',
    'User Portal',
    'Admin Panel',
    'Auth',
    'Shared & Shell',
    'Unit Tests',
    'Documentation'
  ];

  const filteredFiles = angularSolutionFiles.filter(file => {
    const matchesCat = selectedCategory === 'All' || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredProducts = selectedCatId
    ? products.filter(p => p.category?.categoryId === selectedCatId)
    : products;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-red-600/20 text-red-400 border border-red-500/30">
              Angular 19 Standalone
            </span>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-blue-600/20 text-blue-400 border border-blue-500/30">
              Role-Based Architecture
            </span>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              Single Application
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            OM Polymer Role-Based Angular 19 Application
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Single Angular project hosting two role-based experiences: <strong>User Client Portal</strong> and <strong>Admin Panel</strong>. Powered by signals, reactive forms, functional HTTP interceptors, route guards, and live ASP.NET Core Web API integration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadAngularZip}
            disabled={downloadingZip}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingZip ? 'Packaging...' : 'Download Angular 19 ZIP'}</span>
          </button>
          <button
            onClick={handleDownloadFullStackZip}
            disabled={downloadingZip}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Full-Stack (.NET + Angular) ZIP</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Selector */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setSubView('simulator')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
            subView === 'simulator'
              ? 'border-blue-500 text-blue-400 bg-blue-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Interactive Role Simulator</span>
        </button>

        <button
          onClick={() => setSubView('code')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
            subView === 'code'
              ? 'border-blue-500 text-blue-400 bg-blue-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Angular Source Files ({angularSolutionFiles.length})</span>
        </button>

        <button
          onClick={() => setSubView('docs')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
            subView === 'docs'
              ? 'border-blue-500 text-blue-400 bg-blue-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Architecture & CLI Setup</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: INTERACTIVE SIMULATOR (USER & ADMIN EXPERIENCES) */}
      {/* ========================================================================= */}
      {subView === 'simulator' && (
        <div className="space-y-4">
          
          {/* Role Experience Switcher Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-300">Simulate Experience:</span>
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setRoleMode('user')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleMode === 'user'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🌐 User Client Portal
                </button>
                <button
                  onClick={() => setRoleMode('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleMode === 'admin'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🛡️ Admin Panel ({token ? 'Authenticated' : 'Locked'})
                </button>
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
                <span>Theme</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              {apiLatency !== null && (
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Latency: {apiLatency}ms
                </span>
              )}
              <button
                onClick={loadData}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
              >
                <RefreshCw className="w-3 h-3 text-emerald-400" />
                <span>Sync API</span>
              </button>
            </div>
          </div>

          {/* SIMULATION CONTAINER */}
          <div className={`border rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 ${
            isDarkMode ? 'bg-[#0f172a] text-[#e2e8f0] border-slate-800' : 'bg-[#f5f8ff] text-[#172554] border-slate-200'
          }`}>
            
            {/* ------------------------------------------------------------- */}
            {/* EXPERIENCE A: USER CLIENT PORTAL */}
            {/* ------------------------------------------------------------- */}
            {roleMode === 'user' && (
              <div className="min-h-[600px] flex flex-col">
                {/* User Navbar Header */}
                <header className={`px-6 py-4 border-b flex items-center justify-between ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                      OM
                    </div>
                    <div>
                      <div className="font-extrabold text-sm tracking-tight leading-none">OM POLYMER</div>
                      <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Client Portal</div>
                    </div>
                  </div>

                  <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                    <button 
                      onClick={() => setUserTab('home')}
                      className={`hover:text-blue-600 transition-colors ${userTab === 'home' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`}
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => setUserTab('catalog')}
                      className={`hover:text-blue-600 transition-colors ${userTab === 'catalog' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`}
                    >
                      Products ({products.length})
                    </button>
                    <button 
                      onClick={() => setUserTab('quote')}
                      className={`hover:text-blue-600 transition-colors ${userTab === 'quote' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`}
                    >
                      Request RFQ
                    </button>
                    <button 
                      onClick={() => setUserTab('maintenance')}
                      className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${userTab === 'maintenance' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Maintenance Ref
                    </button>
                  </nav>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRoleMode('admin')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
                    >
                      Admin Panel →
                    </button>
                  </div>
                </header>

                {/* User Sub-Tabs Content */}
                <div className="p-6 md:p-10 flex-1">
                  
                  {/* TAB 1: USER HOME */}
                  {userTab === 'home' && (
                    <div className="space-y-10 max-w-5xl mx-auto">
                      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-8 md:p-12 rounded-3xl text-white shadow-xl space-y-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          ISO 9001:2015 CERTIFIED MANUFACTURING
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          Enterprise Polymer Extrusion & High-Tensile HDPE Pipes
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                          Manufacturer of PE100 industrial piping, pressure-resistant compounds, and custom compounding masterbatches for severe hydrostatic infrastructure.
                        </p>
                        <div className="flex gap-3 pt-2">
                          <button onClick={() => setUserTab('catalog')} className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white">
                            Browse Catalog
                          </button>
                          <button onClick={() => setUserTab('quote')} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-white">
                            Request Specification Quote
                          </button>
                        </div>
                      </div>

                      {/* Direct Engineering Contacts */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <a href={`tel:${(companyData?.phoneContact || '+918866246042').replace(/\s+/g, '')}`} className={`p-5 rounded-2xl border text-center space-y-1.5 shadow-sm hover:shadow-lg transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="text-2xl">📞</div>
                          <div className="font-bold text-xs">Phone Support</div>
                          <div className="text-[11px] font-mono text-slate-500">{companyData?.phoneContact || '+91 8866246042'}</div>
                        </a>

                        <a href={`mailto:${companyData?.emailContact || 'sales@ompolymer.com'}`} className={`p-5 rounded-2xl border text-center space-y-1.5 shadow-sm hover:shadow-lg transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="text-2xl">✉️</div>
                          <div className="font-bold text-xs">Email Inquiry</div>
                          <div className="text-[11px] text-slate-500">{companyData?.emailContact || 'sales@ompolymer.com'}</div>
                        </a>

                        <a href="https://maps.google.com/?q=Vegdi+GIDC,+Plot+No.+59,+Dhoraji,+Gujarat,+India" target="_blank" rel="noopener noreferrer" className={`p-5 rounded-2xl border text-center space-y-1.5 shadow-sm hover:shadow-lg transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <div className="text-2xl">🏢</div>
                          <div className="font-bold text-xs">Manufacturing Unit</div>
                          <div className="text-[11px] text-slate-500">Vegdi GIDC, Dhoraji, Gujarat</div>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PRODUCT CATALOG */}
                  {userTab === 'catalog' && (
                    <div className="space-y-6 max-w-5xl mx-auto">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold">Industrial Product Lines</h2>
                          <p className="text-xs text-slate-500">Filter by application standard</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedCatId(undefined)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedCatId === undefined ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}
                          >
                            All
                          </button>
                          {categories.map(c => (
                            <button
                              key={c.categoryId}
                              onClick={() => setSelectedCatId(c.categoryId)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedCatId === c.categoryId ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}
                            >
                              {{ ...c }.categoryName}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {filteredProducts.map(p => (
                          <div key={p.productId} className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="space-y-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                {p.category?.categoryName || 'Standard'}
                              </span>
                              <h3 className="font-bold text-sm">{p.productName}</h3>
                              <p className="text-xs text-slate-500 line-clamp-3">{p.shortDescription}</p>
                              <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded text-[11px] font-mono text-slate-600 dark:text-slate-400">
                                {p.specifications}
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                              <button onClick={() => { setQuoteDescription(`Inquiry for: ${p.productName}`); setUserTab('quote'); }} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold">
                                Request RFQ
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: USER RFQ */}
                  {userTab === 'quote' && (
                    <div className="max-w-xl mx-auto space-y-4">
                      <div className={`p-8 rounded-3xl border shadow-xl space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h2 className="text-xl font-bold">Technical Requirement & RFQ Form</h2>
                        <p className="text-xs text-slate-500">Transmitted directly to engineering sales desk via <code className="text-blue-500 font-mono">POST /api/requirements</code></p>

                        {quoteFeedback && (
                          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                            quoteFeedback.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {quoteFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span>{quoteFeedback.message}</span>
                          </div>
                        )}

                        <form onSubmit={handleSubmitQuote} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold">Full Name *</label>
                              <input type="text" required value={quoteFullName} onChange={e => setQuoteFullName(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold">Company Name</label>
                              <input type="text" value={quoteCompany} onChange={e => setQuoteCompany(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold">Email *</label>
                              <input type="email" required value={quoteEmail} onChange={e => setQuoteEmail(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold">Phone *</label>
                              <input type="tel" required value={quotePhone} onChange={e => setQuotePhone(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold">Technical Specification *</label>
                            <textarea rows={3} required value={quoteDescription} onChange={e => setQuoteDescription(e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 dark:border-slate-700" placeholder="State dimensions, pressure class (PN), SDR rating, quantity..."></textarea>
                          </div>

                          <button type="submit" disabled={submittingQuote} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors">
                            {submittingQuote ? 'Submitting to API...' : 'Transmit RFQ'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: MAINTENANCE REFERENCE */}
                  {userTab === 'maintenance' && (
                    <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-4 py-6">
                      <div className="w-48 h-36 relative mx-auto">
                        <div className="absolute inset-0 bg-blue-950 rounded-xl p-2.5 flex items-center justify-center">
                          <div className="text-4xl animate-spin" style={{ animationDuration: '6s' }}>⚙️</div>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        MAINTENANCE REFERENCE VIEW
                      </div>
                      <h2 className="text-3xl font-extrabold">Site Under Maintenance</h2>
                      <p className="text-xs text-slate-500">
                        Recreated from your HTML specification file as a responsive component within the single Angular application.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* EXPERIENCE B: ADMIN PANEL */}
            {/* ------------------------------------------------------------- */}
            {roleMode === 'admin' && (
              <div className="min-h-[600px] flex flex-col md:flex-row bg-slate-950 text-white">
                
                {/* Admin Sidebar */}
                <aside className="w-full md:w-60 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">OM</div>
                      <div>
                        <div className="font-bold text-xs">OM Polymer Admin</div>
                        <div className="text-[10px] text-blue-400 font-mono">Role: {token ? 'SuperAdmin' : 'Guest'}</div>
                      </div>
                    </div>

                    <nav className="space-y-1 text-xs">
                      <button onClick={() => setAdminTab('dashboard')} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${adminTab === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <span>📊</span> Dashboard
                      </button>
                      <button onClick={() => setAdminTab('inquiries')} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${adminTab === 'inquiries' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <span>📋</span> Inquiries CRM ({leads.length})
                      </button>
                      <button onClick={() => setAdminTab('products')} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${adminTab === 'products' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <span>📦</span> Products ({products.length})
                      </button>
                      <button onClick={() => setAdminTab('company')} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${adminTab === 'company' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <span>🏢</span> Company & WhatsApp
                      </button>
                      <button onClick={() => setAdminTab('users')} className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${adminTab === 'users' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <span>🛡️</span> Admin Users ({adminUsers.length})
                      </button>
                    </nav>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-1 text-xs">
                    <button onClick={() => setRoleMode('user')} className="w-full text-left px-3 py-2 text-slate-400 hover:text-white">
                      ← Exit to Client Portal
                    </button>
                  </div>
                </aside>

                {/* Admin Body Content */}
                <div className="flex-1 p-6 space-y-6">
                  
                  {/* Auth Warning Bar if not logged in */}
                  {!token && (
                    <div className="p-3 bg-amber-950/60 border border-amber-800 rounded-xl flex items-center justify-between text-xs text-amber-300">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Viewing simulator in unauthenticated mode. Authenticate to test live write endpoints.</span>
                      </div>
                      <button onClick={onQuickLogin} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded text-xs">
                        Admin Login
                      </button>
                    </div>
                  )}

                  {/* ADMIN TAB 1: DASHBOARD */}
                  {adminTab === 'dashboard' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold">Admin KPI Overview</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-[11px] text-slate-400">Total Leads</div>
                          <div className="text-2xl font-bold text-blue-400">{leads.length}</div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-[11px] text-slate-400">Active Products</div>
                          <div className="text-2xl font-bold text-emerald-400">{products.filter(p => p.isActive).length}</div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-[11px] text-slate-400">Admin Accounts</div>
                          <div className="text-2xl font-bold text-purple-400">{adminUsers.length || 2}</div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-[11px] text-slate-400">System State</div>
                          <div className="text-xs font-mono text-emerald-400 mt-2">● Online (24h JWT)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 2: INQUIRIES CRM */}
                  {adminTab === 'inquiries' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold">Client Inquiries CRM</h2>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-3">Client</th>
                              <th className="p-3">Contact</th>
                              <th className="p-3">Product</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {leads.map(lead => (
                              <tr key={lead.requirementId}>
                                <td className="p-3">
                                  <div className="font-semibold text-white">{lead.fullName}</div>
                                  <div className="text-[10px] text-slate-400">{lead.companyName || 'Independent'}</div>
                                </td>
                                <td className="p-3">
                                  <div>{{ ...lead }.email}</div>
                                  <div className="font-mono text-slate-400">{lead.phoneNumber}</div>
                                </td>
                                <td className="p-3">{{ ...lead }.productOfInterest}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                                    {{ ...lead }.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button onClick={() => { setActiveLead(lead); setLeadStatus(lead.status); setLeadRemarks(lead.adminRemarks || ''); }} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs">
                                    Update
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 3: PRODUCTS */}
                  {adminTab === 'products' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold">Product Catalog Management</h2>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-3">Product</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Toggle</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {products.map(p => (
                              <tr key={p.productId}>
                                <td className="p-3 font-semibold">{{ ...p }.productName}</td>
                                <td className="p-3 text-slate-400">{{ ...p }.category?.categoryName}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                    {p.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button onClick={() => handleToggleProduct(p.productId)} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs">
                                    Toggle Active
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 4: COMPANY */}
                  {adminTab === 'company' && (
                    <div className="space-y-4 max-w-lg">
                      <h2 className="text-lg font-bold">Company Profile & WhatsApp Settings</h2>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
                        <div>
                          <div className="text-slate-400 font-semibold">Company Name:</div>
                          <div className="text-white font-mono mt-0.5">{companyData?.companyName}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-semibold">WhatsApp Number:</div>
                          <div className="text-white font-mono mt-0.5">{companyData?.whatsAppNumber}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-semibold">Support Email:</div>
                          <div className="text-white font-mono mt-0.5">{companyData?.emailContact}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 5: ADMIN USERS (SUPERADMIN) */}
                  {adminTab === 'users' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold">Administrative User Accounts (SuperAdmin)</h2>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-3">Admin</th>
                              <th className="p-3">Email</th>
                              <th className="p-3">Role</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Toggle</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {adminUsers.map(u => (
                              <tr key={u.adminId}>
                                <td className="p-3 font-semibold">{{ ...u }.fullName}</td>
                                <td className="p-3 font-mono text-slate-400">{{ ...u }.email}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'SuperAdmin' ? 'bg-amber-950 text-amber-400' : 'bg-blue-950 text-blue-400'}`}>
                                    {{ ...u }.role}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                    {u.isActive ? 'Active' : 'Deactivated'}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button onClick={() => handleToggleAdminStatus(u.adminId)} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs">
                                    Toggle Status
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Lead Status Modal */}
          {activeLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
                <button onClick={() => setActiveLead(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                <h3 className="text-base font-bold text-white">Update Lead Status</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                    <select value={leadStatus} onChange={e => setLeadStatus(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white">
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Admin Remarks</label>
                    <textarea value={leadRemarks} onChange={e => setLeadRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" placeholder="Add engineering quotation notes..."></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setActiveLead(null)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
                  <button onClick={handleSaveLeadStatus} className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Save Status</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ANGULAR SOURCE CODE EXPLORER */}
      {/* ========================================================================= */}
      {subView === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[700px]">
            <input
              type="text"
              placeholder="Search Angular files..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 mb-3"
            />

            <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-slate-800 text-[11px]">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {filteredFiles.map(file => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                        : 'bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[11px] font-medium text-slate-200 truncate">
                        {file.path}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {file.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="font-mono text-xs font-semibold text-slate-200 truncate block">
                  {selectedFile.path}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {selectedFile.description}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                  {selectedFile.language.toUpperCase()}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="whitespace-pre">
                {selectedFile.content.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row">
                    <span className="table-cell pr-4 text-right select-none text-slate-600 text-[11px] w-10">
                      {idx + 1}
                    </span>
                    <span className="table-cell">{line || ' '}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ARCHITECTURE & SETUP GUIDE */}
      {/* ========================================================================= */}
      {subView === 'docs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Role-Based Security Architecture
                </h3>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-white">Single Angular Application:</strong> Both public client portal and administrative panels exist in the same tree-shakeable Angular 19 codebase, separated by <code className="text-blue-400 font-mono">UserLayoutComponent</code> and <code className="text-blue-400 font-mono">AdminLayoutComponent</code>.
                </li>
                <li>
                  <strong className="text-white">Guards as User-Experience Layer:</strong> <code className="text-emerald-400 font-mono">authGuard</code> protects the entire <code className="text-blue-400 font-mono">/admin/*</code> path, while <code className="text-amber-400 font-mono">superAdminGuard</code> guarantees only users with role <code className="text-amber-400 font-mono">SuperAdmin</code> can reach <code className="text-blue-400 font-mono">/admin/users</code>.
                </li>
                <li>
                  <strong className="text-white">Authoritative Backend Middlewares:</strong> The ASP.NET Core backend enforces <code className="text-blue-400 font-mono">[Authorize(Roles = "Admin,SuperAdmin")]</code> and <code className="text-blue-400 font-mono">[Authorize(Roles = "SuperAdmin")]</code> on every API route.
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Angular CLI Commands
                </h3>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-slate-500"># Install Angular 19 & Tailwind dependencies</div>
                <div className="text-blue-400">npm install</div>
                <div className="text-slate-500"># Start dev server with reverse API proxy</div>
                <div className="text-emerald-400">npm start</div>
                <div className="text-slate-500"># Execute Jasmine / Karma unit test suites</div>
                <div className="text-blue-400">npm test</div>
                <div className="text-slate-500"># Generate AOT production bundles</div>
                <div className="text-emerald-400">npm run build</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
