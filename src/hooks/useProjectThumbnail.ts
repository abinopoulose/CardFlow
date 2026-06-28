import html2canvas from 'html2canvas';

export const useProjectThumbnail = (updateProject: (id: string, updates: any) => void, setCurrentProjectId: (id: string | null) => void) => {
  const saveThumbnailAndExit = (projectId: string | undefined) => {
    const el = document.getElementById('project-canvas-container');
    if (el && projectId) {
      html2canvas(el, { 
        scale: 0.5, 
        useCORS: true, 
        logging: false, 
        backgroundColor: null 
      }).then(canvas => {
        const previewImage = canvas.toDataURL('image/jpeg', 0.8);
        updateProject(projectId, { previewImage });
      }).catch(console.error);
    }
    setCurrentProjectId(null);
  };

  return { saveThumbnailAndExit };
};
