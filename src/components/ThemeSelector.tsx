import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { useAppContext, type FieldConfig } from '../context/AppContext';

const PREBUILT_THEMES = [
  {
    name: 'Corporate Card',
    bg: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=400&h=600',
    fields: [
      { id: 't0', headerKey: 'Photo', x: 140, y: 30, fontSize: 16, color: '#000000', fontWeight: 'normal', type: 'image', width: 100, height: 100 },
      { id: 't1', headerKey: 'Name', x: 120, y: 150, fontSize: 24, color: '#ffffff', fontWeight: 'bold', type: 'text' },
      { id: 't2', headerKey: 'Role', x: 120, y: 190, fontSize: 16, color: '#e2e8f0', fontWeight: 'normal', type: 'text' },
      { id: 't3', headerKey: 'ID', x: 120, y: 230, fontSize: 14, color: '#cbd5e1', fontWeight: 'normal', type: 'text' }
    ]
  },
  {
    name: 'School ID',
    bg: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=400&h=600',
    fields: [
      { id: 't4', headerKey: 'StudentName', x: 100, y: 300, fontSize: 20, color: '#1e293b', fontWeight: 'bold' },
      { id: 't5', headerKey: 'Grade', x: 100, y: 340, fontSize: 16, color: '#475569', fontWeight: 'normal' },
      { id: 't6', headerKey: 'BloodGroup', x: 100, y: 380, fontSize: 16, color: '#ef4444', fontWeight: 'bold' }
    ]
  },
  {
    name: 'Event Pass',
    bg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=600',
    fields: [
      { id: 't7', headerKey: 'Attendee', x: 50, y: 400, fontSize: 28, color: '#ffffff', fontWeight: '900' },
      { id: 't8', headerKey: 'TicketType', x: 50, y: 440, fontSize: 18, color: '#fcd34d', fontWeight: 'bold' }
    ]
  }
];

const ThemeSelector: React.FC = () => {
  const { setTemplateImage, setFields, setHeaders, headers } = useAppContext();

  const applyTheme = (theme: typeof PREBUILT_THEMES[0]) => {
    setTemplateImage(theme.bg);
    setFields(theme.fields as FieldConfig[]);
    
    // Automatically add these to headers if not present, so manual entry works
    const newHeaders = new Set(headers);
    theme.fields.forEach(f => newHeaders.add(f.headerKey));
    setHeaders(Array.from(newHeaders));
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
        <LayoutTemplate className="w-5 h-5 text-indigo-500" />
        Quick Start: Prebuilt Themes
      </h2>
      
      <div className="grid grid-cols-3 gap-4">
        {PREBUILT_THEMES.map((theme) => (
          <button
            key={theme.name}
            onClick={() => applyTheme(theme)}
            className="flex flex-col items-center gap-2 p-2 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
          >
            <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
              <img src={theme.bg} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <span className="text-xs font-semibold text-gray-700">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
