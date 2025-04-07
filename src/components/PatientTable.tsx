
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Patient } from "@/lib/patientUtils";
import { toast } from "@/components/ui/use-toast";
import { FileText, Download, Barcode } from "lucide-react";

interface PatientTableProps {
  filteredPatients: Patient[];
}

const PatientTable = ({ filteredPatients }: PatientTableProps) => {
  const savePatientRecord = (patient: Patient) => {
    // Create a text file with patient information
    const patientData = `
Patient ID: ${patient.id}
Name: ${patient.name}
Age: ${patient.age}
Gender: ${patient.gender}
Blood Type: ${patient.bloodType}
Contact: ${patient.contact}
Address: ${patient.address}
Medical History: ${patient.medicalHistory}
Registration Date: ${new Date(patient.registerDate).toLocaleString()}
    `.trim();
    
    const blob = new Blob([patientData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `patient-${patient.id}.txt`;
    link.href = url;
    link.click();
    
    toast({
      title: "Record saved",
      description: `Patient record for ${patient.name} has been saved.`,
    });
  };

  if (filteredPatients.length === 0) {
    return (
      <Card className="border border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 mb-4">
            No patients registered yet.
          </p>
          <Button asChild className="bg-violet-600 hover:bg-violet-700">
            <Link to="/register">Register Patient</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-violet-50">
            <TableHead className="font-semibold text-violet-800">ID</TableHead>
            <TableHead className="font-semibold text-violet-800">Name</TableHead>
            <TableHead className="font-semibold text-violet-800">Age</TableHead>
            <TableHead className="font-semibold text-violet-800">Gender</TableHead>
            <TableHead className="font-semibold text-violet-800">Blood Type</TableHead>
            <TableHead className="font-semibold text-violet-800">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-violet-50 transition-colors border-b">
              <TableCell className="font-medium text-gray-900">{patient.id}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.bloodType}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild className="text-violet-600 hover:text-violet-800 hover:bg-violet-50">
                    <Link to={`/patient/${patient.id}`}>
                      <FileText size={16} />
                      <span className="sr-only md:not-sr-only md:ml-2">View</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-violet-600 hover:text-violet-800 hover:bg-violet-50"
                    onClick={() => savePatientRecord(patient)}
                  >
                    <Download size={16} />
                    <span className="sr-only md:not-sr-only md:ml-2">Save</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="text-violet-600 hover:text-violet-800 hover:bg-violet-50"
                  >
                    <Link to={`/patient/${patient.id}`}>
                      <Barcode size={16} />
                      <span className="sr-only md:not-sr-only md:ml-2">Barcode</span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientTable;
