
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";
import { ScanBarcode } from "lucide-react";

const BarcodeScanner = () => {
  const navigate = useNavigate();
  const [manualInput, setManualInput] = useState("");
  
  const extractPatientIdFromUrl = (url: string) => {
    try {
      // Extract the patient ID from the URL
      // Example URL: http://example.com/ps/P123456
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1]; // Get the last part of the path
    } catch (error) {
      console.error("Invalid URL format", error);
      return null;
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a patient ID or scan URL",
        variant: "destructive",
      });
      return;
    }

    // Check if it's a URL
    if (manualInput.startsWith("http")) {
      const patientId = extractPatientIdFromUrl(manualInput);
      if (patientId) {
        navigate(`/patient/${patientId}`);
      } else {
        toast({
          title: "Error",
          description: "Invalid patient URL format",
          variant: "destructive",
        });
      }
    } else {
      // Assume it's a direct patient ID
      navigate(`/patient/${manualInput}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-medical-800 mb-6 text-center">Scan Patient Barcode</h1>
          
          <Card className="mb-6">
            <CardHeader className="bg-medical-500 text-white text-center">
              <CardTitle className="flex justify-center items-center">
                <ScanBarcode className="h-6 w-6 mr-2" />
                Scan Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="mb-4">
                  To scan a patient barcode, use your device's camera app to scan the barcode.
                  The barcode contains a URL that will open this app and show the patient's information.
                </p>
                <p className="text-sm text-gray-500">
                  Note: Most modern smartphones can scan QR codes and barcodes directly from the camera app.
                </p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-center mb-4">Don't have a scanner?</h3>
                <form onSubmit={handleManualSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="manualInput">Enter Patient ID or URL manually</Label>
                    <Input
                      id="manualInput"
                      placeholder="Patient ID or scanned URL"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full mt-4 bg-medical-500 hover:bg-medical-600"
                  >
                    Look Up Patient
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BarcodeScanner;
