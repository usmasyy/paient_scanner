
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatients, exportToExcel, Patient } from "@/lib/patientUtils";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";
import { UserPlus, FileDown, Scan, FileText } from "lucide-react";

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const loadPatients = () => {
      const patientData = getPatients();
      setPatients(patientData);
    };
    
    loadPatients();
  }, []);

  const handleExportToExcel = () => {
    if (patients.length === 0) {
      toast({
        title: "No patients to export",
        description: "Please register some patients first.",
        variant: "destructive",
      });
      return;
    }
    
    exportToExcel(patients);
    toast({
      title: "Export successful",
      description: "Patient records have been exported to Excel.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-medical-800 mb-4">Patient Management System</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Register patients, generate barcodes, and scan to instantly access patient records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="transition-all hover:shadow-lg border-t-4 border-t-medical-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2 text-medical-700">
                <UserPlus size={24} />
                Register Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600">Add a new patient to the system and generate a unique barcode ID.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-medical-500 hover:bg-medical-600">
                <Link to="/register">Register Patient</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-lg border-t-4 border-t-medical-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2 text-medical-700">
                <Scan size={24} />
                Scan Barcode
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600">Scan a patient's barcode to quickly access their medical records.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-medical-500 hover:bg-medical-600">
                <Link to="/scan">Scan Barcode</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-lg border-t-4 border-t-medical-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2 text-medical-700">
                <FileText size={24} />
                View Records
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600">View, search and manage all patient records from a central location.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-medical-500 hover:bg-medical-600">
                <Link to="/records">View Records</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-lg border-t-4 border-t-medical-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2 text-medical-700">
                <FileDown size={24} />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600">Export all patient records to an Excel spreadsheet for offline use.</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-medical-500 hover:bg-medical-600"
                onClick={handleExportToExcel}
              >
                Export to Excel
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="bg-medical-600 text-white px-6 py-4 text-xl font-semibold flex items-center justify-between">
            <span>Recent Patient Records ({patients.length})</span>
            <Button asChild variant="outline" className="bg-white hover:bg-gray-100 text-medical-700 border-white">
              <Link to="/records">View All Records</Link>
            </Button>
          </h2>
          <div className="overflow-x-auto">
            {patients.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.slice(0, 5).map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/patient/${patient.id}`} className="text-medical-600 hover:text-medical-800">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No patients registered yet. Click on "Register Patient" to add your first patient.
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="bg-white border-t py-6 text-center text-gray-600">
        <p className="text-sm">© 2025 PatientLinkScan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
