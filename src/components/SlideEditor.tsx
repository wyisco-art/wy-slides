import React, { useState } from 'react';
import { Pencil, Layout, Palette, Type, Image as ImageIcon } from 'lucide-react';
import type { Slide, AISuggestion } from '../types';

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (updatedSlide: Slide) => void;
}

const layouts = [
  { id: 'title', name: 'Title Slide' },
  { id: 'content', name: 'Content' },
  { id: 'twoColumn', name: 'Two Column' },
  { id: 'image', name: 'Image with Text' },
] as const;

export function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...slide, content: e.target.value });
  };

  const handleLayoutChange = (newLayout: Slide['layout']) => {
    onUpdate({ ...slide, layout });
    setShowLayoutMenu(false);
  };

  const handleColorChange = (type: 'background' | 'text', color: string) => {
    if (type === 'background') {
      onUpdate({ ...slide, backgroundColor: color });
    } else {
      onUpdate({ ...slide, textColor: color });
    }
  };

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      onUpdate({ ...slide, imageUrl: url, layout: 'image' });
    }
  };

  // AI suggestions based on current content
  const generateSuggestions = (): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];
    const content = slide.content.toLowerCase();

    if (content.length < 50) {
      suggestions.push({
        id: '1',
        text: 'Add more detail to engage your audience',
        type: 'content'
      });
    }

    if (!content.includes('example') && !content.includes('instance')) {
      suggestions.push({
        id: '2',
        text: 'Include a specific example to illustrate your point',
        type: 'content'
      });
    }

    if (slide.layout === 'content' && content.length > 200) {
      suggestions.push({
        id: '3',
        text: 'Consider splitting this into two slides for better readability',
        type: 'structure'
      });
    }

    return suggestions;
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    let newContent = slide.content;
    
    switch (suggestion.type) {
      case 'content':
        newContent += '\n\n' + suggestion.text;
        break;
      case 'structure':
        // Handle structure suggestions
        break;
      case 'style':
        // Handle style suggestions
        break;
    }

    onUpdate({ ...slide, content: newContent });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={slide.title}
          onChange={(e) => onUpdate({ ...slide, title: e.target.value })}
          className="text-2xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-blue-500 outline-none flex-1"
          placeholder="Slide Title"
        />
        <div className="flex gap-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg" 
            title="Add Image"
            onClick={handleImageAdd}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg" 
              title="Layout"
              onClick={() => setShowLayoutMenu(!showLayoutMenu)}
            >
              <Layout className="w-5 h-5" />
            </button>
            {showLayoutMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                {layouts.map((layout) => (
                  <button
                    key={layout.id}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleLayoutChange(layout.id)}
                  >
                    {layout.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg" 
              title="Theme"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette className="w-5 h-5" />
            </button>
            {showColorPicker && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-4 z-10">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <input
                    type="color"
                    value={slide.backgroundColor}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <input
                    type="color"
                    value={slide.textColor}
                    onChange={(e) => handleColorChange('text', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 lg:col-span-1">
          {slide.layout === 'image' && slide.imageUrl && (
            <div className="mb-4">
              <img 
                src={slide.imageUrl} 
                alt="Slide content" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <textarea
            value={slide.content}
            onChange={handleContentChange}
            className="w-full h-64 p-4 border rounded-lg resize-none"
            placeholder="Enter your slide content..."
            style={{ 
              backgroundColor: slide.backgroundColor,
              color: slide.textColor
            }}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            <h3 className="font-semibold mb-4">AI Suggestions</h3>
            <ul className="space-y-2">
              {generateSuggestions().map((suggestion) => (
                <li 
                  key={suggestion.id}
                  onClick={() => applySuggestion(suggestion)}
                  className="p-2 bg-white rounded cursor-pointer hover:bg-blue-50"
                >
                  • {suggestion.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}