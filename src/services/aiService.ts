import { HfInference } from '@huggingface/inference';
import type { Presentation, Slide } from '../types';

// Initialize Hugging Face client
// Get your free token from https://huggingface.co/settings/tokens
const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY || 'hf_dummy_key');

// AI prompt templates for different purposes
const PROMPTS = {
  generateSlides: (topic: string) => `Create a presentation outline about "${topic}" with the following format for each slide:
- Title: The slide's title
- Content: The main content
- Layout: One of: title, content, twoColumn, image
- ImagePrompt: A description of an image that would work well (if applicable)

Format the response as a JSON array of slides. Example:
[
  {
    "title": "Introduction",
    "content": "Overview of the topic",
    "layout": "title"
  }
]`,

  enhanceContent: (content: string) => `Improve the following slide content with more engaging language and better structure:
${content}

Keep the response focused and concise.`,

  suggestImage: (content: string) => `Based on this slide content:
${content}

Suggest a specific keyword for finding a relevant image on Unsplash. Response should be a single word or short phrase.`,
};

interface GeneratedSlide {
  title: string;
  content: string;
  layout: 'title' | 'content' | 'twoColumn' | 'image';
  imagePrompt?: string;
}

export const aiService = {
  async generatePresentation(topic: string): Promise<GeneratedSlide[]> {
    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: PROMPTS.generateSlides(topic),
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      // Parse the response and extract the JSON array
      const textResponse = response.generated_text;
      const jsonStart = textResponse.indexOf('[');
      const jsonEnd = textResponse.lastIndexOf(']') + 1;
      const jsonStr = textResponse.slice(jsonStart, jsonEnd);
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to generate presentation:', error);
      // Fallback to basic structure if AI fails
      return [
        {
          title: `Introduction to ${topic}`,
          content: `Let's explore ${topic} together.`,
          layout: 'title',
        },
        {
          title: 'Key Points',
          content: 'Main aspects to consider...',
          layout: 'content',
        },
      ];
    }
  },

  async enhanceSlide(slide: Slide): Promise<Partial<Slide>> {
    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: PROMPTS.enhanceContent(slide.content),
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      const enhancedContent = response.generated_text.trim();
      
      return {
        content: enhancedContent,
        layout: enhancedContent.length > 200 ? 'twoColumn' : slide.layout,
      };
    } catch (error) {
      console.error('Failed to enhance slide:', error);
      return { content: slide.content };
    }
  },

  async generateImageSuggestion(content: string): Promise<string> {
    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: PROMPTS.suggestImage(content),
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      const keyword = response.generated_text.trim().toLowerCase();
      // Use the AI-generated keyword to create an Unsplash URL
      return `https://source.unsplash.com/featured/?${encodeURIComponent(keyword)}`;
    } catch (error) {
      console.error('Failed to generate image suggestion:', error);
      return 'https://source.unsplash.com/featured/?presentation';
    }
  },
};