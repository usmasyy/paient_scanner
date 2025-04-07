
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RegisterPatient from "./pages/RegisterPatient";
import PatientDetails from "./pages/PatientDetails";
import PatientRecords from "./pages/PatientRecords";
import ScanBarcode from "./pages/ScanBarcode";
import NotFound from "./pages/NotFound";

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<RegisterPatient />} />
            <Route path="/patient/:id" element={<PatientDetails />} />
            <Route path="/ps/:id" element={<PatientDetails />} />
            <Route path="/records" element={<PatientRecords />} />
            <Route path="/scan" element={<ScanBarcode />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
