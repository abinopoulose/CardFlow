import React from 'react';
import type { FieldConfig } from '../context/AppContext';

interface DividerRendererProps {
  field: FieldConfig;
}

const DividerRenderer: React.FC<DividerRendererProps> = ({ field }) => {
  const width = field.width || 100;
  const height = field.height || 20;
  const strokeWidth = field.borderWidth || 2;
  const style = field.lineStyle || 'solid';
  
  // Calculate vertical center
  const cy = height / 2;

  let dashArray = 'none';
  if (style === 'dashed') dashArray = `${strokeWidth * 3}, ${strokeWidth * 3}`;
  if (style === 'dotted') dashArray = `${strokeWidth}, ${strokeWidth * 2}`;

  // Generate paths
  let paths: { d: string, yOffset: number }[] = [];

  if (style === 'wavy') {
    const amplitude = Math.max(2, strokeWidth * 1.5);
    const frequency = Math.max(15, strokeWidth * 5);
    let d = `M 0,${cy}`;
    for (let x = 0; x < width + frequency; x += frequency) {
      d += ` Q ${x + frequency / 4},${cy - amplitude} ${x + frequency / 2},${cy}`;
      d += ` T ${x + frequency},${cy}`;
    }
    paths.push({ d, yOffset: 0 });
  } else if (style === 'zigzag') {
    const amplitude = Math.max(2, strokeWidth * 1.5);
    const frequency = Math.max(15, strokeWidth * 4);
    let d = `M 0,${cy}`;
    for (let x = 0; x < width + frequency; x += frequency) {
      d += ` L ${x + frequency / 4},${cy - amplitude} L ${x + (frequency * 3) / 4},${cy + amplitude} L ${x + frequency},${cy}`;
    }
    paths.push({ d, yOffset: 0 });
  } else if (style === 'double') {
    const offset = strokeWidth; // Space between the two lines
    const d = `M 0,0 L ${width},0`;
    paths.push({ d, yOffset: -offset });
    paths.push({ d, yOffset: offset });
  } else {
    // solid, dashed, dotted
    paths.push({ d: `M 0,${cy} L ${width},${cy}`, yOffset: 0 });
  }

  // Calculate Gradient Angles
  let gradX1 = '0%', gradY1 = '0%', gradX2 = '100%', gradY2 = '0%';
  if (field.gradient) {
    const dir = field.gradient.direction;
    if (dir === 'to right') { gradX1 = '0%'; gradY1 = '50%'; gradX2 = '100%'; gradY2 = '50%'; }
    else if (dir === 'to left') { gradX1 = '100%'; gradY1 = '50%'; gradX2 = '0%'; gradY2 = '50%'; }
    else if (dir === 'to bottom') { gradX1 = '50%'; gradY1 = '0%'; gradX2 = '50%'; gradY2 = '100%'; }
    else if (dir === 'to top') { gradX1 = '50%'; gradY1 = '100%'; gradX2 = '50%'; gradY2 = '0%'; }
    else if (dir === 'to bottom right') { gradX1 = '0%'; gradY1 = '0%'; gradX2 = '100%'; gradY2 = '100%'; }
    else if (dir === 'to top left') { gradX1 = '100%'; gradY1 = '100%'; gradX2 = '0%'; gradY2 = '0%'; }
    else if (dir === 'to bottom left') { gradX1 = '100%'; gradY1 = '0%'; gradX2 = '0%'; gradY2 = '100%'; }
    else if (dir === 'to top right') { gradX1 = '0%'; gradY1 = '100%'; gradX2 = '100%'; gradY2 = '0%'; }
    else if (dir.endsWith('deg')) {
      const angle = parseInt(dir, 10);
      const rad = (angle - 90) * (Math.PI / 180);
      gradX1 = `${50 - Math.cos(rad) * 50}%`;
      gradY1 = `${50 - Math.sin(rad) * 50}%`;
      gradX2 = `${50 + Math.cos(rad) * 50}%`;
      gradY2 = `${50 + Math.sin(rad) * 50}%`;
    }
  }

  const gradId = `grad-${field.id}`;
  const strokeColor = field.gradient ? `url(#${gradId})` : (field.borderColor || '#000000');

  return (
    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
      {field.gradient && (
        <defs>
          <linearGradient id={gradId} x1={gradX1} y1={gradY1} x2={gradX2} y2={gradY2}>
            {field.gradient.colors.map((c, i) => (
              <stop key={i} offset={`${(i / (field.gradient!.colors.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
      )}
      
      {paths.map((p, i) => (
        <g key={i} transform={style === 'double' ? `translate(0, ${cy + p.yOffset})` : undefined}>
          {/* Main Line */}
          <path 
            d={p.d}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            fill="none"
            strokeLinecap={style === 'dotted' ? 'round' : 'butt'}
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  );
};

export default DividerRenderer;
