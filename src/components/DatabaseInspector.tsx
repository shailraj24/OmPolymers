import React, { useState, useEffect } from 'react';
import { Database, Table, RefreshCw, Copy, Check, ShieldAlert } from 'lucide-react';
import { csharpSolutionFiles } from '../csharp-solution/solutionFiles.js';

interface TableMeta {
  name: string;
  description: string;
  primaryKey: string;
  foreignKeys?: string;
  indexes: string;
  apiRoute: string;
}

const TABLES_METADATA: TableMeta[] = [
  {
    name: 'AdminUsers',
    description: 'System administrators with salted BCrypt password hashes and activation status',
    primaryKey: 'AdminID (INT IDENTITY)',
    indexes: 'UNIQUE(Email)',
    apiRoute: '/api/admin/auth/login'
  },
  {
    name: 'CompanySettings',
    description: 'Single-row global configuration: 13 years experience, contacts, WhatsApp number',
    primaryKey: 'SettingID (INT IDENTITY)',
    indexes: 'PK_CompanySettings',
    apiRoute: '/api/company'
  },
  {
    name: 'ProductCategories',
    description: 'Polymer segments (HDPE Pipes, Engineering Resins, Masterbatches, Fittings)',
    primaryKey: 'CategoryID (INT IDENTITY)',
    indexes: 'UNIQUE(Slug)',
    apiRoute: '/api/products/categories'
  },
  {
    name: 'Products',
    description: 'Polymer product catalog with technical specs and featured status',
    primaryKey: 'ProductID (INT IDENTITY)',
    foreignKeys: 'FK_Products_Categories -> ProductCategories(CategoryID)',
    indexes: 'UNIQUE(Slug), IX(IsActive, IsFeatured)',
    apiRoute: '/api/products'
  },
  {
    name: 'ProductImages',
    description: 'Gallery images per product with cascade delete rule',
    primaryKey: 'ImageID (INT IDENTITY)',
    foreignKeys: 'FK_ProductImages_Products -> Products(ProductID) ON DELETE CASCADE',
    indexes: 'IX_ProductImages_ProductID',
    apiRoute: '/api/products/:id'
  },
  {
    name: 'BlogCategories',
    description: 'Industry insights and technical paper taxonomy',
    primaryKey: 'BlogCategoryID (INT IDENTITY)',
    indexes: 'UNIQUE(Slug)',
    apiRoute: '/api/blogs/categories'
  },
  {
    name: 'BlogPosts',
    description: 'Company articles, technical news, and draft/published moderation',
    primaryKey: 'BlogID (INT IDENTITY)',
    foreignKeys: 'FK_Blogs_Categories -> BlogCategories(BlogCategoryID) ON DELETE SET NULL',
    indexes: 'UNIQUE(Slug), IX(IsPublished, PublishedAt)',
    apiRoute: '/api/blogs'
  },
  {
    name: 'ClientRequirements',
    description: 'Customer quote inquiries & RFQ leads. Permanent storage, never deleted',
    primaryKey: 'RequirementID (INT IDENTITY)',
    indexes: 'IX_ClientRequirements_Status',
    apiRoute: '/api/requirements'
  },
  {
    name: 'Testimonials',
    description: 'Verified customer reviews with 1-5 rating and moderation approval flags',
    primaryKey: 'TestimonialID (INT IDENTITY)',
    indexes: 'IX_Testimonials_Published',
    apiRoute: '/api/testimonials'
  }
];

export const DatabaseInspector: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('Products');
  const [tableData, setTableData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const sqlScript = csharpSolutionFiles.find(f => f.name === 'OMPolymerDB.sql')?.content || '';

  const fetchTableData = async (tableName: string) => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (tableName) {
        case 'Products':
          endpoint = '/api/products?page=1&pageSize=50';
          break;
        case 'ProductCategories':
          endpoint = '/api/products/categories';
          break;
        case 'BlogPosts':
          endpoint = '/api/blogs?page=1&pageSize=50';
          break;
        case 'BlogCategories':
          endpoint = '/api/blogs/categories';
          break;
        case 'CompanySettings':
          endpoint = '/api/company';
          break;
        case 'Testimonials':
          endpoint = '/api/testimonials';
          break;
        case 'ClientRequirements':
          endpoint = '/api/admin/requirements?page=1&pageSize=50';
          break;
        case 'AdminUsers':
          endpoint = '/api/admin/database/overview';
          break;
        default:
          endpoint = '/api/products';
      }

      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('om_token') || ''}`
        }
      });
      const data = await res.json();
      if (data.data && Array.isArray(data.data.items)) {
        setTableData(data.data.items);
      } else if (data.data && Array.isArray(data.data)) {
        setTableData(data.data);
      } else if (data.data) {
        setTableData([data.data]);
      } else {
        setTableData([]);
      }
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(selectedTable);
  }, [selectedTable]);

  const copySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleResetDb = async () => {
    const token = localStorage.getItem('om_token');
    if (!token) {
      alert('Please log in as Admin first (click "Admin Login" in top bar) to reset database.');
      return;
    }
    setResetting(true);
    try {
      const res = await fetch('/api/admin/database/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
        fetchTableData(selectedTable);
      }
    } finally {
      setResetting(false);
    }
  };

  const currentMeta = TABLES_METADATA.find(t => t.name === selectedTable);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-lg p-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>SQL Server (Database-First) Schema & Tables</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Database serves as the single source of truth. Scaffolding is generated via <code className="text-slate-300 font-mono">dotnet ef dbcontext scaffold</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copySql}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'SQL Copied!' : 'Copy SSMS Script'}</span>
          </button>

          <button
            onClick={handleResetDb}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-md transition-colors disabled:opacity-50"
            title="Reset in-memory database to factory demo seed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset Demo Seed'}</span>
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-md p-3 text-xs text-emerald-200">
          Database tables successfully re-seeded to factory demo state.
        </div>
      )}

      {/* Tables Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {TABLES_METADATA.map(t => (
          <button
            key={t.name}
            onClick={() => setSelectedTable(t.name)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedTable === t.name
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Table className="w-3 h-3" />
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      {/* Table Metadata Banner */}
      {currentMeta && (
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <span className="text-sm font-semibold font-mono text-indigo-300">
              dbo.{currentMeta.name}
            </span>
            <span className="text-xs text-slate-400">
              Mapped API: <code className="text-blue-400 font-mono">{currentMeta.apiRoute}</code>
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {currentMeta.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] font-mono text-slate-400">
            <div>
              <span className="text-slate-500">Primary Key:</span> <span className="text-slate-200">{currentMeta.primaryKey}</span>
            </div>
            <div>
              <span className="text-slate-500">Indexes:</span> <span className="text-slate-200">{currentMeta.indexes}</span>
            </div>
            {currentMeta.foreignKeys && (
              <div className="truncate" title={currentMeta.foreignKeys}>
                <span className="text-slate-500">Foreign Key:</span> <span className="text-slate-200">{currentMeta.foreignKeys}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Table Records Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Live Records ({tableData.length})
          </h3>
          <button
            onClick={() => fetchTableData(selectedTable)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto max-h-[460px]">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Loading table records...
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No records found or authentication required to inspect table.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  {Object.keys(tableData[0] as object).map(col => (
                    <th key={col} className="px-3.5 py-2.5 whitespace-nowrap font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 text-slate-300 transition-colors">
                    {Object.values(row as object).map((val, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap max-w-xs truncate">
                        {typeof val === 'object' && val !== null
                          ? JSON.stringify(val)
                          : String(val ?? 'NULL')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
