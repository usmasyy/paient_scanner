
import { useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

interface BarcodeGeneratorProps {
  patientId: string;
  patientName: string;
}

const BarcodeGenerator = ({ patientId, patientName }: BarcodeGeneratorProps) => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      // Use just the patient ID in the barcode to make it shorter
      JsBarcode(barcodeRef.current, patientId, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: true,
        fontSize: 12,
        font: "monospace",
      });
    }
  }, [patientId]);

  // Fix: Using the correct prop name 'contentRef' instead of 'content'
  const handlePrint = useReactToPrint({
    documentTitle: `Patient-${patientId}`,
    // The useReactToPrint API expects a ref to the element to print
    contentRef: printRef,
  });

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-violet-700">Patient Barcode</h3>
      <div
        ref={printRef}
        className="p-4 border rounded-lg bg-white text-center shadow-md"
      >
        <div className="mb-3">
          <div className="font-semibold text-lg text-violet-800">{patientName}</div>
          <div className="text-sm text-gray-500">ID: {patientId}</div>
        </div>
        <div className="flex justify-center mb-3">
          <svg ref={barcodeRef} className="w-full max-w-xs"></svg>
        </div>
        <div className="text-xs text-gray-500">
          Scan this barcode to access patient records
        </div>
      </div>
      <div className="mt-4 flex gap-3 justify-center">
        <Button
          onClick={(event) => {
            event.preventDefault();
            handlePrint();
          }}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm transition-all"
        >
          Print Barcode
        </Button>
        <Button
          onClick={() => {
            // Create a download link for the SVG
            if (barcodeRef.current) {
              const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
              const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
              const svgUrl = URL.createObjectURL(svgBlob);
              const downloadLink = document.createElement("a");
              downloadLink.href = svgUrl;
              downloadLink.download = `patient-barcode-${patientId}.svg`;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          }}
          variant="outline"
          className="border-violet-500 text-violet-700 hover:bg-violet-50"
        >
          Save Barcode
        </Button>
      </div>
    </div>
  );
};

export default BarcodeGenerator;
