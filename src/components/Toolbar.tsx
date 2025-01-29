import React from 'react';
import { 
  Plus, 
  Download, 
  Wand2, 
  Presentation, 
  Image as ImageIcon,
  Layout,
  Palette,
  Trash2,
  Sparkles
} from 'lucide-react';

interface ToolbarProps {
  onNewSlide: () => void;
  onDeleteSlide: () => void;
  onExport: (format: 'pptx' | 'google') => void;
  onPresent: () => void;
  onAiEnhance: () => void;
  onAiGenerate: () => void;
  canDelete: boolean;
}

export function Toolbar({ 
  onNewSlide, 
  onDeleteSlide, 
  onExport, 
  onPresent,
  onAiEnhance,
  onAiGenerate,
  canDelete 
}: ToolbarProps) {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-white shadow-lg flex flex-col items-center py-4 gap-6">
      <button 
        className="p-3 hover:bg-blue-50 rounded-lg text-blue-600" 
        title="New Slide"
        onClick={onNewSlide}
      >
        <Plus className="w-6 h-6" />
      </button>
      {canDelete && (
        <button 
          className="p-3 hover:bg-red-50 rounded-lg text-red-600" 
          title="Delete Slide"
          onClick={onDeleteSlide}
        >
          <Trash2 className="w-6 h-6" />
        </button>
      )}
      <button 
        className="p-3 hover:bg-purple-50 rounded-lg text-purple-600" 
        title="Generate with AI"
        onClick={onAiGenerate}
      >
        <Wand2 className="w-6 h-6" />
      </button>
      <button 
        className="p-3 hover:bg-purple-50 rounded-lg text-purple-600" 
        title="Enhance with AI"
        onClick={onAiEnhance}
      >
        <Sparkles className="w-6 h-6" />
      </button>
      <div className="flex-1"></div>
      <button 
        className="p-3 hover:bg-blue-50 rounded-lg" 
        title="Present"
        onClick={onPresent}
      >
        <Presentation className="w-6 h-6" />
      </button>
      <div className="relative group">
        <button 
          className="p-3 hover:bg-blue-50 rounded-lg" 
          title="Export"
        >
          <Download className="w-6 h-6" />
        </button>
        <div className="absolute left-full ml-2 bottom-0 hidden group-hover:block">
          <div className="bg-white rounded-lg shadow-lg py-2 w-48">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => onExport('pptx')}
            >
              Export to PowerPoint
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => onExport('google')}
            >
              Export to Google Slides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}