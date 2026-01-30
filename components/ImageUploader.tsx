import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ImageUploadProps } from '../types';

export const ImageUploader: React.FC<ImageUploadProps> = ({ onImageSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragError(null);
  }, []);

  const validateAndSelectFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setDragError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    // Limit size to roughly 10MB to avoid browser/network issues
    if (file.size > 10 * 1024 * 1024) {
      setDragError("Image is too large. Please upload an image under 10MB.");
      return;
    }
    onImageSelect(file);
    setDragError(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  }, [disabled, onImageSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative group rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' 
          : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        h-64 sm:h-80 w-full flex flex-col items-center justify-center p-6 text-center
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && document.getElementById('file-upload')?.click()}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        disabled={disabled}
      />

      <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-white shadow-sm'}`}>
        {isDragging ? (
          <UploadCloud className="w-10 h-10 text-emerald-600" />
        ) : (
          <ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-emerald-500" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {isDragging ? "Drop image here" : "Upload Architectural Photo"}
      </h3>
      
      <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
        Drag & drop or click to browse. Supports JPG, PNG, WEBP.
      </p>

      {dragError && (
        <div className="absolute bottom-4 left-0 right-0 mx-auto w-max max-w-[90%] flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm border border-red-100 shadow-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{dragError}</span>
        </div>
      )}
    </div>
  );
};
