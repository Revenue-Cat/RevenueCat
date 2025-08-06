import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Welcome from "./pages/Welcome";
import Setup from "./pages/Setup";
import BuddySelection from "./pages/BuddySelection";
import LocationPermission from "./pages/LocationPermission";
import Home from "./pages/Home";
import CravingSOS from "./pages/CravingSOS";
import BreathingExercise from "./pages/BreathingExercise";
import ChatAssistance from "./pages/ChatAssistance";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/buddy-selection" element={<BuddySelection />} />
            <Route path="/location-permission" element={<LocationPermission />} />
            <Route path="/home" element={<Home />} />
            <Route path="/craving-sos" element={<CravingSOS onClose={() => {}} />} />
            <Route path="/breathing-exercise" element={<BreathingExercise onClose={() => {}} onBack={() => {}} />} />
            <Route path="/chat-assistance" element={<ChatAssistance onClose={() => {}} onBack={() => {}} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/shop" element={<Shop />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
