
import { useState, useEffect } from "react";
import { getPatients, Patient } from "@/lib/patientUtils";
import Header from "@/components/Header";
import PageFooter from "@/components/PageFooter";
import GroupMembers from "@/components/GroupMembers";
import PatientSearch from "@/components/PatientSearch";
import PatientTable from "@/components/PatientTable";

const PatientRecords = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const loadPatients = () => {
      const patientData = getPatients();
      setPatients(patientData);
      setFilteredPatients(patientData);
    };
    
    loadPatients();
  }, []);

  useEffect(() => {
    const results = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-violet-800 mb-2">Patient Records</h1>
          <p className="text-gray-600">Search, view and manage patient records</p>
        </div>
        
        <GroupMembers />

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <PatientSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredPatients={filteredPatients}
          />

          <PatientTable filteredPatients={filteredPatients} />
        </div>
      </main>
      <PageFooter />
    </div>
  );
};

export default PatientRecords;
