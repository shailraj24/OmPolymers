import React, { useState } from 'react';
import { csharpSolutionFiles, CodeFile } from '../csharp-solution/solutionFiles.js';
import { Copy, Check, Download, FileCode, Layers, Server, ShieldCheck, Database } from 'lucide-react';
import { exportSolutionZip } from '../utils/zipExporter.js';

export const SolutionExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(csharpSolutionFiles[3]); // Program.cs default
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const categories = [
    'All',
    'Program',
    'Controllers',
    'Services',
    'DTOs',
    'Data & EF Core',
    'Middleware',
    'Database SQL',
    'Configuration',
    'Tests'
  ];

  const filteredFiles = categoryFilter === 'All'
    ? csharpSolutionFiles
    : csharpSolutionFiles.filter(f => f.category === categoryFilter);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await exportSolutionZip();
    } finally {
      setDownloading(false);
    }
  };

  const lines = selectedFile.content.split('\n');

  return (
    <div className="space-y-6">
      {/* Architecture Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Server className="w-4 h-4" />
            <h3 className="text-xs font-semibold text-slate-200">Runtime & Framework</h3>
          </div>
          <p className="text-sm font-bold text-slate-100">.NET 10 LTS</p>
          <p className="text-[11px] text-slate-400 mt-1">
            C# 14, Minimal Hosting in Program.cs with async/await & CancellationToken support.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Database className="w-4 h-4" />
            <h3 className="text-xs font-semibold text-slate-200">ORM & Strategy</h3>
          </div>
          <p className="text-sm font-bold text-slate-100">EF Core Database First</p>
          <p className="text-[11px] text-slate-400 mt-1">
            SQL Server is source of truth. AsNoTracking() read queries, zero entity leakage.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-xs font-semibold text-slate-200">Security & Auth</h3>
          </div>
          <p className="text-sm font-bold text-slate-100">JWT Bearer + BCrypt</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Role authorization claims, salted hashes, and failed-login brute-force throttle.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Layers className="w-4 h-4" />
            <h3 className="text-xs font-semibold text-slate-200">Rate Limiting</h3>
          </div>
          <p className="text-sm font-bold text-slate-100">RFC 6585 Policies</p>
          <p className="text-[11px] text-slate-400 mt-1">
            FixedWindowLimiter on quote submissions (2/min) and auth logins (5/min).
          </p>
        </div>
      </div>

      {/* GitHub Repository Push Guide */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
              🐙
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Git Repository Initialized in /dotnet</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Committed (76 Files)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                The entire ASP.NET Core 10 backend solution is generated on disk at <code className="text-blue-400">/dotnet</code> with initial Git commit.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Packing...' : 'Download .NET ZIP'}</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-300 mb-2">
            To push this repository to GitHub:
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
            <div className="text-slate-500"># 1. Create a new repository on GitHub (e.g. om-polymer-api)</div>
            <div className="text-slate-500"># 2. In your terminal inside the dotnet folder:</div>
            <div className="text-blue-400">git remote add origin https://github.com/&lt;USERNAME&gt;/&lt;REPO-NAME&gt;.git</div>
            <div className="text-blue-400">git branch -M main</div>
            <div className="text-emerald-400">git push -u origin main</div>
          </div>
        </div>
      </div>


      {/* Categories Bar & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>{downloading ? 'Packing Zip...' : 'Download Solution (.zip)'}</span>
        </button>
      </div>

      {/* Main Solution Browser: File List + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Solution File Tree */}
        <div className="lg:col-span-4 space-y-1.5 max-h-[720px] overflow-y-auto pr-1">
          {filteredFiles.map(file => {
            const isSelected = selectedFile.path === file.path;
            const lineCount = file.content.split('\n').length;
            return (
              <div
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500/70 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-mono font-medium text-slate-200 truncate">
                      {file.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {lineCount} lines
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-blue-400 font-medium">
                    {file.category}
                  </span>
                  <span className="text-[10px] text-slate-500">·</span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {file.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Code Display */}
        <div className="lg:col-span-8 space-y-3 bg-slate-950 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-200">
                  {selectedFile.path}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  {selectedFile.language.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Syntax / Line-numbered Viewer */}
          <div className="bg-slate-950 font-mono text-xs rounded-md border border-slate-800/80 max-h-[600px] overflow-auto">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="w-12 py-0.5 pl-3 pr-4 text-right text-slate-600 select-none text-[11px] border-r border-slate-800/80 align-top">
                      {idx + 1}
                    </td>
                    <td className="py-0.5 pl-4 pr-3 text-slate-200 whitespace-pre font-mono text-[11px] leading-relaxed">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
