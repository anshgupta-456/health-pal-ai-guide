import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Prescriptions from "./pages/Prescriptions";
import Exercises from "./pages/Exercises";
import LabTests from "./pages/LabTests";
import Reminders from "./pages/Reminders";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import NavigationVoiceAssistant from "@/components/NavigationVoiceAssistant"; // NEW

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Navigation Voice Assistant sits above the Router on protected paths */}
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="*"
              element={
                <>
                  {/* Only show assistant inside authenticated/protected area */}
                  <ProtectedRoute>
                    <NavigationVoiceAssistant />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/prescriptions" element={<Prescriptions />} />
                      <Route path="/exercises" element={<Exercises />} />
                      <Route path="/lab-tests" element={<LabTests />} />
                      <Route path="/reminders" element={<Reminders />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedRoute>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
