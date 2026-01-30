import React from 'react';
import { Home, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">VANDER</h1>
              <p className="text-xs text-slate-500 font-medium">Architectural Visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Powered by VANDER</span>
          </div>
        </div>
      </div>
    </header>
  );
};