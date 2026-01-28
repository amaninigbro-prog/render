declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

export interface RenderState {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
}

export interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  disabled: boolean;
}

export interface ComparisonViewProps {
  originalImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
}