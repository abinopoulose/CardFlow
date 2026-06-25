const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="header" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bg)" />
  <path d="M0,0 L400,0 L400,200 Q200,280 0,200 Z" fill="url(#header)" />
  <path d="M0,0 L400,0 L400,190 Q200,260 0,190 Z" fill="#6366f1" opacity="0.3" />
  <rect x="0" y="550" width="400" height="50" fill="#1e293b" />
</svg>`;

const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="#0f172a" />
  <circle cx="0" cy="0" r="200" fill="#a855f7" opacity="0.2" filter="blur(40px)" />
  <circle cx="400" cy="600" r="250" fill="#ec4899" opacity="0.15" filter="blur(50px)" />
  <rect x="20" y="20" width="360" height="560" fill="none" stroke="#334155" stroke-width="2" rx="16" />
  <path d="M 20 180 L 380 180" stroke="#ec4899" stroke-width="4" />
</svg>`;

const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#ffffff" />
  <rect x="0" y="0" width="150" height="400" fill="#0ea5e9" />
  <rect x="150" y="350" width="450" height="50" fill="#f1f5f9" />
  <path d="M 150 0 L 250 0 L 150 400 Z" fill="#38bdf8" opacity="0.2" />
</svg>`;

console.log("SVG1: data:image/svg+xml;base64," + Buffer.from(svg1).toString('base64'));
console.log("SVG2: data:image/svg+xml;base64," + Buffer.from(svg2).toString('base64'));
console.log("SVG3: data:image/svg+xml;base64," + Buffer.from(svg3).toString('base64'));
