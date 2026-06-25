import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface FieldConfig {
  id: string;
  headerKey: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  type?: 'text' | 'image' | 'shape';
  shapeType?: string;
  backgroundColor?: string;
  fillTransparent?: boolean;
  borderColor?: string;
  borderTransparent?: boolean;
  borderWidth?: number;
  borderRadius?: number;
  fontFamily?: string;
  width?: number;
  height?: number;
  isStatic?: boolean;
  staticImage?: string;
  staticText?: string;
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
  deleteProject: (id: string) => void;
  currentProject: Project | null;
  
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

  const currentProject = projects.find(p => p.id === currentProjectId) || null;

  return (
    <AppContext.Provider
      value={{
        projects,
        currentProjectId,
        setCurrentProjectId,
        createProject,
        updateCurrentProject,
        deleteProject,
        currentProject,
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
