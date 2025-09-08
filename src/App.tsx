import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";

import { LandingPage } from "./pages/LandingPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { BlogPage } from "./pages/BlogPage";
import { PerformancePage } from "./pages/PerformancePage";
import { UploadPage } from "./pages/UploadPage";
import { CoachDashboard } from "./pages/CoachDashboard";
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";

const queryClient = new QueryClient();

const App = () => {
  console.log('App: Component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider defaultTheme="system" storageKey="ayger-ui-theme"> */}
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />

              <Route path="/athlete/performance" element={<PerformancePage />} />
              <Route path="/athlete/upload" element={<UploadPage />} />
              <Route path="/coach/dashboard" element={<CoachDashboard />} />
              {/* <Route path="/coach/athletes" element={<MyAthletesPage />} /> */}
              {/* <Route path="/coach/planning" element={<TrainingPlansPage />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </AuthProvider>
    {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
};

export default App;
