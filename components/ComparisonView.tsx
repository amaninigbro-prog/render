import React from 'react';
import { Download, ArrowRight, Loader2 } from 'lucide-react';
import { ComparisonViewProps } from '../types';

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalImage, generatedImage, isLoading }) => {
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `indorender-output-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!originalImage) return null;

  return (
    <div className="w-full animate-fade-in-up">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Original Image Panel */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Original Input</h3>
          </div>
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <img 
              src={originalImage} 
              alt="Original Architectural Input" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
              Before
            </div>
          </div>
        </div>

        {/* Generated Image Panel */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              AI Output
            </h3>
            {generatedImage && !isLoading && (
              <button 
                onClick={handleDownload}
                className="text-xs flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            )}
          </div>
          
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 lg:border-emerald-100 shadow-sm group">
            
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-emerald-600 animate-pulse" />
                  </div>
                </div>
                <p className="mt-6 text-slate-600 font-medium animate-pulse">Rendering scene...</p>
                <p className="text-xs text-slate-400 mt-2">Injecting atmosphere & details</p>
              </div>
            ) : generatedImage ? (
              <>
                <img 
                  src={generatedImage} 
                  alt="AI Generated Indonesian Residence" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg shadow-emerald-900/20">
                  After
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                <ArrowRight className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Ready to render</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);
