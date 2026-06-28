import { useState, useRef } from 'react';
import type { ReactSketchCanvasRef } from 'react-sketch-canvas';
import type { Project } from '../context/AppContext';

export const useDrawing = (
  currentProject: Project | null,
  updateCurrentProject: (update: Partial<Project>) => void,
  setIsDrawingMode: (isDrawing: boolean) => void
) => {
  const sprayCanvasRef = useRef<HTMLCanvasElement>(null);
  const sketchRef = useRef<ReactSketchCanvasRef>(null);
  const [drawingModeType, setDrawingModeType] = useState<'select' | 'pen' | 'eraser' | 'spray'>('pen');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [sprayDensity, setSprayDensity] = useState(25);

  const handleSaveDrawing = async (exitMode = true) => {
    if (sketchRef.current && currentProject) {
      try {
        const paths = await sketchRef.current.exportPaths();
        
        let sprayHasContent = false;
        if (sprayCanvasRef.current) {
          const ctx = sprayCanvasRef.current.getContext('2d');
          if (ctx) {
            const data = ctx.getImageData(0,0, sprayCanvasRef.current.width, sprayCanvasRef.current.height).data;
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] > 0) { sprayHasContent = true; break; }
            }
          }
        }

        if (paths.length > 0 || sprayHasContent) {
          const svgStr = await sketchRef.current.exportSvg();
          
          const targetWidth = currentProject.width * 4;
          const targetHeight = currentProject.height * 4;
          
          let modifiedSvgStr = svgStr;
          if (!modifiedSvgStr.includes('viewBox=')) {
            modifiedSvgStr = modifiedSvgStr.replace('<svg ', `<svg viewBox="0 0 ${currentProject.width} ${currentProject.height}" `);
          }
          if (modifiedSvgStr.includes('width=')) {
            modifiedSvgStr = modifiedSvgStr.replace(/width="[^"]+"/, `width="${targetWidth}"`);
          } else {
            modifiedSvgStr = modifiedSvgStr.replace('<svg ', `<svg width="${targetWidth}" `);
          }
          if (modifiedSvgStr.includes('height=')) {
            modifiedSvgStr = modifiedSvgStr.replace(/height="[^"]+"/, `height="${targetHeight}"`);
          } else {
            modifiedSvgStr = modifiedSvgStr.replace('<svg ', `<svg height="${targetHeight}" `);
          }

          const blob = new Blob([modifiedSvgStr], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;
          await new Promise((resolve) => { img.onload = resolve; });
          URL.revokeObjectURL(url);
          
          const scale = img.width / currentProject.width;
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            
            if (sprayCanvasRef.current && sprayHasContent) {
              ctx.drawImage(sprayCanvasRef.current, 0, 0, canvas.width, canvas.height);
            }
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                const idx = (y * canvas.width + x) * 4;
                const alpha = data[idx + 3];
                if (alpha > 0) {
                  data[idx] = 255;
                  data[idx + 1] = 255;
                  data[idx + 2] = 255;
                  
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                }
              }
            }
            ctx.putImageData(imageData, 0, 0);
            
            if (maxX >= minX && maxY >= minY) {
              const padding = 5 * scale;
              minX = Math.max(0, minX - padding);
              minY = Math.max(0, minY - padding);
              maxX = Math.min(canvas.width, maxX + padding);
              maxY = Math.min(canvas.height, maxY + padding);
              
              const cropWidth = maxX - minX;
              const cropHeight = maxY - minY;
              
              const cropCanvas = document.createElement('canvas');
              cropCanvas.width = cropWidth;
              cropCanvas.height = cropHeight;
              const cropCtx = cropCanvas.getContext('2d');
              
              if (cropCtx) {
                cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
                const whiteDataUrl = cropCanvas.toDataURL('image/png');
                
                cropCtx.globalCompositeOperation = 'source-in';
                cropCtx.fillStyle = strokeColor;
                cropCtx.fillRect(0, 0, cropWidth, cropHeight);
                const coloredDataUrl = cropCanvas.toDataURL('image/png');
                
                const newField = {
                  id: Math.random().toString(36).substr(2, 9),
                  headerKey: `Drawing_${Math.floor(Math.random()*1000)}`,
                  x: minX / scale,
                  y: minY / scale,
                  width: cropWidth / scale,
                  height: cropHeight / scale,
                  fontSize: 14,
                  color: strokeColor,
                  opacity: 1,
                  fontWeight: 'normal',
                  type: 'drawing',
                  isStatic: true,
                  originalImage: whiteDataUrl,
                  staticImage: coloredDataUrl
                };
                updateCurrentProject({ fields: [...currentProject.fields, newField as any] });
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      sketchRef.current.clearCanvas();
      if (sprayCanvasRef.current) {
        const ctx = sprayCanvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, sprayCanvasRef.current.width, sprayCanvasRef.current.height);
      }
      if (exitMode) {
        setIsDrawingMode(false);
      }
    }
  };

  return {
    sprayCanvasRef,
    sketchRef,
    drawingModeType,
    setDrawingModeType,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    eraserWidth,
    setEraserWidth,
    sprayDensity,
    setSprayDensity,
    handleSaveDrawing
  };
};
