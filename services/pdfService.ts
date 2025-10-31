
// This assumes jsPDF and html2canvas are loaded from a CDN in index.html
declare const jspdf: any;
declare const html2canvas: any;

export const exportReportAsPdf = async (elementId: string): Promise<void> => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }

  try {
    const { jsPDF } = jspdf;
    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true, 
    });

    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;

    let imgWidth = pdfWidth - 20; // with margin
    let imgHeight = imgWidth / ratio;
    
    // if image height is bigger than page, scale by height
    if (imgHeight > pdfHeight - 20) {
      imgHeight = pdfHeight - 20;
      imgWidth = imgHeight * ratio;
    }
    
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save('Informe_Actividades_UABC.pdf');
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
