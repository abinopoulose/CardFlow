import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud, FileText, User, Image as ImageIcon, ImagePlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DataUploader: React.FC = () => {
  const { setData, setHeaders, data, isSingleMode, setIsSingleMode, singleData, setSingleData, headers, fields, setFields, setPhotosMap, photosMap } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [newHeader, setNewHeader] = useState('');

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
        setData(jsonData);
        const headersList = Object.keys(jsonData[0] as object);
        setHeaders(Array.from(new Set([...headers, ...headersList])));
      } else {
        alert('The uploaded file is empty.');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBulkPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = evt.target?.result;
        if (typeof res === 'string') {
          setPhotosMap(prev => ({ ...prev, [file.name]: res }));
        }
      };
      reader.readAsDataURL(file);
    });
    if (photoInputRef.current) photoInputRef.current.value = '';
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
        handleManualEntry(key, result);
      }
    };
    reader.readAsDataURL(file);
  };

  const addCustomField = (type: 'text' | 'image') => {
    if (newHeader && !headers.includes(newHeader)) {
      setHeaders([...headers, newHeader]);
      setFields((prev) => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        headerKey: newHeader,
        x: 50, y: 50, fontSize: 16, color: '#000000', fontWeight: 'normal',
        type, width: type === 'image' ? 100 : undefined, height: type === 'image' ? 100 : undefined
      }]);
      setNewHeader('');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-500" />
        1. Data Source
      </h2>

      <div className="flex bg-gray-100/50 p-1 rounded-lg mb-6">
        <button 
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isSingleMode ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setIsSingleMode(false)}
        >
          Bulk Upload
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isSingleMode ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setIsSingleMode(true)}
        >
          Single Manual
        </button>
      </div>
      
      {!isSingleMode ? (
        <div className="flex flex-col gap-4">
          <div 
            className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors group"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-700 mb-1">1. Upload Excel/CSV</p>
            <input 
              type="file" 
              accept=".xlsx, .csv" 
              className="hidden" 
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
          </div>

          <div 
            className="border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors group"
            onClick={() => photoInputRef.current?.click()}
          >
            <ImagePlus className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-gray-700 mb-1">2. Upload Photos (Optional)</p>
            <p className="text-xs text-gray-500 text-center px-4">Select multiple images. Match filenames to Excel data.</p>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              className="hidden" 
              onChange={handleBulkPhotos}
              ref={photoInputRef}
            />
          </div>

          <div className="flex flex-col gap-2">
            {data.length > 0 && (
              <div className="flex items-center justify-between bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100">
                <span className="text-sm font-medium">Data: {data.length} records.</span>
              </div>
            )}
            {Object.keys(photosMap).length > 0 && (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100">
                <span className="text-sm font-medium">Photos: {Object.keys(photosMap).length} loaded.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-500">Fill details for 1 card.</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newHeader}
              onChange={e => setNewHeader(e.target.value)}
              placeholder="New field name"
              className="flex-1 text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-1/2"
            />
            <div className="flex gap-1 w-1/2">
              <button 
                onClick={() => addCustomField('text')}
                className="flex-1 px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              >
                + Text
              </button>
              <button 
                onClick={() => addCustomField('image')}
                className="flex-1 px-2 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg transition-colors"
              >
                + Image
              </button>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto pr-2 space-y-3 mt-2">
            {headers.map(header => {
              const isImage = fields.some(f => f.headerKey === header && f.type === 'image');

              return (
                <div key={header}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{header}</label>
                  {isImage ? (
                    <div className="relative flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(header, e)}
                        className="w-full text-sm pl-9 p-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {singleData[header] && (
                        <img src={singleData[header]} alt="preview" className="w-8 h-8 rounded object-cover border border-gray-200" />
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={singleData[header] || ''}
                        onChange={(e) => handleManualEntry(header, e.target.value)}
                        className="w-full text-sm pl-9 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white transition-all"
                        placeholder={`Enter ${header}`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {headers.length === 0 && (
              <p className="text-xs text-center text-gray-400 py-4">No fields yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUploader;
