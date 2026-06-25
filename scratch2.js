const svg4 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="#ffffff" />
  <!-- Seal / Watermark -->
  <circle cx="200" cy="300" r="100" fill="none" stroke="#fecaca" stroke-width="4" opacity="0.4" />
  <circle cx="200" cy="300" r="85" fill="none" stroke="#fecaca" stroke-width="1" stroke-dasharray="4 4" opacity="0.4" />
  <path d="M170,280 L200,250 L230,280 L200,350 Z" fill="#fecaca" opacity="0.3" />
  <!-- Header -->
  <rect x="0" y="0" width="400" height="100" fill="#991b1b" />
  <rect x="0" y="100" width="400" height="15" fill="#f59e0b" />
  <!-- Footer Barcode -->
  <rect x="0" y="520" width="400" height="80" fill="#f8fafc" />
  <!-- Fake Barcode Lines -->
  <g fill="#000000">
    <rect x="100" y="540" width="4" height="40" />
    <rect x="108" y="540" width="8" height="40" />
    <rect x="120" y="540" width="2" height="40" />
    <rect x="126" y="540" width="10" height="40" />
    <rect x="140" y="540" width="6" height="40" />
    <rect x="150" y="540" width="2" height="40" />
    <rect x="156" y="540" width="12" height="40" />
    <rect x="172" y="540" width="4" height="40" />
    <rect x="180" y="540" width="8" height="40" />
    <rect x="192" y="540" width="2" height="40" />
    <rect x="198" y="540" width="14" height="40" />
    <rect x="216" y="540" width="6" height="40" />
    <rect x="226" y="540" width="4" height="40" />
    <rect x="234" y="540" width="10" height="40" />
    <rect x="248" y="540" width="2" height="40" />
    <rect x="254" y="540" width="8" height="40" />
    <rect x="266" y="540" width="12" height="40" />
    <rect x="282" y="540" width="4" height="40" />
    <rect x="290" y="540" width="8" height="40" />
  </g>
</svg>`;

const svg5 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="#18181b" />
  <!-- Diagonal stripes -->
  <defs>
    <pattern id="stripes" width="40" height="40" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <rect width="20" height="40" fill="#eab308" />
    </pattern>
  </defs>
  <!-- Top angle block -->
  <path d="M0,0 L400,0 L400,100 L0,150 Z" fill="url(#stripes)" />
  <path d="M0,0 L400,0 L400,90 L0,140 Z" fill="#000000" />
  <!-- Bottom block -->
  <rect x="0" y="480" width="400" height="120" fill="#eab308" />
</svg>`;

const svg6 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="#ffffff" />
  <!-- Heavy border -->
  <rect x="10" y="10" width="380" height="580" fill="none" stroke="#000000" stroke-width="8" />
  <!-- PRESS Header Block -->
  <rect x="14" y="14" width="372" height="120" fill="#000000" />
  <!-- Red Accent -->
  <rect x="14" y="134" width="372" height="16" fill="#dc2626" />
  <rect x="14" y="500" width="372" height="16" fill="#dc2626" />
</svg>`;

console.log("SVG4: data:image/svg+xml;base64," + Buffer.from(svg4).toString('base64'));
console.log("SVG5: data:image/svg+xml;base64," + Buffer.from(svg5).toString('base64'));
console.log("SVG6: data:image/svg+xml;base64," + Buffer.from(svg6).toString('base64'));
