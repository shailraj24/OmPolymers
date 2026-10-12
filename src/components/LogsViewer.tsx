import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  RefreshCw, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  HardDrive, 
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Activity
} from 'lucide-react';

interface LogsViewerProps {
  token: string | null;
  onQuickLogin: () => void;
}

export const LogsViewer: React.FC<LogsViewerProps> = ({ token, onQuickLogin }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [availableFiles, setAvailableFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('ompolymer-api.log');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchLogs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = `/api/admin/logs?filename=${encodeURIComponent(selectedFile)}&level=${encodeURIComponent(selectedLevel)}&search=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLogs(data.data.logs || []);
        setAvailableFiles(data.data.availableFiles || []);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed fetching dynamic logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token, selectedFile, selectedLevel]);

  useEffect(() => {
    let interval: any;
    if (autoRefresh && token) {
      interval = setInterval(() => {
        fetchLogs();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, token, selectedFile, selectedLevel, searchTerm]);

  const handleClearLog = async () => {
    if (!token) return;
    if (!confirm(`Are you sure you want to rotate and clear log file '${selectedFile}'?`)) return;
    try {
      const res = await fetch('/api/admin/logs/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ filename: selectedFile })
      });
      const data = await res.json();
      if (data.success) {
        fetchLogs();
      }
    } catch (err) {
      console.error('Failed clearing log file', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Host Filesystem: /logs
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
              Live Structured Logs
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <span>Dynamic Server & Application Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Streamed in real-time from the physical <code>/logs</code> directory. Automatically records HTTP requests, database access, authorization audits, and rate-limiting triggers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              autoRefresh 
                ? 'bg-emerald-950 text-emerald-400 border-emerald-700' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{autoRefresh ? 'Auto-Refresh (5s)' : 'Auto-Refresh Off'}</span>
          </button>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <a
            href={`/api/admin/logs/download/${selectedFile}?token=${token}`}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>

          <button
            onClick={handleClearLog}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800 rounded-xl transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rotate & Clear</span>
          </button>
        </div>
      </div>

      {!token ? (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Administrator Authentication Required</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Viewing production log streams requires an active Bearer JWT token issued by the ASP.NET Core API.
          </p>
          <button
            onClick={onQuickLogin}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
          >
            Authenticate as Admin
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">File:</span>
                <select
                  value={selectedFile}
                  onChange={e => setSelectedFile(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono focus:outline-none"
                >
                  {availableFiles.map(f => (
                    <option key={f.fileName} value={f.fileName}>
                      {f.fileName} ({(f.sizeBytes / 1024).toFixed(1)} KB)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Level:</span>
                <select
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono focus:outline-none"
                >
                  <option value="ALL">ALL LEVELS</option>
                  <option value="INF">INF (Information)</option>
                  <option value="WRN">WRN (Warning)</option>
                  <option value="ERR">ERR (Error)</option>
                  <option value="SEC">SEC (Security Audit)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 md:max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search logs by keyword, IP, path, exception..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchLogs()}
                  className="w-full bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {lastRefreshed && (
                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                  Updated: {lastRefreshed}
                </span>
              )}
            </div>
          </div>

          {/* Log Window */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] h-[600px] overflow-y-auto space-y-1.5 select-text shadow-inner">
            {logs.length === 0 ? (
              <div className="text-slate-500 py-24 text-center space-y-2">
                <Terminal className="w-8 h-8 mx-auto text-slate-600" />
                <div className="font-semibold">No log events recorded matching your filters.</div>
                <div className="text-xs text-slate-600">Perform actions in the Public Portal or API Explorer to generate live log events.</div>
              </div>
            ) : (
              logs.map((log) => {
                const levelColor = 
                  log.level === 'ERR' ? 'text-rose-400 bg-rose-950/60 border-rose-800' :
                  log.level === 'WRN' ? 'text-amber-400 bg-amber-950/60 border-amber-800' :
                  log.level === 'SEC' ? 'text-purple-400 bg-purple-950/60 border-purple-800' :
                  'text-blue-400 bg-blue-950/60 border-blue-800';

                return (
                  <div key={log.id} className="flex items-start gap-2.5 py-1 px-2 rounded hover:bg-slate-900/60 transition-colors">
                    <span className="text-slate-500 shrink-0 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold shrink-0 ${levelColor}`}>
                      {log.level}
                    </span>
                    <span className="text-slate-400 shrink-0 text-[10px] max-w-[160px] truncate">
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
    </div>
  );
};
