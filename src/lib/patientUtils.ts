import ExcelJS from 'exceljs';
import JsBarcode from 'jsbarcode';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  contact: string;
  address: string;
  medicalHistory: string;
  registerDate: string;
}

// Generate a shorter unique patient ID (6 digits)
export const generatePatientId = (): string => {
  const randomNum = Math.floor(Math.random() * 1000000);
  return `P${randomNum.toString().padStart(6, '0')}`;
};

// Get patients from local storage
export const getPatients = (): Patient[] => {
  const patientsJSON = localStorage.getItem('patients');
  return patientsJSON ? JSON.parse(patientsJSON) : [];
};

// Save patients to local storage
export const savePatients = (patients: Patient[]): void => {
  localStorage.setItem('patients', JSON.stringify(patients));
};

// Add a new patient
export const addPatient = (patient: Omit<Patient, 'id' | 'registerDate'>): Patient => {
  const newPatient: Patient = {
    ...patient,
    id: generatePatientId(),
    registerDate: new Date().toISOString(),
  };
  
  const patients = getPatients();
  patients.push(newPatient);
  savePatients(patients);
  
  return newPatient;
};

// Get a patient by ID
export const getPatientById = (id: string): Patient | undefined => {
  const patients = getPatients();
  return patients.find((patient) => patient.id === id);
};

// Generate barcode as canvas for Excel export
const generateBarcodeCanvas = (patientId: string): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, patientId, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 40,
    displayValue: false,
    fontSize: 12,
    font: "monospace",
  });
  return canvas;
};

// Convert canvas to base64 image data (remove data URI prefix)
const canvasToBase64 = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/png').split(',')[1]; // Keep only the base64 part
};

// Export patients to Excel with actual barcode images using exceljs
export const exportToExcel = (patients: Patient[]): void => {
  const workbook = new ExcelJS.Workbook();

  // --- Create the main worksheet ('Patients') ---
  const worksheet = workbook.addWorksheet('Patients');

  // Define columns with keys and widths
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Age', key: 'age', width: 8 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Blood Type', key: 'bloodType', width: 10 },
    { header: 'Contact', key: 'contact', width: 15 },
    { header: 'Address', key: 'address', width: 25 },
    { header: 'Medical History', key: 'medicalHistory', width: 30 },
    { header: 'Registration Date', key: 'registrationDate', width: 20 },
    { header: 'Barcode', key: 'barcode', width: 30 } // Column for barcode image anchor
  ];

  // Prepare data for the main sheet (without barcodes initially)
  const mainSheetData = patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    bloodType: patient.bloodType,
    contact: patient.contact,
    address: patient.address,
    medicalHistory: patient.medicalHistory,
    registrationDate: new Date(patient.registerDate).toLocaleDateString(),
    barcode: '' // Placeholder, actual image added below
  }));

  // Add rows to the worksheet
  worksheet.addRows(mainSheetData);

  // Add barcode images to the main worksheet
  patients.forEach((patient, idx) => {
    const barcodeCanvas = generateBarcodeCanvas(patient.id);
    const barcodeBase64 = canvasToBase64(barcodeCanvas);
    const imageId = workbook.addImage({
      base64: barcodeBase64,
      extension: 'png',
    });

    // Add image to the worksheet. Row index is 1-based (header is 1), data starts at 2.
    // Col index is 0-based. 'barcode' column is the 10th column (index 9).
    // tl = top-left corner (0-based col/row), ext = extent/size (pixels)
    worksheet.addImage(imageId, {
      tl: { col: 9, row: idx + 1 }, // Place top-left in Col J, row for this patient (idx+1 because rows are 1-based after header)
      ext: { width: 150, height: 45 } // Define image size in pixels (adjust as needed)
    });
    // Adjust row height (1-based index) to fit barcode
    worksheet.getRow(idx + 2).height = 45; // Match image height + some padding if needed
  });

  // --- Create a separate 'Barcodes' sheet ---
  const barcodesSheet = workbook.addWorksheet('Barcodes');

  // Define columns for the barcodes sheet
  barcodesSheet.columns = [
    { header: 'Patient ID', key: 'id', width: 10 },
    { header: 'Patient Name', key: 'name', width: 20 },
    { header: 'Barcode', key: 'barcode', width: 30 }
  ];

  // Prepare data for the barcode sheet
  const barcodesSheetData = patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    barcode: '' // Placeholder
  }));

  // Add rows to the barcodes sheet
  barcodesSheet.addRows(barcodesSheetData);

  // Add barcode images to the barcode sheet
  patients.forEach((patient, idx) => {
    const barcodeCanvas = generateBarcodeCanvas(patient.id); // Regenerate or reuse if optimized
    const barcodeBase64 = canvasToBase64(barcodeCanvas);
    const imageId = workbook.addImage({ // Images are added once to the workbook
      base64: barcodeBase64,
      extension: 'png',
    });

    // Add image to the barcodes sheet. Barcode column is 3rd (index 2).
    // tl = top-left corner (0-based col/row), ext = extent/size (pixels)
    barcodesSheet.addImage(imageId, {
      tl: { col: 2, row: idx + 1 }, // Place top-left in Col C, row for this patient
      ext: { width: 150, height: 45 } // Define image size in pixels
    });
     // Adjust row height (1-based index)
    barcodesSheet.getRow(idx + 2).height = 45; // Match image height + some padding
  });

  // --- Write the workbook and trigger download ---
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Patient_Records.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the link element
    URL.revokeObjectURL(link.href); // Free up memory
    console.log('Excel file exported with barcode images using exceljs');
  }).catch(error => {
    console.error('Error exporting Excel file with exceljs:', error);
  });
};

// Get patient link to be encoded in barcode (original longer version)
export const getPatientLink = (patientId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/patient/${patientId}`;
};

// Get shortened patient link to be encoded in barcode
export const getShortenedPatientLink = (patientId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/ps/${patientId}`;
};
