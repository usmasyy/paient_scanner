
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Search } from "lucide-react";
import { Patient, exportToExcel } from "@/lib/patientUtils";
import { toast } from "@/components/ui/use-toast";

interface PatientSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredPatients: Patient[];
}

const PatientSearch = ({ searchTerm, setSearchTerm, filteredPatients }: PatientSearchProps) => {
  const handleExportToExcel = () => {
    if (filteredPatients.length === 0) {
      toast({
        title: "No patients to export",
        description: "Please register some patients first.",
        variant: "destructive",
      });
      return;
    }
    
    exportToExcel(filteredPatients);
    toast({
      title: "Export successful",
      description: "Patient records have been exported to Excel.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search by patient name or ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
        />
      </div>
      <Button 
        onClick={handleExportToExcel}
        className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 flex items-center gap-2"
      >
        <FileDown size={18} />
        Export to Excel
      </Button>
    </div>
  );
};

export default PatientSearch;
