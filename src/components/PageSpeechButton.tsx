
import { Volume2, Loader2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, RefObject } from 'react';

interface PageSpeechButtonProps {
  contentRef: RefObject<HTMLDivElement>;
}

const PageSpeechButton = ({ contentRef }: PageSpeechButtonProps) => {
  const [isReading, setIsReading] = useState(false);

  // Add safety check for language context
  let languageContext;
  try {
    languageContext = useLanguage();
  } catch (error) {
    // If LanguageProvider is not available, don't render the component
    return null;
  }

  const { speak, isSupported, currentLanguage } = languageContext;

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
          
          // Skip navigation and button elements for cleaner reading
          if (parent.tagName === 'NAV' || parent.tagName === 'BUTTON') {
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

    return textNodes.join(' ').replace(/\s+/g, ' ').trim();
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
      const pageText = extractTextContent(contentRef.current);
      
      if (!pageText) {
        console.warn('No readable content found on page');
        setIsReading(false);
        return;
      }

      console.log('Reading page content:', pageText.substring(0, 100) + '...');
      
      // Add a small introduction
      const introText = currentLanguage.code === 'en' 
        ? 'Reading page content: ' 
        : 'पृष्ठ सामग्री पढ़ी जा रही है: ';
      
      await speak(introText + pageText);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
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
