import React, { useState, useRef } from 'react';
import { Download, FileDown, FileArchive, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useAppContext } from '../context/AppContext';

const ExportManager: React.FC = () => {
  const { data, templateImage, fields, isSingleMode, singleData, photosMap } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  const dataset = isSingleMode ? [singleData] : data;

  if (!templateImage || dataset.length === 0 || fields.length === 0) {
    return null;
  }

  const generateCanvasForRow = async (rowData: any): Promise<HTMLCanvasElement | null> => {
    if (!hiddenContainerRef.current) return null;

    fields.forEach((field) => {
      const el = document.getElementById(`export-field-${field.id}`);
      if (el) {
        const rawVal = rowData[field.headerKey];
        const val = field.type === 'image' && rawVal && photosMap[String(rawVal)] ? photosMap[String(rawVal)] : rawVal;

        if (field.type === 'image' && val) {
          el.innerHTML = `<img src="${val}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />`;
        } else {
          el.innerText = val !== undefined && val !== null ? String(val) : '';
        }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    const canvas = await html2canvas(hiddenContainerRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null,
    });

    return canvas;
  };

  const exportAsSingleImage = async () => {
    setIsExporting(true);
    setProgress(50);
    try {
      const canvas = await generateCanvasForRow(dataset[0]);
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) saveAs(blob, 'id_card.jpg');
        }, 'image/jpeg', 0.95);
      }
    } catch (e) {
      console.error(e);
      alert('Error generating image');
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    setProgress(0);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      for (let i = 0; i < dataset.length; i++) {
        const canvas = await generateCanvasForRow(dataset[i]);
        if (!canvas) continue;

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        setProgress(Math.round(((i + 1) / dataset.length) * 100));
      }
      pdf.save('id_cards.pdf');
    } catch (error) {
      console.error(error);
      alert('Error generating PDF');
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  const exportAsZip = async () => {
    setIsExporting(true);
    setProgress(0);
    try {
      const zip = new JSZip();
      for (let i = 0; i < dataset.length; i++) {
        const canvas = await generateCanvasForRow(dataset[i]);
        if (!canvas) continue;
        const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.95));
        const firstFieldVal = fields[0] ? dataset[i][fields[0].headerKey] : null;
        const fileName = firstFieldVal ? `${firstFieldVal}_${i + 1}.jpg` : `card_${i + 1}.jpg`;
        const safeFileName = fileName.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
        zip.file(safeFileName, blob);
        setProgress(Math.round(((i + 1) / dataset.length) * 100));
      }
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'id_cards.zip');
    } catch (error) {
      console.error(error);
      alert('Error generating ZIP');
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
        <Download className="w-5 h-5 text-indigo-500" />
        Export Cards
      </h2>

      {isExporting ? (
        <div className="flex flex-col items-center justify-center p-8 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-indigo-800 font-medium animate-pulse">Generating {progress}% complete...</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          {isSingleMode ? (
            <>
              <button
                onClick={exportAsSingleImage}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Image className="w-5 h-5" />
                Download Image (JPG)
              </button>
              <button
                onClick={exportAsPDF}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-3 px-4 rounded-xl font-medium transition-all"
              >
                <FileDown className="w-5 h-5" />
                Download PDF
              </button>
            </>
          ) : (
            <>
              <button
                onClick={exportAsZip}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <FileArchive className="w-5 h-5" />
                Download ZIP (Images)
              </button>
              
              <button
                onClick={exportAsPDF}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-3 px-4 rounded-xl font-medium transition-all"
              >
                <FileDown className="w-5 h-5" />
                Download PDF
              </button>
            </>
          )}
        </div>
      )}

      {/* Hidden Container */}
      <div className="overflow-hidden h-0 w-0 absolute top-[-9999px] left-[-9999px]">
        <div ref={hiddenContainerRef} className="relative bg-white" style={{ width: '800px' }}>
          <img src={templateImage} alt="Template" className="w-full h-auto block" />
          {fields.map((field) => {
            const isImage = field.type === 'image';
            return (
              <div
                key={field.id}
                id={`export-field-${field.id}`}
                style={{
                  position: 'absolute',
                  left: `${field.x * 2}px`, 
                  top: `${field.y * 2}px`,
                  ...(isImage ? {
                    width: `${(field.width || 100) * 2}px`,
                    height: `${(field.height || 100) * 2}px`,
                  } : {
                    fontSize: `${field.fontSize * 2}px`,
                    color: field.color,
                    fontWeight: field.fontWeight,
                    whiteSpace: 'nowrap',
                  })
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExportManager;
