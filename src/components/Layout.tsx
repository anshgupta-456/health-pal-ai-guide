
import { ReactNode, useRef } from "react";
import Navigation from "./Navigation";
import VoiceAssistant from "./VoiceAssistant";
import LanguageSelector from "./LanguageSelector";
import PageSpeechButton from "./PageSpeechButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
        <PageSpeechButton contentRef={contentRef} />
        <LanguageSelector />
      </div>
      <div className="pb-20" ref={contentRef}>
        {children}
      </div>
      <Navigation />
      <VoiceAssistant />
    </div>
  );
};

export default Layout;
