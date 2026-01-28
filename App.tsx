import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ComparisonView } from './components/ComparisonView';
import { generateRender } from './services/geminiService';
import { AlertCircle, Wand2, RefreshCw } from 'lucide-react';
import { RenderState } from './types';

function App() {
  const [state, setState] = useState<RenderState>({
    originalImage: null,
    generatedImage: null,
    isGenerating: false,
    error: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setState(prev => ({
      ...prev,
      originalImage: objectUrl,
      generatedImage: null,
      error: null
    }));
  }, []);

  const handleRender = async () => {
    if (!selectedFile) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const resultImage = await generateRender(selectedFile);
      setState(prev => ({
        ...prev,
        generatedImage: resultImage,
        isGenerating: false
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "An unexpected error occurred during generation."
      }));
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setState({
      originalImage: null,
      generatedImage: null,
      isGenerating: false,
      error: null
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Error Notification */}
        {state.error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{state.error}</p>
          </div>
        )}

        {/* Main Workspace */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 lg:p-10">
          
          {/* 1. Upload View */}
          {!state.originalImage && (
            <div className="animate-fade-in">
              <ImageUploader onImageSelect={handleImageSelect} disabled={state.isGenerating} />
            </div>
          )}

          {/* 2. Comparison & Controls View */}
          {state.originalImage && (
            <div className="flex flex-col gap-8">
              <ComparisonView 
                originalImage={state.originalImage}
                generatedImage={state.generatedImage}
                isLoading={state.isGenerating}
              />

              {/* Control Bar */}
              <div className="flex flex-col items-center justify-center gap-6 pt-6 border-t border-slate-100">
                
                {!state.generatedImage && !state.isGenerating && (
                  <div className="flex flex-col items-center w-full">
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleRender}
                        className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <Wand2 className="w-5 h-5" />
                        Generative Render
                      </button>
                      <button
                        onClick={handleReset}
                        className="text-slate-400 hover:text-red-500 text-sm font-medium px-4 py-2 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {state.generatedImage && (
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start New Project
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;