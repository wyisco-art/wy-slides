export interface Slide {
  id: string;
  title: string;
  content: string;
  layout: 'title' | 'content' | 'twoColumn' | 'image';
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  theme: {
    primary: string;
    secondary: string;
    font: string;
  };
}

export interface AISuggestion {
  id: string;
  text: string;
  type: 'content' | 'style' | 'structure';
}