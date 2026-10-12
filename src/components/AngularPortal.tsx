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
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  MessageCircle,
  ArrowRight,
  FileText,
  Sliders,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Activity,
  HardDrive,
  RotateCw
} from 'lucide-react';
import { ImageUploadDropzone, uploadImageFile } from './ImageUploadDropzone.js';
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
  
  // User Portal sub-tab: 'home' | 'catalog' | 'blogs' | 'about' | 'quote' | 'maintenance'
  const [userTab, setUserTab] = useState<'home' | 'catalog' | 'blogs' | 'about' | 'quote' | 'maintenance'>('home');
  
  // Admin Panel sub-tab: 'dashboard' | 'products' | 'blogs' | 'inquiries' | 'logs' | 'company' | 'users'
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'blogs' | 'inquiries' | 'logs' | 'company' | 'users'>('dashboard');

  // Code Explorer state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFile, setSelectedFile] = useState<AngularCodeFile>(
    angularSolutionFiles.find(f => f.path === 'src/app/app.routes.ts') || angularSolutionFiles[0]
  );
  const [codeSearchTerm, setCodeSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  // Live Interactive Simulator state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | undefined>(undefined);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductDetail, setSelectedProductDetail] = useState<any | null>(null);

  // Blogs State
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogCategories, setBlogCategories] = useState<any[]>([]);
  const [selectedBlogCatId, setSelectedBlogCatId] = useState<number | undefined>(undefined);
  const [blogSearch, setBlogSearch] = useState('');
  const [selectedBlogDetail, setSelectedBlogDetail] = useState<any | null>(null);

  // Admin Inquiries State
  const [leads, setLeads] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  // Dynamic Logs State
  const [logEntries, setLogEntries] = useState<any[]>([]);
  const [logFiles, setLogFiles] = useState<any[]>([]);
  const [selectedLogFile, setSelectedLogFile] = useState<string>('ompolymer-api.log');
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');
  const [logLoading, setLogLoading] = useState<boolean>(false);

  // Quote Form
  const [quoteFullName, setQuoteFullName] = useState('');
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteProductOfInterest, setQuoteProductOfInterest] = useState('');
  const [quoteDescription, setQuoteDescription] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteFeedback, setQuoteFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Admin Inquiries Status Update Modal
  const [activeLead, setActiveLead] = useState<any | null>(null);
  const [leadStatus, setLeadStatus] = useState<string>('Contacted');
  const [leadRemarks, setLeadRemarks] = useState<string>('');

  // Admin Product Add/Edit Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    productName: '',
    slug: '',
    categoryId: '1',
    shortDescription: '',
    fullDescription: '',
    specifications: '',
    mainImageUrl: '',
    isFeatured: false
  });
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [stagedProductFile, setStagedProductFile] = useState<File | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Admin Blog Add/Edit Modal
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    blogCategoryId: '1',
    shortDescription: '',
    content: '',
    featuredImageUrl: '',
    author: 'OM Polymer Editorial',
    isPublished: true
  });
  const [blogToDelete, setBlogToDelete] = useState<any | null>(null);
  const [blogFormError, setBlogFormError] = useState<string | null>(null);
  const [stagedBlogFile, setStagedBlogFile] = useState<File | null>(null);
  const [isSavingBlog, setIsSavingBlog] = useState(false);

  // Admin Company Settings Form
  const [companyForm, setCompanyForm] = useState<any>({});
  const [stagedLogoFile, setStagedLogoFile] = useState<File | null>(null);
  const [savingCompany, setSavingCompany] = useState(false);
  const [companyFeedback, setCompanyFeedback] = useState<string | null>(null);

  // Fetch live API data
  const loadData = async () => {
    const start = performance.now();
    try {
      // 1. Company info
      const compRes = await fetch('/api/company');
      const compJson = await compRes.json();
      if (compJson.success && compJson.data) {
        setCompanyData(compJson.data);
        setCompanyForm({ ...compJson.data });
      }

      // 2. Products
      const prodEndpoint = token && roleMode === 'admin' 
        ? '/api/admin/products?page=1&pageSize=50' 
        : '/api/products?page=1&pageSize=50';
      const prodRes = await fetch(prodEndpoint, {
        headers: token && roleMode === 'admin' ? { Authorization: `Bearer ${token}` } : {}
      });
      const prodJson = await prodRes.json();
      if (prodJson.success && prodJson.data) {
        setProducts(prodJson.data.items || []);
      }

      // 3. Product categories
      const catRes = await fetch('/api/products/categories');
      const catJson = await catRes.json();
      if (catJson.success && catJson.data) {
        setCategories(catJson.data);
      }

      // 4. Blogs
      const blogEndpoint = token && roleMode === 'admin'
        ? '/api/admin/blogs?page=1&pageSize=50'
        : '/api/blogs?page=1&pageSize=50';
      const blogRes = await fetch(blogEndpoint, {
        headers: token && roleMode === 'admin' ? { Authorization: `Bearer ${token}` } : {}
      });
      const blogJson = await blogRes.json();
      if (blogJson.success && blogJson.data) {
        setBlogs(blogJson.data.items || []);
      }

      // 5. Blog Categories
      const bcatRes = await fetch('/api/blogs/categories');
      const bcatJson = await bcatRes.json();
      if (bcatJson.success && bcatJson.data) {
        setBlogCategories(bcatJson.data);
      }

      // 6. Admin leads & users
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

        // Fetch logs
        fetchLogs();
      }

      setApiLatency(Math.round(performance.now() - start));
    } catch (err) {
      console.error('Error fetching live data', err);
      setApiLatency(null);
    }
  };

  const fetchLogs = async () => {
    if (!token) return;
    setLogLoading(true);
    try {
      const url = `/api/admin/logs?filename=${encodeURIComponent(selectedLogFile)}&level=${encodeURIComponent(selectedLogLevel)}&search=${encodeURIComponent(logSearch)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setLogEntries(json.data.logs || []);
        setLogFiles(json.data.availableFiles || []);
      }
    } catch (err) {
      console.error('Failed fetching logs', err);
    } finally {
      setLogLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, roleMode]);

  useEffect(() => {
    if (adminTab === 'logs' && token) {
      fetchLogs();
    }
  }, [selectedLogFile, selectedLogLevel, adminTab]);

  const handleClearLogs = async () => {
    if (!token) return;
    if (!confirm(`Are you sure you want to rotate and clear log file '${selectedLogFile}'?`)) return;
    try {
      const res = await fetch('/api/admin/logs/clear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ filename: selectedLogFile })
      });
      const json = await res.json();
      if (json.success) {
        fetchLogs();
      }
    } catch (err) {
      console.error('Failed clearing log file', err);
    }
  };

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
          productOfInterest: quoteProductOfInterest || 'Industrial Polymer Extrusion',
          requirementDescription: quoteDescription
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setQuoteFeedback({
          type: 'success',
          message: data.message || 'Quotation request submitted! Engineering sales desk notified.'
        });
        setQuoteFullName('');
        setQuoteCompany('');
        setQuoteEmail('');
        setQuotePhone('');
        setQuoteProductOfInterest('');
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

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setStagedProductFile(null);
    setProductForm({
      productName: '',
      slug: '',
      categoryId: categories[0]?.categoryId?.toString() || '1',
      shortDescription: '',
      fullDescription: '',
      specifications: '',
      mainImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      isFeatured: false
    });
    setProductFormError(null);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setStagedProductFile(null);
    setProductForm({
      productName: prod.productName,
      slug: prod.slug,
      categoryId: (prod.category?.categoryId || prod.categoryId || 1).toString(),
      shortDescription: prod.shortDescription || '',
      fullDescription: prod.fullDescription || '',
      specifications: prod.specifications || '',
      mainImageUrl: prod.mainImageUrl || '',
      isFeatured: Boolean(prod.isFeatured)
    });
    setProductFormError(null);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setProductFormError('Please authenticate as Admin first.');
      return;
    }

    if (!productForm.productName || !productForm.slug) {
      setProductFormError('Product Name and Slug are required.');
      return;
    }

    setIsSavingProduct(true);
    setProductFormError(null);

    try {
      let finalImageUrl = productForm.mainImageUrl;

      // Defer image upload to API until user clicks Save / Update button
      if (stagedProductFile) {
        try {
          finalImageUrl = await uploadImageFile(stagedProductFile, 'products', token);
          setStagedProductFile(null);
        } catch (uploadErr: any) {
          setIsSavingProduct(false);
          setProductFormError(uploadErr?.message || 'Image upload failed. Please verify credentials.');
          return;
        }
      }

      const payload = {
        ...productForm,
        mainImageUrl: finalImageUrl
      };

      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.productId}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setShowProductModal(false);
        setStagedProductFile(null);
        loadData();
      } else {
        setProductFormError((data.errors && data.errors[0]) || data.message || 'Operation failed.');
      }
    } catch {
      setProductFormError('Network error communicating with API.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete || !token) return;
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProductToDelete(null);
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

  // Blog CRUD Handlers
  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setStagedBlogFile(null);
    setBlogForm({
      title: '',
      slug: '',
      blogCategoryId: blogCategories[0]?.blogCategoryId?.toString() || '1',
      shortDescription: '',
      content: '<p>Enter article technical details and data findings here...</p>',
      featuredImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      author: 'OM Polymer R&D Desk',
      isPublished: true
    });
    setBlogFormError(null);
    setShowBlogModal(true);
  };

  const handleOpenEditBlog = (b: any) => {
    setEditingBlog(b);
    setStagedBlogFile(null);
    setBlogForm({
      title: b.title,
      slug: b.slug,
      blogCategoryId: (b.category?.blogCategoryId || b.blogCategoryId || 1).toString(),
      shortDescription: b.shortDescription || '',
      content: b.content || '',
      featuredImageUrl: b.featuredImageUrl || '',
      author: b.author || 'OM Polymer Editorial',
      isPublished: Boolean(b.isPublished)
    });
    setBlogFormError(null);
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setBlogFormError('Please authenticate as Admin first.');
      return;
    }

    if (!blogForm.title || !blogForm.slug || !blogForm.content) {
      setBlogFormError('Title, Slug, and Content are required.');
      return;
    }

    setIsSavingBlog(true);
    setBlogFormError(null);

    try {
      let finalImageUrl = blogForm.featuredImageUrl;

      // Defer image upload to API until user clicks Save / Publish button
      if (stagedBlogFile) {
        try {
          finalImageUrl = await uploadImageFile(stagedBlogFile, 'blogs', token);
          setStagedBlogFile(null);
        } catch (uploadErr: any) {
          setIsSavingBlog(false);
          setBlogFormError(uploadErr?.message || 'Thumbnail upload failed. Please verify credentials.');
          return;
        }
      }

      const payload = {
        ...blogForm,
        featuredImageUrl: finalImageUrl
      };

      const url = editingBlog 
        ? `/api/admin/blogs/${editingBlog.blogId}`
        : '/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setShowBlogModal(false);
        setStagedBlogFile(null);
        loadData();
      } else {
        setBlogFormError((data.errors && data.errors[0]) || data.message || 'Operation failed.');
      }
    } catch {
      setBlogFormError('Network error communicating with API.');
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete || !token) return;
    try {
      const res = await fetch(`/api/admin/blogs/${blogToDelete.blogId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBlogToDelete(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlogPublish = async (blogId: number, currentlyPublished: boolean) => {
    if (!token) return;
    try {
      const action = currentlyPublished ? 'unpublish' : 'publish';
      await fetch(`/api/admin/blogs/${blogId}/${action}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Lead Status Handler
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

  // Company Profile Update
  const handleSaveCompanySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingCompany(true);
    setCompanyFeedback(null);
    try {
      let finalLogoUrl = companyForm.logoUrl;

      // Defer logo upload to API until user clicks Save Settings button
      if (stagedLogoFile) {
        try {
          finalLogoUrl = await uploadImageFile(stagedLogoFile, 'logos', token);
          setStagedLogoFile(null);
        } catch (uploadErr: any) {
          setSavingCompany(false);
          setCompanyFeedback(uploadErr?.message || 'Logo upload failed before saving settings.');
          return;
        }
      }

      const payload = {
        ...companyForm,
        logoUrl: finalLogoUrl
      };

      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setCompanyForm(payload);
        if (companyData) setCompanyData({ ...companyData, logoUrl: finalLogoUrl });
        setCompanyFeedback('Company profile & dynamic logo saved successfully!');
        loadData();
        setTimeout(() => setCompanyFeedback(null), 3000);
      } else {
        setCompanyFeedback(data.message || 'Failed to update company settings.');
      }
    } catch {
      setCompanyFeedback('Failed to update company settings.');
    } finally {
      setSavingCompany(false);
    }
  };

  // Toggle Admin User Status
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
    const matchesSearch = file.name.toLowerCase().includes(codeSearchTerm.toLowerCase()) ||
                          file.path.toLowerCase().includes(codeSearchTerm.toLowerCase()) ||
                          file.description.toLowerCase().includes(codeSearchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Products for Catalog & Showcase
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCatId ? (p.category?.categoryId === selectedCatId || p.categoryId === selectedCatId) : true;
    const matchesSearch = productSearch.trim() === '' || 
      p.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.specifications && p.specifications.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredProducts = products.filter(p => p.isFeatured && p.isActive);

  // Filtered Blogs
  const filteredBlogs = blogs.filter(b => {
    const matchesCat = selectedBlogCatId ? (b.category?.blogCategoryId === selectedBlogCatId || b.blogCategoryId === selectedBlogCatId) : true;
    const matchesSearch = blogSearch.trim() === '' ||
      b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
      (b.shortDescription && b.shortDescription.toLowerCase().includes(blogSearch.toLowerCase())) ||
      (b.content && b.content.toLowerCase().includes(blogSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const whatsAppNumberClean = (companyData?.whatsAppNumber || '+919876543210').replace(/[^0-9]/g, '');
  const whatsAppLink = `https://wa.me/${whatsAppNumberClean}?text=${encodeURIComponent('Hello OM Polymer, I am interested in inquiring about your industrial engineering polymer products and pricing.')}`;

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
              Dynamic API & Logs
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            OM Polymer Role-Based Platform & Live Experience
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Single Angular project hosting two role-based experiences: <strong>User Client Portal</strong> and <strong>Admin Panel</strong>. Powered by signals, reactive forms, live ASP.NET Core Web API integration, dynamic logs, and WhatsApp CRM.
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
          <span>Architecture & Security Matrix</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: INTERACTIVE ROLE SIMULATOR */}
      {/* ========================================================================= */}
      {subView === 'simulator' && (
        <div className="space-y-4">
          {/* Top Role Switcher & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Viewing Role:</span>
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setRoleMode('user')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    roleMode === 'user'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Public Client Portal</span>
                </button>

                <button
                  onClick={() => setRoleMode('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    roleMode === 'admin'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {apiLatency !== null && (
                <div className="flex items-center gap-1.5 font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>API Ping: {apiLatency}ms</span>
                </div>
              )}

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
              </button>

              <button
                onClick={loadData}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh API</span>
              </button>
            </div>
          </div>

          {/* Browser Container Frame */}
          <div className={`rounded-3xl border shadow-2xl transition-colors duration-200 overflow-hidden ${
            isDarkMode ? 'bg-slate-950 text-slate-100 border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'
          }`}>
            
            {/* ------------------------------------------------------------------- */}
            {/* ROLE 1: PUBLIC USER EXPERIENCE */}
            {/* ------------------------------------------------------------------- */}
            {roleMode === 'user' ? (
              <div className="min-h-[750px] flex flex-col">
                {/* User Navbar */}
                <header className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-30 backdrop-blur-md ${
                  isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-md overflow-hidden">
                      {companyData?.logoUrl ? (
                        <img 
                          src={companyData.logoUrl} 
                          alt="OM Polymer Logo" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      ) : null}
                      <span className="text-xs">OM</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-tight">{companyData?.companyName || 'OM Polymer'}</div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-wide">ISO 9001:2015 Precision Extrusion</div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
                    <button 
                      onClick={() => setUserTab('home')}
                      className={`hover:text-blue-600 transition-colors ${userTab === 'home' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-500'}`}
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => setUserTab('catalog')}
                      className={`hover:text-blue-600 transition-colors ${userTab === 'catalog' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-500'}`}
                    >
                      Products ({products.length})
                    </button>
                    <button 
                      onClick={() => setUserTab('blogs')}
                      className={`hover:text-blue-600 transition-colors ${userTab === 'blogs' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-500'}`}
                    >
                      Engineering Blogs ({blogs.filter(b => b.isPublished).length})
                    </button>
                    <button 
                      onClick={() => setUserTab('about')}
                      className={`hover:text-blue-600 transition-colors ${userTab === 'about' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-500'}`}
                    >
                      About Us
                    </button>
                    <button 
                      onClick={() => setUserTab('quote')}
                      className={`hover:text-blue-600 transition-colors ${userTab === 'quote' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-500'}`}
                    >
                      Request RFQ
                    </button>
                    <button 
                      onClick={() => setUserTab('maintenance')}
                      className={`hover:text-blue-600 transition-colors flex items-center gap-1.5 ${userTab === 'maintenance' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'text-slate-500'}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Maintenance Ref
                    </button>
                  </nav>

                  <div className="flex items-center gap-2">
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setRoleMode('admin')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
                    >
                      Admin Panel →
                    </button>
                  </div>
                </header>

                {/* User Sub-Tabs Content */}
                <div className="p-6 md:p-10 flex-1 relative">
                  
                  {/* TAB 1: USER HOME */}
                  {userTab === 'home' && (
                    <div className="space-y-12 max-w-6xl mx-auto">
                      
                      {/* 1. HERO SECTION */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-8 md:p-14 rounded-3xl text-white shadow-2xl space-y-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            ISO 9001:2015 CERTIFIED FACILITY
                          </span>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                            {companyData?.yearsOfExperience || 13}+ YEARS OF EXCELLENCE
                          </span>
                        </div>

                        <div className="space-y-3 max-w-3xl">
                          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                            High-Density Polyethylene & Precision Engineering Polymers
                          </h2>
                          <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                            {companyData?.description || 'Leading manufacturer and exporter of high-grade engineering polymers, HDPE piping systems, masterbatches, and PVC compounds for severe municipal and industrial applications.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <button 
                            onClick={() => setUserTab('catalog')} 
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
                          >
                            <span>Browse Product Lines</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setUserTab('quote')} 
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-colors"
                          >
                            Request Engineering RFQ
                          </button>
                          <a 
                            href={whatsAppLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Instant WhatsApp Inquiry</span>
                          </a>
                        </div>
                      </div>

                      {/* 2. HIGHLIGHTED / FEATURED PRODUCTS */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500 font-mono">Spotlight</span>
                            <h3 className="text-xl font-bold tracking-tight">Highlighted Engineering Products</h3>
                          </div>
                          <button 
                            onClick={() => setUserTab('catalog')}
                            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <span>View All ({products.length})</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {featuredProducts.slice(0, 3).map(p => (
                            <div 
                              key={p.productId} 
                              className={`rounded-2xl border p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ${
                                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-800 relative">
                                  <img 
                                    src={p.mainImageUrl} 
                                    alt={p.productName} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                  />
                                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                                    ★ Featured
                                  </span>
                                </div>

                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                  {p.category?.categoryName || 'Engineering Line'}
                                </span>

                                <h4 className="font-bold text-sm tracking-tight line-clamp-1">{p.productName}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2">{p.shortDescription}</p>

                                <div className="p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl text-[11px] font-mono text-slate-600 dark:text-slate-400 line-clamp-2">
                                  {p.specifications}
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                <button 
                                  onClick={() => setSelectedProductDetail(p)}
                                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Details</span>
                                </button>
                                <button 
                                  onClick={() => { 
                                    setQuoteProductOfInterest(p.productName);
                                    setQuoteDescription(`Inquiring about specifications and pricing for: ${p.productName}`);
                                    setUserTab('quote'); 
                                  }} 
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                                >
                                  Request RFQ
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. ABOUT US SECTION */}
                      <div className={`p-8 md:p-12 rounded-3xl border shadow-sm ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                          <div className="space-y-4">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500 font-mono">Infrastructure & Legacy</span>
                            <h3 className="text-2xl font-bold tracking-tight">13+ Years of Precision Polymer Engineering</h3>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                              {companyData?.aboutContent || 'Established in 2011, OM Polymer has grown from a specialized compounding facility into an international benchmark for extrusion-grade resins, pressure pipes, and customized polymeric additives.'}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                <div className="text-xl font-bold text-blue-600">18,000 MT/Yr</div>
                                <div className="text-[11px] text-slate-500 font-medium">Extrusion Capacity</div>
                              </div>
                              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                <div className="text-xl font-bold text-emerald-600">50+ Years</div>
                                <div className="text-[11px] text-slate-500 font-medium">Design Pipeline Life</div>
                              </div>
                              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                <div className="text-xl font-bold text-purple-600">ISO 9001:2015</div>
                                <div className="text-[11px] text-slate-500 font-medium">Quality Testing Lab</div>
                              </div>
                              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                <div className="text-xl font-bold text-amber-600">PN6 - PN16</div>
                                <div className="text-[11px] text-slate-500 font-medium">Pressure Ratings</div>
                              </div>
                            </div>
                          </div>

                          <div className="h-full rounded-2xl overflow-hidden bg-slate-800 relative min-h-[280px]">
                            <img 
                              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80" 
                              alt="OM Polymer Extrusion Facility" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-6 flex flex-col justify-end">
                              <div className="text-white font-bold text-sm">Industrial Plant Phase II</div>
                              <div className="text-slate-300 text-xs">Automated Twin-Screw Compounding & Ultrasonic Wall Thickness Control</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. DYNAMIC BLOGS & TECHNICAL PAPERS */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500 font-mono">R&D Publications</span>
                            <h3 className="text-xl font-bold tracking-tight">Engineering Insights & Materials Research</h3>
                          </div>
                          <button 
                            onClick={() => setUserTab('blogs')}
                            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <span>All Articles</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {blogs.filter(b => b.isPublished).slice(0, 2).map(b => (
                            <div 
                              key={b.blogId} 
                              className={`rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between ${
                                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-800">
                                  <img 
                                    src={b.featuredImageUrl} 
                                    alt={b.title} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500">
                                  <span className="font-semibold text-blue-600">{b.category?.categoryName || 'Material Science'}</span>
                                  <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-bold text-sm tracking-tight">{b.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2">{b.shortDescription}</p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400">By {b.author}</span>
                                <button 
                                  onClick={() => setSelectedBlogDetail(b)}
                                  className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1"
                                >
                                  <span>Read Paper</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 5. DIRECT ENGINEERING CONTACTS & WHATSAPP ACTION */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <a 
                          href={`tel:${(companyData?.phoneContact || '+918866246042').replace(/\s+/g, '')}`} 
                          className={`p-6 rounded-2xl border text-center space-y-2 shadow-sm hover:shadow-lg transition-all ${
                            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center text-lg font-bold">
                            📞
                          </div>
                          <div className="font-bold text-xs">Direct Telephone</div>
                          <div className="text-[11px] font-mono text-slate-500">{companyData?.phoneContact || '+91 79 4002 9180'}</div>
                        </a>

                        <a 
                          href={whatsAppLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`p-6 rounded-2xl border text-center space-y-2 shadow-sm hover:shadow-lg transition-all border-emerald-500/30 ${
                            isDarkMode ? 'bg-emerald-950/20' : 'bg-emerald-50/50'
                          }`}
                        >
                          <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-lg font-bold">
                            💬
                          </div>
                          <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">Live WhatsApp Desk</div>
                          <div className="text-[11px] font-mono text-slate-500">{companyData?.whatsAppNumber || '+919876543210'}</div>
                        </a>

                        <a 
                          href={`mailto:${companyData?.emailContact || 'inquiry@ompolymer.com'}`} 
                          className={`p-6 rounded-2xl border text-center space-y-2 shadow-sm hover:shadow-lg transition-all ${
                            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="w-10 h-10 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-lg font-bold">
                            ✉️
                          </div>
                          <div className="font-bold text-xs">Email Desk</div>
                          <div className="text-[11px] text-slate-500">{companyData?.emailContact || 'inquiry@ompolymer.com'}</div>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PRODUCT CATALOG */}
                  {userTab === 'catalog' && (
                    <div className="space-y-6 max-w-6xl mx-auto">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">Industrial Products & Compounds</h2>
                          <p className="text-xs text-slate-500">Search and filter by standard, resin classification, and application</p>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Search HDPE, PA66, Masterbatch..."
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-blue-500 ${
                              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Category Pills */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedCatId(undefined)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            selectedCatId === undefined 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : isDarkMode ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          All ({products.length})
                        </button>
                        {categories.map(c => (
                          <button
                            key={c.categoryId}
                            onClick={() => setSelectedCatId(c.categoryId)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              selectedCatId === c.categoryId 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : isDarkMode ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {c.categoryName}
                          </button>
                        ))}
                      </div>

                      {/* Products Grid */}
                      {filteredProducts.length === 0 ? (
                        <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <Package className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                          <div className="font-semibold text-sm">No products matched your criteria</div>
                          <p className="text-xs text-slate-500 mt-1">Try clearing your search term or selecting another category.</p>
                          <button onClick={() => { setProductSearch(''); setSelectedCatId(undefined); }} className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                            Reset Filters
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredProducts.map(p => (
                            <div 
                              key={p.productId} 
                              className={`p-5 rounded-2xl border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ${
                                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-800 relative">
                                  <img 
                                    src={p.mainImageUrl} 
                                    alt={p.productName} 
                                    className="w-full h-full object-cover" 
                                  />
                                  {p.isFeatured && (
                                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                                      ★ Featured
                                    </span>
                                  )}
                                </div>

                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                  {p.category?.categoryName || 'Standard'}
                                </span>

                                <h3 className="font-bold text-sm tracking-tight">{p.productName}</h3>
                                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{p.shortDescription}</p>
                                
                                <div className="p-2.5 bg-slate-100 dark:bg-slate-950 rounded-xl text-[11px] font-mono text-slate-600 dark:text-slate-400">
                                  {p.specifications}
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                <button 
                                  onClick={() => setSelectedProductDetail(p)}
                                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Details</span>
                                </button>
                                
                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={`https://wa.me/${whatsAppNumberClean}?text=${encodeURIComponent(`Hello OM Polymer, I would like to inquire about specifications and pricing for: ${p.productName}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                                    title="Inquire via WhatsApp"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                  <button 
                                    onClick={() => { 
                                      setQuoteProductOfInterest(p.productName);
                                      setQuoteDescription(`Technical Inquiry for: ${p.productName}`); 
                                      setUserTab('quote'); 
                                    }} 
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                                  >
                                    Request RFQ
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: BLOGS & RESEARCH */}
                  {userTab === 'blogs' && (
                    <div className="space-y-6 max-w-6xl mx-auto">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">Engineering Papers & Polymer Insights</h2>
                          <p className="text-xs text-slate-500">Research articles, case studies, and processing technology from OM Polymer R&D</p>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Search articles..."
                            value={blogSearch}
                            onChange={e => setBlogSearch(e.target.value)}
                            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-blue-500 ${
                              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.filter(b => b.isPublished).map(b => (
                          <div 
                            key={b.blogId} 
                            className={`rounded-2xl border p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ${
                              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-800">
                                <img src={b.featuredImageUrl} alt={b.title} className="w-full h-full object-cover" />
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span className="font-semibold text-blue-600">{b.category?.categoryName || 'Material Science'}</span>
                                <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                              </div>

                              <h3 className="font-bold text-sm tracking-tight">{b.title}</h3>
                              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{b.shortDescription}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-[11px] text-slate-400">By {b.author}</span>
                              <button 
                                onClick={() => setSelectedBlogDetail(b)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1"
                              >
                                <span>Read Full Article</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: ABOUT US DEEP DIVE */}
                  {userTab === 'about' && (
                    <div className="space-y-8 max-w-4xl mx-auto">
                      <div className={`p-8 md:p-12 rounded-3xl border shadow-xl space-y-6 ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}>
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-blue-500 uppercase tracking-wider font-mono">Corporate Profile</span>
                          <h2 className="text-3xl font-extrabold tracking-tight">About OM Polymer</h2>
                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                            {companyData?.aboutContent || 'Established in 2011, OM Polymer has grown from a specialized compounding facility into an international benchmark for extrusion-grade resins, pressure pipes, and customized polymeric additives.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Headquarters</div>
                            <div className="text-xs font-medium mt-1">{companyData?.address}</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Phone & WhatsApp</div>
                            <div className="text-xs font-mono mt-1">{companyData?.phoneContact}</div>
                            <div className="text-xs font-mono text-emerald-500">{companyData?.whatsAppNumber}</div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Certifications</div>
                            <div className="text-xs font-medium mt-1">ISO 9001:2015, IS 4984:2016, ISO 4427</div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                          <div className="font-bold">Quality Testing Standards</div>
                          <p>Every extrusion batch undergoes hydrostatic internal pressure burst testing, Full Notch Creep Test (FNCT), Melt Flow Index (MFI) analysis, and Carbon Black dispersion evaluation before dispatch.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: USER RFQ */}
                  {userTab === 'quote' && (
                    <div className="max-w-xl mx-auto space-y-4">
                      <div className={`p-8 rounded-3xl border shadow-xl space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h2 className="text-xl font-bold">Technical Requirement & Quotation Form</h2>
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
                          <div>
                            <label className="block text-xs font-semibold mb-1">Full Name *</label>
                            <input
                              type="text"
                              required
                              value={quoteFullName}
                              onChange={e => setQuoteFullName(e.target.value)}
                              placeholder="e.g. Vikram Singhania"
                              className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                                isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                              }`}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold mb-1">Email Address *</label>
                              <input
                                type="email"
                                required
                                value={quoteEmail}
                                onChange={e => setQuoteEmail(e.target.value)}
                                placeholder="vikram@example.com"
                                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                                  isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1">Phone Number *</label>
                              <input
                                type="tel"
                                required
                                value={quotePhone}
                                onChange={e => setQuotePhone(e.target.value)}
                                placeholder="+91 98250 12345"
                                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                                  isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold mb-1">Company Name</label>
                              <input
                                type="text"
                                value={quoteCompany}
                                onChange={e => setQuoteCompany(e.target.value)}
                                placeholder="e.g. Apex Infrastructure"
                                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                                  isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1">Product of Interest</label>
                              <input
                                type="text"
                                value={quoteProductOfInterest}
                                onChange={e => setQuoteProductOfInterest(e.target.value)}
                                placeholder="e.g. HDPE PN16 Industrial Pipe"
                                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                                  isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                                }`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold mb-1">Requirement Details *</label>
                            <textarea
                              required
                              rows={4}
                              value={quoteDescription}
                              onChange={e => setQuoteDescription(e.target.value)}
                              placeholder="Please specify pressure rating (PN), diameter, quantity in meters or metric tons, and target delivery city..."
                              className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-blue-500 ${
                                isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                              }`}
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            disabled={submittingQuote}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            {submittingQuote ? 'Submitting to Engineering Sales...' : 'Transmit Quotation Request'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: MAINTENANCE REFERENCE */}
                  {userTab === 'maintenance' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-xs font-mono text-emerald-400">Maintenance & Transition Reference</span>
                        </div>
                        <h2 className="text-xl font-bold">OM POLYMER Maintenance Landing Reference</h2>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          This is the interactive rendering of the initial HTML landing reference provided in the prompt. While scheduled site maintenance is active, all dynamic API links and direct contact gateways remain 100% operational.
                        </p>
                        
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                          <div>📍 <strong>Registered Plant:</strong> {companyData?.address}</div>
                          <div>📞 <strong>Hotline:</strong> {companyData?.phoneContact}</div>
                          <div>✉️ <strong>Support Email:</strong> {companyData?.emailContact}</div>
                          <div>💬 <strong>WhatsApp:</strong> {companyData?.whatsAppNumber}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FLOATING WHATSAPP BUTTON */}
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-40 p-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
                    title="Chat with OM Polymer on WhatsApp"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </a>
                </div>
              </div>
            ) : (

              /* ------------------------------------------------------------------- */
              /* ROLE 2: ADMIN PANEL EXPERIENCE */
              /* ------------------------------------------------------------------- */
              <div className="min-h-[750px] flex flex-col md:flex-row">
                {/* Admin Sidebar */}
                <aside className="w-full md:w-60 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5 px-2">
                      <div className="relative w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-bold text-xs overflow-hidden shadow-sm shrink-0">
                        {companyData?.logoUrl ? (
                          <img 
                            src={companyData.logoUrl} 
                            alt="OM Polymer Logo" 
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        ) : null}
                        <span>🛡️</span>
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{companyData?.companyName || 'OM Polymer'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Role: SuperAdmin</div>
                      </div>
                    </div>

                    <nav className="space-y-1">
                      <button
                        onClick={() => setAdminTab('dashboard')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          adminTab === 'dashboard' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Layout className="w-3.5 h-3.5" />
                        <span>KPI Dashboard</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('products')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          adminTab === 'products' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Product Catalog ({products.length})</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('blogs')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          adminTab === 'blogs' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Blog Management ({blogs.length})</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('inquiries')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          adminTab === 'inquiries' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Inquiries CRM ({leads.length})</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('logs')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          adminTab === 'logs' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>System Logs (Live)</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('company')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          adminTab === 'company' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Company & WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('users')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          adminTab === 'users' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Admin Security</span>
                      </button>
                    </nav>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <button
                      onClick={() => setRoleMode('user')}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                      ← Back to User Portal
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
                        <span>Viewing simulator in read-only mode. Authenticate to test live write/delete endpoints.</span>
                      </div>
                      <button onClick={onQuickLogin} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded text-xs">
                        Admin Login
                      </button>
                    </div>
                  )}

                  {/* ADMIN TAB 1: DASHBOARD */}
                  {adminTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Admin KPI Overview</h2>
                        <span className="text-xs text-slate-400 font-mono">Live Sync with SQL Server</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-[11px] text-slate-400">Total Leads</div>
                          <div className="text-2xl font-bold text-blue-400">{leads.length}</div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-[11px] text-slate-400">Total Products</div>
                          <div className="text-2xl font-bold text-emerald-400">{products.length}</div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-[11px] text-slate-400">Published Blogs</div>
                          <div className="text-2xl font-bold text-purple-400">{blogs.filter(b => b.isPublished).length}</div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                          <div className="text-[11px] text-slate-400">Log Entries (Disk)</div>
                          <div className="text-2xl font-bold text-amber-400">{logEntries.length || 'Active'}</div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                        <div className="text-xs font-bold text-slate-300">Quick Operations</div>
                        <div className="flex flex-wrap gap-2.5">
                          <button onClick={handleOpenAddProduct} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add New Product</span>
                          </button>
                          <button onClick={handleOpenAddBlog} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Write Blog Article</span>
                          </button>
                          <button onClick={() => setAdminTab('logs')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Inspect Dynamic Logs</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 2: PRODUCTS CRUD */}
                  {adminTab === 'products' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold">Product Catalog Management</h2>
                          <p className="text-xs text-slate-400">Add, edit, view, toggle status, and delete products</p>
                        </div>

                        <button 
                          onClick={handleOpenAddProduct}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Product</span>
                        </button>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-3">Product Name</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Featured</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {products.map(p => (
                              <tr key={p.productId} className="hover:bg-slate-800/40">
                                <td className="p-3">
                                  <div className="font-semibold text-white">{p.productName}</div>
                                  <div className="text-[10px] font-mono text-slate-400">/{p.slug}</div>
                                </td>
                                <td className="p-3 text-slate-400">{p.category?.categoryName || 'Standard'}</td>
                                <td className="p-3">
                                  {p.isFeatured ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                                      ★ Featured
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 text-[10px]">Standard</span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    p.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {p.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button 
                                      onClick={() => setSelectedProductDetail(p)}
                                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded" 
                                      title="View Details"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleOpenEditProduct(p)}
                                      className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded transition-colors" 
                                      title="Edit Product"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleToggleProduct(p.productId)}
                                      className="p-1.5 bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white rounded transition-colors" 
                                      title="Toggle Active"
                                    >
                                      <Sliders className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => setProductToDelete(p)}
                                      className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded transition-colors" 
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 3: BLOGS CRUD */}
                  {adminTab === 'blogs' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold">Blog & Technical Article Management</h2>
                          <p className="text-xs text-slate-400">Author, edit, publish/draft toggle, and delete articles</p>
                        </div>

                        <button 
                          onClick={handleOpenAddBlog}
                          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Write New Article</span>
                        </button>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-3">Article Title</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Author</th>
                              <th className="p-3">Publication State</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {blogs.map(b => (
                              <tr key={b.blogId} className="hover:bg-slate-800/40">
                                <td className="p-3">
                                  <div className="font-semibold text-white">{b.title}</div>
                                  <div className="text-[10px] font-mono text-slate-400">/{b.slug}</div>
                                </td>
                                <td className="p-3 text-slate-400">{b.category?.categoryName || 'Material Science'}</td>
                                <td className="p-3 text-slate-300">{b.author}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    b.isPublished ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                                  }`}>
                                    {b.isPublished ? '● Published' : 'Draft'}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button 
                                      onClick={() => setSelectedBlogDetail(b)}
                                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded" 
                                      title="Preview"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleOpenEditBlog(b)}
                                      className="p-1.5 bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white rounded transition-colors" 
                                      title="Edit Article"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleToggleBlogPublish(b.blogId, b.isPublished)}
                                      className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded transition-colors" 
                                      title={b.isPublished ? 'Unpublish' : 'Publish'}
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => setBlogToDelete(b)}
                                      className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded transition-colors" 
                                      title="Delete Article"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 4: INQUIRIES CRM */}
                  {adminTab === 'inquiries' && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold">Client Inquiries CRM & RFQ Desk</h2>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                              <th className="p-3">Client</th>
                              <th className="p-3">Contact</th>
                              <th className="p-3">Product of Interest</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {leads.map(lead => (
                              <tr key={lead.requirementId} className="hover:bg-slate-800/40">
                                <td className="p-3">
                                  <div className="font-semibold text-white">{lead.fullName}</div>
                                  <div className="text-[10px] text-slate-400">{lead.companyName || 'Independent'}</div>
                                </td>
                                <td className="p-3">
                                  <div>{lead.email}</div>
                                  <div className="font-mono text-slate-400">{lead.phoneNumber}</div>
                                </td>
                                <td className="p-3 font-medium text-slate-300">{lead.productOfInterest || 'General'}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                                    {lead.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <a
                                      href={`https://wa.me/${(lead.phoneNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.fullName}, regarding your technical inquiry for ${lead.productOfInterest || 'OM Polymer products'}...`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded"
                                      title="Reply on WhatsApp"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                    <button 
                                      onClick={() => { 
                                        setActiveLead(lead); 
                                        setLeadStatus(lead.status); 
                                        setLeadRemarks(lead.adminRemarks || ''); 
                                      }} 
                                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
                                    >
                                      Update
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 5: SYSTEM LOGS (DYNAMIC FROM /logs FOLDER) */}
                  {adminTab === 'logs' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold">Dynamic Server & Application Logs</h2>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-800">
                              Directory: /logs
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">Loaded directly from physical log files on the host filesystem via <code className="text-blue-400 font-mono">GET /api/admin/logs</code></p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={fetchLogs} 
                            disabled={logLoading}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${logLoading ? 'animate-spin' : ''}`} />
                            <span>Refresh Logs</span>
                          </button>

                          <a
                            href={`/api/admin/logs/download/${selectedLogFile}?token=${token}`}
                            download
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download File</span>
                          </a>

                          <button 
                            onClick={handleClearLogs}
                            className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Rotate & Clear</span>
                          </button>
                        </div>
                      </div>

                      {/* Log Filters Bar */}
                      <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                        <div className="flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-400">File:</span>
                          <select 
                            value={selectedLogFile} 
                            onChange={e => setSelectedLogFile(e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono"
                          >
                            {logFiles.map(f => (
                              <option key={f.fileName} value={f.fileName}>{f.fileName} ({(f.sizeBytes / 1024).toFixed(1)} KB)</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Filter className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-400">Level:</span>
                          <select 
                            value={selectedLogLevel} 
                            onChange={e => setSelectedLogLevel(e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono"
                          >
                            <option value="ALL">ALL LEVELS</option>
                            <option value="INF">INF (Information)</option>
                            <option value="WRN">WRN (Warning)</option>
                            <option value="ERR">ERR (Error)</option>
                            <option value="SEC">SEC (Security)</option>
                          </select>
                        </div>

                        <div className="flex-1 min-w-[200px] relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Filter in log output..."
                            value={logSearch}
                            onChange={e => setLogSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchLogs()}
                            className="w-full bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Log Output Viewer */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] h-[480px] overflow-y-auto space-y-1.5 select-text">
                        {logEntries.length === 0 ? (
                          <div className="text-slate-500 py-12 text-center">
                            No log events matching filters in {selectedLogFile}. Make API requests to generate real-time log lines!
                          </div>
                        ) : (
                          logEntries.map((log) => {
                            const levelColor = 
                              log.level === 'ERR' ? 'text-rose-400 bg-rose-950/60 border-rose-800' :
                              log.level === 'WRN' ? 'text-amber-400 bg-amber-950/60 border-amber-800' :
                              log.level === 'SEC' ? 'text-purple-400 bg-purple-950/60 border-purple-800' :
                              'text-blue-400 bg-blue-950/60 border-blue-800';

                            return (
                              <div key={log.id} className="flex items-start gap-2 py-1 px-1.5 rounded hover:bg-slate-900/60 transition-colors">
                                <span className="text-slate-500 shrink-0 text-[10px]">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold shrink-0 ${levelColor}`}>
                                  {log.level}
                                </span>
                                <span className="text-slate-400 shrink-0 text-[10px] max-w-[140px] truncate">
                                  [{log.category}]
                                </span>
                                <span className="text-slate-200 break-all flex-1">
                                  {log.message}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 6: COMPANY */}
                  {adminTab === 'company' && (
                    <div className="space-y-4 max-w-2xl">
                      <h2 className="text-lg font-bold">Company Profile & WhatsApp Desk Configuration</h2>
                      <p className="text-xs text-slate-400">Updates saved directly to SQL Server database via <code className="text-blue-400 font-mono">PUT /api/company</code></p>

                      {companyFeedback && (
                        <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{companyFeedback}</span>
                        </div>
                      )}

                      {/* Dynamic Logo Management Card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-white text-sm flex items-center gap-2">
                              <span>🖼️</span> Dynamic Site Logo Management
                            </h3>
                            <p className="text-slate-400 text-[11px] mt-0.5">
                              Uploaded logo is stored in <code className="text-blue-400 font-mono">/uploads/logos/</code> and synchronizes across the public website and admin portal.
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                            Dynamic Logo
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-2">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Logo Preview</span>
                            <div className="w-28 h-16 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                              {companyForm.logoUrl ? (
                                <img 
                                  src={companyForm.logoUrl} 
                                  alt="Site Logo" 
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">OM</div>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 truncate max-w-full">{companyForm.logoUrl || '/uploads/logos/om-polymer-logo.png'}</span>
                          </div>

                          <ImageUploadDropzone
                            category="logos"
                            label="Upload / Replace Logo File"
                            helperText="PNG (transparent), SVG, WEBP (Max 5MB) · Uploads on Save"
                            value={companyForm.logoUrl || ''}
                            onChange={(url) => {
                              setCompanyForm({ ...companyForm, logoUrl: url });
                              if (companyData) setCompanyData({ ...companyData, logoUrl: url });
                            }}
                            onFileSelect={(file) => setStagedLogoFile(file)}
                            token={token}
                          />
                        </div>
                      </div>

                      <form onSubmit={handleSaveCompanySettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                          <input 
                            type="text" 
                            value={companyForm.companyName || ''}
                            onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">WhatsApp Number (e.g. +919876543210)</label>
                            <input 
                              type="text" 
                              value={companyForm.whatsAppNumber || ''}
                              onChange={e => setCompanyForm({ ...companyForm, whatsAppNumber: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Support Telephone</label>
                            <input 
                              type="text" 
                              value={companyForm.phoneContact || ''}
                              onChange={e => setCompanyForm({ ...companyForm, phoneContact: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Inquiry Email</label>
                            <input 
                              type="email" 
                              value={companyForm.emailContact || ''}
                              onChange={e => setCompanyForm({ ...companyForm, emailContact: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-300 font-semibold mb-1">Years of Manufacturing Experience</label>
                            <input 
                              type="number" 
                              value={companyForm.yearsOfExperience || 13}
                              onChange={e => setCompanyForm({ ...companyForm, yearsOfExperience: parseInt(e.target.value) || 13 })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Factory Address</label>
                          <input 
                            type="text" 
                            value={companyForm.address || ''}
                            onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">About Us Narrative</label>
                          <textarea 
                            rows={3}
                            value={companyForm.aboutContent || ''}
                            onChange={e => setCompanyForm({ ...companyForm, aboutContent: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
                          ></textarea>
                        </div>

                        <button 
                          type="submit" 
                          disabled={savingCompany}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                        >
                          {savingCompany ? 'Saving Configuration...' : 'Save Company Profile & Settings'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* ADMIN TAB 7: USERS */}
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
                              <tr key={u.adminId} className="hover:bg-slate-800/40">
                                <td className="p-3 font-semibold text-white">{u.fullName}</td>
                                <td className="p-3 font-mono text-slate-400">{u.email}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    u.role === 'SuperAdmin' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                                  }`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    u.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {u.isActive ? 'Active' : 'Deactivated'}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button onClick={() => handleToggleAdminStatus(u.adminId)} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold">
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

          {/* ========================================================================= */}
          {/* MODALS */}
          {/* ========================================================================= */}

          {/* 1. PRODUCT DETAIL MODAL */}
          {selectedProductDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
                <button onClick={() => setSelectedProductDetail(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">✕</button>
                
                <div className="h-64 rounded-2xl overflow-hidden bg-slate-950">
                  <img src={selectedProductDetail.mainImageUrl} alt={selectedProductDetail.productName} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-400 border border-blue-800">
                    {selectedProductDetail.category?.categoryName || 'Standard'}
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedProductDetail.productName}</h3>
                  <div className="text-xs text-slate-400">{selectedProductDetail.shortDescription}</div>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300">Technical Specifications:</div>
                  <div className="text-xs font-mono text-blue-300 leading-relaxed">{selectedProductDetail.specifications}</div>
                </div>

                {selectedProductDetail.fullDescription && (
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {selectedProductDetail.fullDescription}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <a
                    href={`https://wa.me/${whatsAppNumberClean}?text=${encodeURIComponent(`Hello OM Polymer, I am inquiring about product specifications and pricing for: ${selectedProductDetail.productName}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setQuoteProductOfInterest(selectedProductDetail.productName);
                      setQuoteDescription(`Inquiry for ${selectedProductDetail.productName}`);
                      setSelectedProductDetail(null);
                      setUserTab('quote');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    Request Technical RFQ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. BLOG ARTICLE DETAIL MODAL */}
          {selectedBlogDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
                <button onClick={() => setSelectedBlogDetail(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg">✕</button>

                <div className="h-64 rounded-2xl overflow-hidden bg-slate-950">
                  <img src={selectedBlogDetail.featuredImageUrl} alt={selectedBlogDetail.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-bold text-blue-400">{selectedBlogDetail.category?.categoryName || 'Material Science'}</span>
                    <span>•</span>
                    <span>By {selectedBlogDetail.author}</span>
                    <span>•</span>
                    <span>{new Date(selectedBlogDetail.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{selectedBlogDetail.title}</h2>
                </div>

                <div 
                  className="text-xs text-slate-300 leading-relaxed space-y-3 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedBlogDetail.content }}
                />

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button onClick={() => setSelectedBlogDetail(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold">
                    Close Article
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. PRODUCT ADD / EDIT MODAL */}
          {showProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
                <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? 'Edit Industrial Product' : 'Add New Industrial Product'}
                </h3>

                {productFormError && (
                  <div className="p-3 bg-rose-950 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{productFormError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Product Name *</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.productName}
                      onChange={e => setProductForm({ ...productForm, productName: e.target.value })}
                      placeholder="e.g. HDPE PN16 Industrial Pipe"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">URL Slug *</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.slug}
                      onChange={e => setProductForm({ ...productForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="e.g. hdpe-pn16-pipe"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Category *</label>
                    <select 
                      value={productForm.categoryId}
                      onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      {categories.map(c => (
                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                      ))}
                    </select>
                  </div>

                  <ImageUploadDropzone
                    category="products"
                    label="Product Showcase Image"
                    helperText="PNG, JPG, WEBP, SVG (Max 5MB) · Uploads to API on Save"
                    value={productForm.mainImageUrl}
                    onChange={(url) => setProductForm({ ...productForm, mainImageUrl: url })}
                    onFileSelect={(file) => setStagedProductFile(file)}
                    token={token}
                  />

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Short Description</label>
                    <textarea 
                      rows={2}
                      value={productForm.shortDescription}
                      onChange={e => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Technical Specifications (Standard, Pressure, Dimensions)</label>
                    <textarea 
                      rows={2}
                      value={productForm.specifications}
                      onChange={e => setProductForm({ ...productForm, specifications: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox"
                      id="featProd"
                      checked={productForm.isFeatured}
                      onChange={e => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="featProd" className="text-slate-300 font-semibold cursor-pointer">
                      Spotlight as Featured Product on Homepage
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                    <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold">
                      {editingProduct ? 'Save Changes' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 4. BLOG ADD / EDIT MODAL */}
          {showBlogModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
                <button onClick={() => setShowBlogModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
                <h3 className="text-base font-bold text-white">
                  {editingBlog ? 'Edit Technical Article' : 'Write New Technical Article'}
                </h3>

                {blogFormError && (
                  <div className="p-3 bg-rose-950 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{blogFormError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveBlog} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Article Title *</label>
                    <input 
                      type="text" 
                      required
                      value={blogForm.title}
                      onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                      placeholder="e.g. Advances in PE100-RC Resins"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">URL Slug *</label>
                    <input 
                      type="text" 
                      required
                      value={blogForm.slug}
                      onChange={e => setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="e.g. advances-in-pe100-rc"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Category</label>
                      <select 
                        value={blogForm.blogCategoryId}
                        onChange={e => setBlogForm({ ...blogForm, blogCategoryId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      >
                        {blogCategories.map(c => (
                          <option key={c.blogCategoryId} value={c.blogCategoryId}>{c.categoryName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Author Name</label>
                      <input 
                        type="text" 
                        value={blogForm.author}
                        onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <ImageUploadDropzone
                    category="blogs"
                    label="Featured Article Thumbnail"
                    helperText="PNG, JPG, WEBP, SVG (Max 5MB) · Uploads to API on Save"
                    value={blogForm.featuredImageUrl}
                    onChange={(url) => setBlogForm({ ...blogForm, featuredImageUrl: url })}
                    onFileSelect={(file) => setStagedBlogFile(file)}
                    token={token}
                  />

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Short Summary</label>
                    <textarea 
                      rows={2}
                      value={blogForm.shortDescription}
                      onChange={e => setBlogForm({ ...blogForm, shortDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Article Content (HTML allowed) *</label>
                    <textarea 
                      rows={5}
                      required
                      value={blogForm.content}
                      onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox"
                      id="pubCheck"
                      checked={blogForm.isPublished}
                      onChange={e => setBlogForm({ ...blogForm, isPublished: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="pubCheck" className="text-slate-300 font-semibold cursor-pointer">
                      Publish immediately (uncheck to save as draft)
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                    <button type="button" onClick={() => setShowBlogModal(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold">
                      {editingBlog ? 'Update Article' : 'Publish Article'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 5. DELETE PRODUCT CONFIRMATION MODAL */}
          {productToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
                <h3 className="text-base font-bold text-white">Delete Product</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to permanently delete <strong>{productToDelete.productName}</strong>?
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setProductToDelete(null)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
                  <button onClick={handleDeleteProduct} className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl">
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. DELETE BLOG CONFIRMATION MODAL */}
          {blogToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
                <h3 className="text-base font-bold text-white">Delete Blog Article</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to delete <strong>{blogToDelete.title}</strong>?
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setBlogToDelete(null)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
                  <button onClick={handleDeleteBlog} className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl">
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. LEAD STATUS MODAL */}
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
                    <textarea value={leadRemarks} onChange={e => setLeadRemarks(e.target.value)} rows={3} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" placeholder="Add quotation notes..."></textarea>
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
              value={codeSearchTerm}
              onChange={e => setCodeSearchTerm(e.target.value)}
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
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
              {filteredFiles.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedFile.path === file.path
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-semibold">{file.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 ml-2">
                    {file.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[700px] overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-blue-400">{selectedFile.path}</div>
                <div className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</div>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/60 select-text">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ARCHITECTURE & SECURITY MATRIX */}
      {/* ========================================================================= */}
      {subView === 'docs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 max-w-4xl mx-auto text-xs leading-relaxed">
          <h2 className="text-xl font-bold text-white">Angular 19 Enterprise Architecture & Security Blueprint</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-blue-400">Public User Portal</div>
              <p className="text-slate-400">Includes dynamic Homepage, Product Catalog with search and category filters, Engineering Blogs reader, About Us with technical specifications, and Rate-Limited RFQ Lead generation.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-amber-400">Admin Control Panel</div>
              <p className="text-slate-400">Guarded by <code>adminGuard</code> and <code>jwtInterceptor</code>. Features complete CRUD for Products and Blogs, Inquiries CRM, Dynamic Disk Logs viewer, Company & WhatsApp configuration, and Admin Security.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-slate-200">Dynamic Logging Architecture</div>
            <p className="text-slate-400">Every incoming request and administrative mutation is recorded physically to <code>/logs/ompolymer-api.log</code>. Administrators can inspect, filter by severity level, search, rotate, and download raw server logs in real time.</p>
          </div>
        </div>
      )}
    </div>
  );
};
