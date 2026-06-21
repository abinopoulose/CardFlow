import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface FieldConfig {
  id: string;
  headerKey: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  type?: 'text' | 'image';
  width?: number;
  height?: number;
}

interface AppState {
  data: any[];
  headers: string[];
  templateImage: string | null;
  fields: FieldConfig[];
  isSingleMode: boolean;
  singleData: Record<string, any>;
  photosMap: Record<string, string>;
  setData: (data: any[]) => void;
  setHeaders: (headers: string[]) => void;
  setTemplateImage: (image: string | null) => void;
  setFields: (fields: FieldConfig[] | ((prev: FieldConfig[]) => FieldConfig[])) => void;
  setIsSingleMode: (val: boolean) => void;
  setSingleData: (data: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
  setPhotosMap: (map: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [isSingleMode, setIsSingleMode] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<Record<string, any>>({});
  const [photosMap, setPhotosMap] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('idcardgen_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.headers) setHeaders(parsed.headers);
        if (parsed.templateImage) setTemplateImage(parsed.templateImage);
        if (parsed.fields) setFields(parsed.fields);
        if (parsed.isSingleMode !== undefined) setIsSingleMode(parsed.isSingleMode);
        if (parsed.singleData) setSingleData(parsed.singleData);
        if (parsed.photosMap) setPhotosMap(parsed.photosMap);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      const stateToSave = {
        data,
        headers,
        templateImage,
        fields,
        isSingleMode,
        singleData,
        photosMap
      };
      localStorage.setItem('idcardgen_state', JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save to localStorage. Image might be too large.', e);
    }
  }, [data, headers, templateImage, fields, isSingleMode, singleData, photosMap]);

  return (
    <AppContext.Provider
      value={{
        data,
        headers,
        templateImage,
        fields,
        isSingleMode,
        singleData,
        photosMap,
        setData,
        setHeaders,
        setTemplateImage,
        setFields,
        setIsSingleMode,
        setSingleData,
        setPhotosMap,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
