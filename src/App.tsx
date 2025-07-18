import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import { TrainingDataPage } from "./pages/TrainingDataPage";
import { PerformancePage } from "./pages/PerformancePage";
import { CoachDashboard } from "./pages/CoachDashboard";
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <ThemeProvider defaultTheme="system" storageKey="ayger-ui-theme"> */}
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<PerformancePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/athlete/training-data" element={<TrainingDataPage />} />
            <Route path="/athlete/performance" element={<PerformancePage />} />
            {/* <Route path="/athlete/upload" element={<UploadPage />} /> */}
            <Route path="/coach/dashboard" element={<CoachDashboard />} />
            {/* <Route path="/coach/athletes" element={<MyAthletesPage />} /> */}
            {/* <Route path="/coach/planning" element={<TrainingPlansPage />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  {/* </ThemeProvider> */}
  </QueryClientProvider>
);

export default App;
