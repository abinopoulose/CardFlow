import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud, FileText, User, Image as ImageIcon, ImagePlus, Type, Database, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CropModal from './CropModal';

const DataUploader: React.FC = () => {
  const { currentProject, updateCurrentProject } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [newHeader, setNewHeader] = useState('');
  
  const [cropTarget, setCropTarget] = useState<{ src: string; key: string } | null>(null);

  if (!currentProject) return null;

  const { data, headers, fields, isSingleMode, singleData, photosMap } = currentProject;

  const setData = (newData: any[]) => updateCurrentProject({ data: newData });
  const setHeaders = (newHeaders: string[]) => updateCurrentProject({ headers: newHeaders });
  const setIsSingleMode = (val: boolean) => updateCurrentProject({ isSingleMode: val });
  const setSingleData = (fn: (prev: Record<string, any>) => Record<string, any>) => updateCurrentProject({ singleData: fn(singleData) });
  const setPhotosMap = (fn: (prev: Record<string, Record<string, string>>) => Record<string, Record<string, string>>) => updateCurrentProject({ photosMap: fn(photosMap) });
  const setFields = (fn: (prev: any[]) => any[]) => updateCurrentProject({ fields: fn(fields) });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;

      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      
      if (jsonData.length > 0) {
        const headersList = Object.keys(jsonData[0] as object);
        
        // Find id_number column (case-insensitive)
        const idCol = headersList.find(h => h.trim().toLowerCase() === 'id_number');
        
        if (!idCol) {
          alert("Validation Error: The uploaded file must contain a column named 'id_number' to uniquely identify each row.");
          return;
        }

        const ids = new Set();
        for (let row of jsonData as any[]) {
          const idVal = String(row[idCol]).trim();
          if (!idVal) {
            alert("Validation Error: Found a row with an empty 'id_number'.");
            return;
          }
          if (ids.has(idVal)) {
            alert(`Validation Error: Duplicate 'id_number' found: ${idVal}`);
            return;
          }
          ids.add(idVal);
        }

        // Remap to exactly 'id_number' if casing was different
        const normalizedData = jsonData.map((row: any) => {
          const newRow = { ...row };
          if (idCol !== 'id_number') {
            newRow['id_number'] = row[idCol];
            delete newRow[idCol];
          }
          return newRow;
        });

        setData(normalizedData);
        const newHeadersList = Object.keys(normalizedData[0] as object);
        setHeaders(Array.from(new Set([...headers, ...newHeadersList])));
      } else {
        alert('The uploaded file is empty.');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBulkPhotos = (headerKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setPhotosMap(prev => ({ ...prev, [headerKey]: {} }));
      return;
    }

    let processed = 0;
    const newMap: Record<string, string> = {};

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = evt.target?.result;
        if (typeof res === 'string') {
          // Extract basename as id_number (e.g. "E123.jpg" -> "E123")
          const basename = file.name.split('.').slice(0, -1).join('.');
          newMap[basename] = res;
        }
        processed++;
        if (processed === imageFiles.length) {
          setPhotosMap(prev => ({ ...prev, [headerKey]: newMap }));
        }
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const handleManualEntry = (key: string, value: string) => {
    setSingleData(prev => ({ ...prev, [key]: value }));
  };

  const handlePhotoUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') {
        setCropTarget({ src: result, key });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; 
  };

  const handleCropComplete = (croppedBase64: string) => {
    if (cropTarget) {
      handleManualEntry(cropTarget.key, croppedBase64);
      setCropTarget(null);
    }
  };

  const handleValidatePhotos = (headerKey: string) => {
    if (data.length === 0) {
      alert("Please upload the Excel file first to validate images against the data.");
      return;
    }
    const missing: string[] = [];
    const fieldPhotos = photosMap[headerKey] || {};
    data.forEach(row => {
      const id = String(row['id_number']).trim();
      if (!fieldPhotos[id]) {
        missing.push(id);
      }
    });

    if (missing.length > 0) {
      alert(`Validation Failed: Missing images for ${missing.length} records in '${headerKey}'.\nFor example, missing ID: ${missing.slice(0, 3).join(', ')}`);
    } else {
      alert(`Success! All ${data.length} images are correctly mapped for '${headerKey}'.`);
    }
  };

  const dynamicHeaders = Array.from(new Set([...headers, ...fields.filter(f => !f.isStatic).map(f => f.headerKey)]));
  const dynamicImageFields = fields.filter(f => f.type === 'image' && !f.isStatic);

  return (
    <div className="flex flex-col gap-6 h-full">
      {cropTarget && (
        <CropModal 
          imageSrc={cropTarget.src}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropTarget(null)}
        />
      )}
      
      {/* SECTION: PROVIDE DATA */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-1 overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-500" />
          Provide Data
        </h3>

        <div className="flex bg-gray-100/50 p-1 rounded-lg mb-4">
          <button 
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${!isSingleMode ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setIsSingleMode(false)}
          >
            Bulk Upload
          </button>
          <button 
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${isSingleMode ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setIsSingleMode(true)}
          >
            Single Manual
          </button>
        </div>
        
        {!isSingleMode ? (
          <div className="flex flex-col gap-3">
            <div 
              className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700">Upload Excel/CSV</p>
              <p className="text-[10px] text-indigo-500 text-center mt-1">Must contain a unique <code className="bg-indigo-100 px-1 rounded font-bold">id_number</code> column.</p>
              <input 
                type="file" 
                accept=".xlsx, .csv" 
                className="hidden" 
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </div>

            {dynamicImageFields.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-gray-600">Dynamic Image Folders</h4>
                {dynamicImageFields.map(field => {
                  const mappedCount = photosMap[field.headerKey] ? Object.keys(photosMap[field.headerKey]).length : 0;
                  return (
                    <div key={field.id} className="relative border border-emerald-200 bg-emerald-50/30 rounded-xl p-3 flex flex-col justify-center overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-emerald-700">{field.headerKey}</span>
                        {mappedCount > 0 && (
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{mappedCount} images</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-600 py-1.5 rounded-md transition-colors text-xs font-bold">
                          <ImagePlus className="w-4 h-4" />
                          {mappedCount > 0 ? 'Change Folder' : 'Select Folder'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            // @ts-ignore
                            webkitdirectory="" 
                            directory=""
                            multiple
                            className="hidden" 
                            onChange={(e) => handleBulkPhotos(field.headerKey, e)}
                          />
                        </label>
                        <button
                          onClick={() => handleValidatePhotos(field.headerKey)}
                          className="px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-colors"
                        >
                          Validate
                        </button>
                      </div>
                      <p className="text-[10px] text-emerald-600/80 text-center mt-2 leading-tight">
                        Images must be named like `[id_number].jpg`<br/>
                        <span className="opacity-75">(e.g. if id_number is E123, image must be E123.jpg)</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
              {data.length > 0 && (
                <div className="flex items-center justify-between bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg border border-indigo-100">
                  <span className="text-xs font-bold">Data: {data.length} rows</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-500 mb-2">Manually fill data for 1 card based on the fields defined above.</p>
            
            {dynamicHeaders.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-4 border border-dashed border-gray-200 rounded-xl">Define fields in step 1 to enter data here.</p>
            ) : (
              <div className="space-y-3">
                {dynamicHeaders.map(header => {
                  const isImage = fields.some(f => f.headerKey === header && f.type === 'image' && !f.isStatic);

                  return (
                    <div key={header}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{header}</label>
                      {isImage ? (
                        <div className="relative flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(header, e)}
                            className="w-full text-sm pl-9 p-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                          />
                          {singleData[header] && (
                            <img src={singleData[header]} alt="preview" className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0" />
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            value={singleData[header] || ''}
                            onChange={(e) => handleManualEntry(header, e.target.value)}
                            className="w-full text-sm pl-9 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white transition-all"
                            placeholder={`Enter ${header}...`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUploader;
