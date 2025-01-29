import React, { useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { SlideEditor } from './components/SlideEditor';
import { AiDialog } from './components/AiDialog';
import { aiService } from './services/aiService';
import type { Presentation, Slide } from './types';

function App() {
  const [presentation, setPresentation] = useState<Presentation>({
    id: '1',
    title: 'Untitled Presentation',
    slides: [
      {
        id: '1',
        title: 'Welcome to AI Slideshow Designer',
        content: 'Create beautiful presentations with AI assistance',
        layout: 'title',
        backgroundColor: '#ffffff',
        textColor: '#000000',
      },
    ],
    theme: {
      primary: '#3b82f6',
      secondary: '#93c5fd',
      font: 'Inter',
    },
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);

  const handleSlideUpdate = (updatedSlide: Slide) => {
    const newSlides = [...presentation.slides];
    newSlides[currentSlideIndex] = updatedSlide;
    setPresentation({ ...presentation, slides: newSlides });
  };

  const handleNewSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: 'New Slide',
      content: '',
      layout: 'content',
      backgroundColor: '#ffffff',
      textColor: '#000000',
    };

    setPresentation({
      ...presentation,
      slides: [...presentation.slides, newSlide]
    });
    setCurrentSlideIndex(presentation.slides.length);
  };

  const handleDeleteSlide = () => {
    if (presentation.slides.length <= 1) return;

    const newSlides = presentation.slides.filter((_, index) => index !== currentSlideIndex);
    setPresentation({ ...presentation, slides: newSlides });
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  const handleExport = async (format: 'pptx' | 'google') => {
    alert(`Export to ${format} will be implemented soon!`);
  };

  const handlePresent = () => {
    setIsPresenting(true);
  };

  const handleAiGenerate = async (generatedSlides: any[]) => {
    const newSlides: Slide[] = await Promise.all(
      generatedSlides.map(async (slide) => {
        let imageUrl;
        if (slide.layout === 'image' && slide.imagePrompt) {
          imageUrl = await aiService.generateImageSuggestion(slide.imagePrompt);
        }

        return {
          id: Date.now().toString() + Math.random(),
          title: slide.title,
          content: slide.content,
          layout: slide.layout,
          backgroundColor: '#ffffff',
          textColor: '#000000',
          imageUrl,
        };
      })
    );

    setPresentation({
      ...presentation,
      slides: newSlides,
    });
    setCurrentSlideIndex(0);
  };

  const handleAiEnhance = async () => {
    const currentSlide = presentation.slides[currentSlideIndex];
    const enhancement = await aiService.enhanceSlide(currentSlide);
    
    handleSlideUpdate({
      ...currentSlide,
      ...enhancement,
    });
  };

  if (isPresenting) {
    return (
      <div 
        className="fixed inset-0 bg-black"
        onClick={() => setIsPresenting(false)}
      >
        <div className="max-w-4xl mx-auto h-full flex items-center justify-center p-8">
          <div 
            className="w-full aspect-video rounded-lg p-8"
            style={{
              backgroundColor: presentation.slides[currentSlideIndex].backgroundColor,
              color: presentation.slides[currentSlideIndex].textColor
            }}
          >
            <h1 className="text-4xl font-bold mb-8">
              {presentation.slides[currentSlideIndex].title}
            </h1>
            {presentation.slides[currentSlideIndex].imageUrl && (
              <img 
                src={presentation.slides[currentSlideIndex].imageUrl}
                alt="Slide content"
                className="mb-8 rounded-lg max-h-[50vh] object-contain"
              />
            )}
            <div className="text-xl whitespace-pre-wrap">
              {presentation.slides[currentSlideIndex].content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toolbar 
        onNewSlide={handleNewSlide}
        onDeleteSlide={handleDeleteSlide}
        onExport={handleExport}
        onPresent={handlePresent}
        onAiEnhance={handleAiEnhance}
        onAiGenerate={() => setShowAiDialog(true)}
        canDelete={presentation.slides.length > 1}
      />
      <div className="pl-20 pr-4 py-6">
        <header className="mb-8">
          <input
            type="text"
            value={presentation.title}
            onChange={(e) => setPresentation({ ...presentation, title: e.target.value })}
            className="text-3xl font-bold bg-transparent outline-none"
          />
        </header>
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2">
            <div className="space-y-4">
              {presentation.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`p-4 bg-white rounded-lg cursor-pointer transition-all ${
                    currentSlideIndex === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <h4 className="font-medium truncate">{slide.title}</h4>
                  {slide.imageUrl && (
                    <img 
                      src={slide.imageUrl} 
                      alt="Thumbnail" 
                      className="mt-2 w-full h-20 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-10">
            <SlideEditor
              slide={presentation.slides[currentSlideIndex]}
              onUpdate={handleSlideUpdate}
            />
          </div>
        </div>
      </div>

      {showAiDialog && (
        <AiDialog
          onClose={() => setShowAiDialog(false)}
          onGeneratePresentation={handleAiGenerate}
        />
      )}
    </div>
  );
}

export default App