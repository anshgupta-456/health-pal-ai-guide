
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, RefObject } from 'react';

interface PageSpeechButtonProps {
  contentRef: RefObject<HTMLDivElement>;
}

const PageSpeechButton = ({ contentRef }: PageSpeechButtonProps) => {
  const [isReading, setIsReading] = useState(false);
  
  // Use the language context safely
  const { speak, isSupported, currentLanguage } = useLanguage();

  if (!isSupported) return null;

  const extractTextContent = (element: HTMLElement): string => {
    // Get all text content but filter out hidden elements and navigation
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          // Skip hidden elements, navigation, and script tags
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip navigation, button elements, and speak buttons for cleaner reading
          if (parent.tagName === 'NAV' || 
              parent.tagName === 'BUTTON' || 
              parent.closest('button') ||
              parent.classList.contains('lucide-react') ||
              parent.querySelector('.lucide-react')) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Only include text nodes with meaningful content
          const text = node.textContent?.trim();
          if (!text || text.length < 2) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes: string[] = [];
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent?.trim();
      if (text) {
        textNodes.push(text);
      }
    }

    // Clean up the text and remove excessive whitespace
    return textNodes
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:-]/g, '') // Remove special characters that might cause synthesis issues
      .trim();
  };

  const handleReadPage = async () => {
    if (isReading) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    if (!contentRef.current) return;

    try {
      setIsReading(true);
      let pageText = extractTextContent(contentRef.current);
      
      if (!pageText) {
        console.warn('No readable content found on page');
        setIsReading(false);
        return;
      }

      // Limit text length to avoid synthesis issues
      if (pageText.length > 500) {
        pageText = pageText.substring(0, 500) + "...";
      }

      console.log('Reading page content:', pageText.substring(0, 100) + '...');
      
      // Use a simpler approach for reading page content
      const utterance = new SpeechSynthesisUtterance(pageText);
      
      // Set language based on current language
      utterance.lang = currentLanguage.code === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Handle speech end
      utterance.onend = () => {
        setIsReading(false);
      };

      // Handle speech error
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsReading(false);
      };

      // Cancel any existing speech and start new one
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Speech error:', error);
      setIsReading(false);
    }
  };

  return (
    <button
      onClick={handleReadPage}
      className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition-colors disabled:opacity-50"
      title={isReading ? 'Stop reading' : 'Read entire page aloud'}
      disabled={false}
    >
      {isReading ? (
        <>
          <VolumeX className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-600">Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">Read Page</span>
        </>
      )}
    </button>
  );
};

export default PageSpeechButton;
