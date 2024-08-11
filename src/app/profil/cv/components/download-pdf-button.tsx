'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function DownloadPDFButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    const cvElement = document.getElementById("cv-content");
    
    if (cvElement) {
      const canvas = await html2canvas(cvElement);
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("europass-cv.pdf");
    }
    
    setIsGenerating(false);
  };

  return (
    <Button onClick={generatePDF} disabled={isGenerating}>
      {isGenerating ? "Generating PDF..." : "Download CV as PDF"}
    </Button>
  );
}