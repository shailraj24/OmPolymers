import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertTriangle, RefreshCw, Clock } from 'lucide-react';

export async function uploadImageFile(file: File, category: string, token?: string | null): Promise<string> {
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      resolve(res.split(',')[1] || res);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const authToken = token || (typeof localStorage !== 'undefined' ? (localStorage.getItem('om_token') || localStorage.getItem('token')) : null);

  const res = await fetch('/api/uploads/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
    },
    body: JSON.stringify({
      category,
      fileName: file.name,
      base64Data,
      contentType: file.type || 'image/jpeg'
    })
  });

  const data = await res.json();
  if (!res.ok || !data.success || !data.data?.relativeUrl) {
    throw new Error(data.message || (data.errors && data.errors[0]) || 'Image upload failed.');
  }

  return data.data.relativeUrl;
}

interface ImageUploadDropzoneProps {

  category: 'products' | 'blogs' | 'logos' | 'company' | 'admins';
  value: string;
  onChange: (relativeUrl: string) => void;
  onFileSelect?: (file: File | null) => void;
  label?: string;
  helperText?: string;
  token?: string | null;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  category,
  value,
  onChange,
  onFileSelect,
  label = 'Upload Image',
  helperText = 'PNG, JPG, WEBP, SVG (Max 5MB) · Uploads on Save',
  token
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(value || null);
  const [stagedFileName, setStagedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = 5 * 1024 * 1024; // 5MB
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

  useEffect(() => {
    if (!stagedFileName) {
      setLocalPreview(value || null);
    }
  }, [value, stagedFileName]);

  const validateFile = (file: File): string | null => {
    if (!file || file.size === 0) return 'Selected file is empty.';
    if (file.size > maxSizeBytes) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 5 MB limit.`;
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return `Format '${ext}' not supported. Allowed: ${allowedExtensions.join(', ')}.`;
    }
    return null;
  };

  const processFile = (file: File) => {
    setError(null);
    const validationErr = validateFile(file);
    if (validationErr) {
      setError(validationErr);
      return;
    }

    // Set immediate client-side preview without triggering API upload
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setStagedFileName(file.name);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalPreview(null);
    setStagedFileName(null);
    setError(null);
    onChange('');
    if (onFileSelect) onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-300">{label}</label>
        <span className="text-[10px] text-slate-500 font-mono">{helperText}</span>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-3 transition-all flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden min-h-[110px] ${
          isDragging ? 'border-blue-500 bg-blue-950/30' :
          stagedFileName ? 'border-amber-500/70 bg-amber-950/20' :
          localPreview ? 'border-slate-800 bg-slate-950/80 hover:border-slate-700' :
          'border-slate-700 bg-slate-950/50 hover:border-blue-600 hover:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.svg,image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {localPreview ? (
          <div className="w-full flex items-center gap-3">
            <div className="w-20 h-16 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={localPreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-[11px] font-mono text-slate-200 truncate">
                {stagedFileName ? `Staged: ${stagedFileName}` : localPreview}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                {stagedFileName ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Ready — uploads when you click Save</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active stored in /uploads/{category}/</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                title="Change File"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 rounded-md transition-colors"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2 space-y-1">
            <Upload className="w-6 h-6 mx-auto text-blue-400" />
            <div className="text-[11px] font-semibold text-slate-200">
              Click to select or drag & drop image
            </div>
            <div className="text-[10px] text-slate-400">
              Staged locally · uploads to server folder <span className="font-mono text-slate-300">/uploads/{category}/</span> on Save
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-2 bg-rose-950/60 border border-rose-800 rounded-lg text-[10px] text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-rose-400 hover:text-white">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
