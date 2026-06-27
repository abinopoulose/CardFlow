import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface FieldConfig {
  id: string;
  headerKey: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  type?: 'text' | 'image' | 'shape' | 'qrcode' | 'barcode' | 'divider' | 'drawing';
  shapeType?: string;
  backgroundColor?: string;
  fillTransparent?: boolean;
  borderColor?: string;
  borderTransparent?: boolean;
  borderWidth?: number;
  borderRadius?: number;
  fontFamily?: string;
  fontStyle?: string;
  textDecoration?: string;
  textTransform?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  width?: number;
  height?: number;
  isStatic?: boolean;
  staticImage?: string;
  originalImage?: string;
  staticText?: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'wavy' | 'zigzag';
  gradient?: { colors: string[]; direction: string };
  opacity?: number;
  isHidden?: boolean;
}

export interface Project {
  id: string;
  name: string;
  updatedAt: number;
  width: number;
  height: number;
  data: any[];
  headers: string[];
  templateImage: string | null;
  previewImage?: string | null;
  originalTemplateImage?: string | null;
  backgroundType?: 'image' | 'color' | 'gradient' | 'transparent';
  backgroundColor?: string;
  backgroundGradient?: { colors: string[]; direction: string };
  fields: FieldConfig[];
  isSingleMode: boolean;
  singleData: Record<string, any>;
  photosMap: Record<string, Record<string, string>>;
}

interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  createProject: (project: Omit<Project, 'id' | 'updatedAt'>) => string;
  updateCurrentProject: (updates: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  deleteAllProjects: () => void;
  currentProject: Project | null;
  isDrawingMode: boolean;
  setIsDrawingMode: (val: boolean) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(
    localStorage.getItem('idcardgen_current_project')
  );
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [past, setPast] = useState<Project[]>([]);
  const [future, setFuture] = useState<Project[]>([]);

  // Clear history on project change
  useEffect(() => {
    setPast([]);
    setFuture([]);
  }, [currentProjectId]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('idcardgen_projects');
      if (saved) {
        setProjects(JSON.parse(saved));
      } else {
        const oldState = localStorage.getItem('idcardgen_state');
        if (oldState) {
          const parsed = JSON.parse(oldState);
          const migratedProject: Project = {
            id: 'legacy-project',
            name: 'Legacy Project',
            updatedAt: Date.now(),
            width: 400,
            height: 600,
            data: parsed.data || [],
            headers: parsed.headers || [],
            templateImage: parsed.templateImage || null,
            originalTemplateImage: parsed.originalTemplateImage || null,
            backgroundType: parsed.backgroundType || 'image',
            backgroundColor: parsed.backgroundColor || '#ffffff',
            backgroundGradient: parsed.backgroundGradient || { colors: ['#ffffff', '#f3f4f6'], direction: 'to right' },
            fields: parsed.fields || [],
            isSingleMode: parsed.isSingleMode || false,
            singleData: parsed.singleData || {},
            photosMap: {} // Reset legacy photosMap due to schema change
          };
          setProjects([migratedProject]);
        }
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('idcardgen_projects', JSON.stringify(projects));
      } catch (e) {
        console.warn('Failed to save to localStorage. Storage quota exceeded.', e);
      }
    }
  }, [projects, isLoaded]);

  // Persist currentProjectId
  useEffect(() => {
    if (currentProjectId) {
      localStorage.setItem('idcardgen_current_project', currentProjectId);
    } else {
      localStorage.removeItem('idcardgen_current_project');
    }
  }, [currentProjectId]);

  const createProject = (config: Omit<Project, 'id' | 'updatedAt'>) => {
    const newProject: Project = {
      backgroundType: 'image',
      backgroundColor: '#ffffff',
      backgroundGradient: { colors: ['#ffffff', '#f3f4f6'], direction: 'to right' },
      ...config,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: Date.now(),
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    return newProject.id;
  };

  const updateCurrentProject = (updates: Partial<Project>) => {
    if (!currentProjectId) return;
    setProjects(prev => {
      const pIndex = prev.findIndex(p => p.id === currentProjectId);
      if (pIndex === -1) return prev;
      
      const currentP = prev[pIndex];
      setPast(oldPast => {
        const next = [...oldPast, currentP];
        if (next.length > 50) return next.slice(next.length - 50);
        return next;
      });
      setFuture([]);

      const updatedP = { ...currentP, ...updates, updatedAt: Date.now() };
      const newProjects = [...prev];
      newProjects[pIndex] = updatedP;
      return newProjects;
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => {
      const pIndex = prev.findIndex(p => p.id === id);
      if (pIndex === -1) return prev;
      
      const updatedP = { ...prev[pIndex], ...updates, updatedAt: Date.now() };
      const newProjects = [...prev];
      newProjects[pIndex] = updatedP;
      return newProjects;
    });
  };

  const undo = () => {
    if (!currentProjectId || past.length === 0) return;
    setProjects(prev => {
      const pIndex = prev.findIndex(p => p.id === currentProjectId);
      if (pIndex === -1) return prev;
      
      const currentP = prev[pIndex];
      const previousP = past[past.length - 1];
      
      setFuture(oldFuture => [currentP, ...oldFuture]);
      setPast(oldPast => oldPast.slice(0, -1));
      
      const newProjects = [...prev];
      newProjects[pIndex] = previousP;
      return newProjects;
    });
  };

  const redo = () => {
    if (!currentProjectId || future.length === 0) return;
    setProjects(prev => {
      const pIndex = prev.findIndex(p => p.id === currentProjectId);
      if (pIndex === -1) return prev;
      
      const currentP = prev[pIndex];
      const nextP = future[0];
      
      setPast(oldPast => [...oldPast, currentP]);
      setFuture(oldFuture => oldFuture.slice(1));
      
      const newProjects = [...prev];
      newProjects[pIndex] = nextP;
      return newProjects;
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProjectId === id) setCurrentProjectId(null);
  };

  const deleteAllProjects = () => {
    setProjects([]);
    setCurrentProjectId(null);
    localStorage.removeItem('idcardgen_projects');
    localStorage.removeItem('idcardgen_state');
  };

  let currentProject = projects.find(p => p.id === currentProjectId) || null;
  
  if (currentProject) {
    if (currentProject.backgroundGradient && !currentProject.backgroundGradient.colors) {
      const bgG = currentProject.backgroundGradient as any;
      currentProject = {
        ...currentProject,
        backgroundGradient: {
          colors: [bgG.color1 || '#ffffff', bgG.color2 || '#f3f4f6'],
          direction: bgG.direction || 'to right'
        }
      };
    }
  }

  return (
    <AppContext.Provider
      value={{
        projects,
        currentProjectId,
        setCurrentProjectId,
        createProject,
        updateCurrentProject,
        updateProject,
        deleteProject,
        deleteAllProjects,
        currentProject,
        isDrawingMode,
        setIsDrawingMode,
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
