
import { ReactNode } from "react";
import Navigation from "./Navigation";
import VoiceAssistant from "./VoiceAssistant";
import LanguageSelector from "./LanguageSelector";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="fixed top-4 right-4 z-40">
        <LanguageSelector />
      </div>
      <div className="pb-20">
        {children}
      </div>
      <Navigation />
      <VoiceAssistant />
    </div>
  );
};

export default Layout;
