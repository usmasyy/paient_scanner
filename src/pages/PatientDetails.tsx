
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatientById, Patient } from "@/lib/patientUtils";
import Header from "@/components/Header";
import BarcodeGenerator from "@/components/BarcodeGenerator";
import { toast } from "@/components/ui/use-toast";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const patientData = getPatientById(id);
      if (patientData) {
        setPatient(patientData);
      } else {
        toast({
          title: "Error",
          description: "Patient not found",
          variant: "destructive",
        });
        navigate("/");
      }
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-xl">Loading patient data...</div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col justify-center items-center">
          <div className="text-xl mb-4">Patient not found</div>
          <Button onClick={() => navigate("/")} className="bg-violet-600 hover:bg-violet-700">
            Return to Home
          </Button>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-violet-800">Patient Details</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="bg-gradient-to-r from-violet-600 to-violet-500 text-white">
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient ID</p>
                    <p className="font-medium">{patient.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="font-medium">{formatDate(patient.registerDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{patient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Type</p>
                    <p className="font-medium">{patient.bloodType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium">{patient.contact || "Not provided"}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{patient.address || "Not provided"}</p>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500">Medical History</p>
                  <p className="font-medium whitespace-pre-line">{patient.medicalHistory || "No medical history recorded"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="bg-gradient-to-r from-violet-600 to-violet-500 text-white">
                <CardTitle>Patient Identification</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <BarcodeGenerator patientId={patient.id} patientName={patient.name} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDetails;
