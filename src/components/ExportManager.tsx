import React, { useState, useRef } from 'react';
import { Download, FileDown, FileArchive, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useAppContext } from '../context/AppContext';
import ShapeRenderer from './ShapeRenderer';
const ExportManager: React.FC = () => {
  const { currentProject } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  if (!currentProject) return null;

  const { data, templateImage, fields, isSingleMode, singleData, photosMap, width, height, backgroundType = 'image', backgroundColor = '#ffffff', backgroundGradient = { colors: ['#ffffff', '#f3f4f6'], direction: 'to right' } } = currentProject;

  const dataset = isSingleMode ? [singleData] : data;

  if (dataset.length === 0 || fields.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center p-4">
        Add fields and data to enable export.
      </div>
    );
  }

  const generateCanvasForRow = async (rowData: any): Promise<HTMLCanvasElement | null> => {
    if (!hiddenContainerRef.current) return null;

    fields.forEach((field) => {
      const el = document.getElementById(`export-field-${field.id}`);
      if (el) {
        const rawVal = rowData[field.headerKey];
        let val: any = rawVal;
        if (field.type === 'image') {
          if (field.isStatic) {
            val = field.staticImage;
          } else if (isSingleMode) {
            val = singleData[field.headerKey];
          } else {
            const idNumber = rowData['id_number'];
            if (idNumber && photosMap[field.headerKey]?.[String(idNumber)]) {
              val = photosMap[field.headerKey][String(idNumber)];
            }
          }
        }

        if (field.type === 'image' && val) {
          el.innerHTML = `<img src="${val}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />`;
        } else if (field.type === 'drawing' && field.staticImage) {
          el.innerHTML = `<img src="${field.staticImage}" style="width: 100%; height: 100%; object-fit: fill; opacity: ${field.opacity ?? 1};" crossorigin="anonymous" />`;
        } else if (field.type === 'text') {
          let txt = field.isStatic ? (field.staticText || '') : (val !== undefined && val !== null ? String(val) : '');
          if (field.textTransform === 'sentence' && txt) {
            txt = txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
          }
          el.innerText = txt;
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

  const exportAsSingleImage = async (format: 'jpeg' | 'png') => {
    setIsExporting(true);
    setProgress(50);
    try {
      const canvas = await generateCanvasForRow(dataset[0]);
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) saveAs(blob, `id_card.${format}`);
        }, `image/${format}`, 0.95);
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
      const orientation = width > height ? 'landscape' : 'portrait';
      const pdf = new jsPDF({ 
        orientation, 
        unit: 'px', 
        format: [width, height] 
      });

      for (let i = 0; i < dataset.length; i++) {
        const canvas = await generateCanvasForRow(dataset[i]);
        if (!canvas) continue;

        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        if (i > 0) pdf.addPage([width, height], orientation);
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
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
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => exportAsSingleImage('jpeg')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all shadow-md"
              >
                <Image className="w-4 h-4" />
                Download JPG
              </button>
              <button
                onClick={() => exportAsSingleImage('png')}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all shadow-md"
              >
                <Image className="w-4 h-4" />
                Download PNG
              </button>
              <button
                onClick={exportAsPDF}
                className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 py-2.5 px-4 rounded-xl font-medium transition-all"
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </button>
            </div>
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
        <div 
          ref={hiddenContainerRef} 
          className="relative" 
          style={{ 
            width: `${width * 2}px`, 
            height: `${height * 2}px`,
            backgroundColor: backgroundType === 'color' ? backgroundColor : (backgroundType === 'transparent' ? 'transparent' : '#ffffff'),
            backgroundImage: backgroundType === 'gradient' ? `linear-gradient(${backgroundGradient.direction}, ${backgroundGradient.colors.join(', ')})` : 'none'
          }}
        >
          {backgroundType === 'image' && templateImage && <img src={templateImage} alt="Template" className="w-full h-full object-cover block absolute inset-0" crossOrigin="anonymous" />}
          {fields.map((field) => {
            if (field.type === 'shape') {
              return (
                <div
                  key={field.id}
                  id={`export-field-${field.id}`}
                  style={{
                    position: 'absolute',
                    left: `${field.x * 2}px`, 
                    top: `${field.y * 2}px`,
                    width: `${(field.width || 100) * 2}px`,
                    height: `${(field.height || 100) * 2}px`,
                  }}
                >
                  <ShapeRenderer field={field} scale={2} />
                </div>
              );
            }

            const isSizable = field.type === 'image' || field.type === 'drawing';
            return (
              <div
                key={field.id}
                id={`export-field-${field.id}`}
                style={{
                  position: 'absolute',
                  left: `${field.x * 2}px`, 
                  top: `${field.y * 2}px`,
                  ...(isSizable ? {
                    width: `${(field.width || 100) * 2}px`,
                    height: `${(field.height || 100) * 2}px`,
                  } : {
                    fontFamily: field.fontFamily || 'sans-serif',
                    fontSize: `${field.fontSize * 2}px`,
                    color: field.color,
                    fontWeight: field.fontWeight,
                    fontStyle: field.fontStyle || 'normal',
                    textDecoration: field.textDecoration || 'none',
                    textAlign: field.textAlign || 'left',
                    textTransform: field.textTransform === 'sentence' ? 'none' : (field.textTransform || 'none') as any,
                    whiteSpace: 'pre-wrap',
                    width: '100%',
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
