import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { aiService } from '../services/aiService';

interface AiDialogProps {
  onClose: () => void;
  onGeneratePresentation: (slides: any[]) => void;
}

export function AiDialog({ onClose, onGeneratePresentation }: AiDialogProps) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    try {
      const slides = await aiService.generatePresentation(topic);
      onGeneratePresentation(slides);
      onClose();
    } catch (error) {
      console.error('Failed to generate presentation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">AI Presentation Generator</h2>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            What would you like to create a presentation about?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., Artificial Intelligence, Climate Change, etc."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Presentation'}
          </button>
        </div>
      </div>
    </div>
  );
}