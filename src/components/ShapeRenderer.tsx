import React from 'react';
import * as LucideIcons from 'lucide-react';
import { type FieldConfig } from '../context/AppContext';

interface ShapeRendererProps {
  field: FieldConfig;
  scale?: number;
  previewMode?: boolean;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({ field, scale = 1, previewMode = false }) => {
  const common = previewMode ? "stroke-current text-gray-400 fill-gray-100 group-hover:text-indigo-500 group-hover:fill-indigo-50 transition-colors w-6 h-6 mx-auto mb-1" : "";
  
  const fill = field.fillTransparent ? 'transparent' : (field.backgroundColor || '#e0e7ff');
  const stroke = field.borderTransparent ? 'transparent' : (field.borderColor || '#4f46e5');
  const strokeWidth = (field.borderWidth !== undefined ? field.borderWidth : 2) * scale;
  const radius = (field.borderRadius || 0) * scale;

  if (field.shapeType.startsWith('lucide-')) {
    const iconName = field.shapeType.replace('lucide-', '');
    const Icon = (LucideIcons as any)[iconName];
    if (Icon) {
      if (previewMode) {
        return <Icon className={common} strokeWidth={2} />;
      }
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <Icon width="100%" height="100%" stroke={stroke} fill={fill === 'transparent' ? 'none' : fill} strokeWidth={strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    }
  }

  // Predefined custom shapes
  switch (field.shapeType) {
    case 'circle':
      return (
        <svg className={common} width="100%" height="100%" viewBox={previewMode ? "0 0 100 100" : undefined} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50%" cy="50%" rx={previewMode ? 40 : `calc(50% - ${strokeWidth/2}px)`} ry={previewMode ? 40 : `calc(50% - ${strokeWidth/2}px)`} fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 6 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'triangle':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,2 98,98 2,98" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 6 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'star':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'hexagon':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 6 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'pentagon':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,38 78,95 22,95 5,38" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 6 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'diamond':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,50 50,95 5,50" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 6 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'line':
      return (
        <svg className={common} width="100%" height="100%" viewBox={previewMode ? "0 0 100 100" : undefined} xmlns="http://www.w3.org/2000/svg">
          <line x1={previewMode ? 10 : "0"} y1={previewMode ? 50 : "50%"} x2={previewMode ? 90 : "100%"} y2={previewMode ? 50 : "50%"} fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} strokeLinecap={previewMode ? "round" : undefined} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'ellipse':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="50" rx="48" ry="30" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 6 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'cross':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 10 H60 V40 H90 V60 H60 V90 H40 V60 H10 V40 H40 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'heart':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 85 C50 85 10 55 10 30 C10 15 25 5 40 15 C50 25 50 25 50 25 C50 25 50 25 60 15 C75 5 90 15 90 30 C90 55 50 85 50 85 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 40, 60 40, 60 20, 90 50, 60 80, 60 60, 20 60" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="80 40, 40 40, 40 20, 10 50, 40 80, 40 60, 80 60" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'arrow-up':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40 80, 40 40, 20 40, 50 10, 80 40, 60 40, 60 80" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'arrow-down':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40 20, 40 60, 20 60, 50 90, 80 60, 60 60, 60 20" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'shield':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 L50 10 L90 20 V50 C90 75 50 90 50 90 C50 90 10 75 10 50 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'tag':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10 30, 30 10, 90 10, 90 90, 30 90, 10 70" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'message':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 H90 V70 H30 L10 90 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'moon':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 10 C30 10 10 30 10 60 C10 80 25 90 40 90 C25 75 25 45 60 30 C75 25 90 35 90 35 C85 15 75 10 60 10 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'parallelogram':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 80, 40 20, 90 20, 70 80" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'trapezoid':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 80, 30 20, 70 20, 80 80" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'octagon':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="30 10, 70 10, 90 30, 90 70, 70 90, 30 90, 10 70, 10 30" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'heptagon':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50 10, 85 25, 90 60, 65 90, 35 90, 10 60, 15 25" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'nonagon':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50 10, 75 20, 90 45, 80 75, 55 90, 30 85, 10 60, 15 30, 35 10" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'decagon':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50 10, 75 15, 90 35, 90 65, 75 85, 50 90, 25 85, 10 65, 10 35, 25 15" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'dodecagon':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50 10, 70 15, 85 30, 90 50, 85 70, 70 85, 50 90, 30 85, 15 70, 10 50, 15 30, 30 15" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'bookmark':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 10, 80 10, 80 90, 50 70, 20 90" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'flag':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 10, 90 10, 70 30, 90 50, 20 50" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'chevron-up':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 60 L50 20 L90 60" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 40 L50 80 L90 40" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 10 L20 50 L60 90" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 10 L80 50 L40 90" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'plus':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50 H80 M50 20 V80" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'minus':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50 H80" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'times':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 20 L80 80 M80 20 L20 80" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'divide':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50 H80 M50 25 A 5 5 0 1 0 50 26 M50 75 A 5 5 0 1 0 50 76" strokeLinecap={previewMode ? "round" : undefined} fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'equals':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 35 H80 M20 65 H80" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'home':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 50 L50 10 L90 50 V90 H10 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'mail':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 25 L50 55 L90 25 V75 H10 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'user':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 45 A 20 20 0 1 0 50 5 A 20 20 0 1 0 50 45 Z M10 95 C10 65 90 65 90 95" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'lock':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 40 V25 A 20 20 0 0 1 70 25 V40 H80 V90 H20 V40 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'unlock':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 40 V25 A 20 20 0 0 1 70 25 V25 M70 40 H80 V90 H20 V40 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'search':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 60 A 20 20 0 1 0 40 20 A 20 20 0 1 0 40 60 Z M55 55 L85 85" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 8 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'bell':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 70 C20 70 30 60 30 40 C30 20 70 20 70 40 C70 60 80 70 80 70 H20 Z M40 70 A 10 10 0 0 0 60 70" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'camera':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 30 L30 15 H70 L80 30 H90 V80 H10 V30 Z M50 70 A 15 15 0 1 0 50 40 A 15 15 0 1 0 50 70 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'cloud':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 60 A 15 15 0 0 1 25 30 C 25 15 55 15 60 25 A 20 20 0 0 1 80 55 A 15 15 0 0 1 70 80 H25 A 15 15 0 0 1 25 60 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'music':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 70 A 10 10 0 1 0 30 50 A 10 10 0 1 0 30 70 Z M70 60 A 10 10 0 1 0 70 40 A 10 10 0 1 0 70 60 Z M40 60 V10 L80 20 V50" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 6 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'sun':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <g><circle cx="50" cy="50" r="20" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} /><path d="M50 10 V20 M50 80 V90 M10 50 H20 M80 50 H90 M22 22 L29 29 M71 71 L78 78 M22 78 L29 71 M71 29 L78 22" fill="none" stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} /></g>
        </svg>
      );
    case 'zap':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="60 10, 20 50, 45 55, 40 90, 80 50, 55 45" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'leaf':
      return (
        <svg className={common} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 C 90 10 90 50 90 50 C 90 90 50 90 50 90 C 10 90 10 50 10 50 C 10 10 50 10 50 10 Z" fill={previewMode ? undefined : fill} stroke={previewMode ? undefined : stroke} strokeWidth={previewMode ? 4 : strokeWidth} vectorEffect={previewMode ? undefined : "non-scaling-stroke"} />
        </svg>
      );
    case 'rectangle':
    default:
      return (
        <svg className={common} width="100%" height="100%" viewBox={previewMode ? "0 0 100 100" : undefined} xmlns="http://www.w3.org/2000/svg">
          <rect 
            x={previewMode ? 10 : strokeWidth/2} 
            y={previewMode ? 20 : strokeWidth/2} 
            width={previewMode ? 80 : `calc(100% - ${strokeWidth}px)`} 
            height={previewMode ? 60 : `calc(100% - ${strokeWidth}px)`} 
            rx={previewMode ? 4 : radius} 
            fill={previewMode ? undefined : fill} 
            stroke={previewMode ? undefined : stroke} 
            strokeWidth={previewMode ? 6 : strokeWidth} 
          />
        </svg>
      );
  }
};

export default ShapeRenderer;
