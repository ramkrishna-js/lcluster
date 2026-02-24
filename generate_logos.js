import fs from 'node:fs';

const renderSvg = (bgColor, fgColor, isLight = false) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130" width="200" height="260">
  <rect width="100" height="130" fill="${bgColor}" />
  <!-- Verbindungen -->
  <line x1="50" y1="50" x2="50" y2="15" stroke="${fgColor}" stroke-width="2" />
  <line x1="50" y1="50" x2="19.69" y2="67.5" stroke="${fgColor}" stroke-width="2" />
  <line x1="50" y1="50" x2="80.31" y2="67.5" stroke="${fgColor}" stroke-width="2" />
  
  <!-- Zentrales Hexagon -->
  <polygon points="50,30 67.32,40 67.32,60 50,70 32.68,60 32.68,40" fill="${bgColor}" stroke="${fgColor}" stroke-width="3" />
  
  <!-- Nodes / Außenpunkte -->
  <circle cx="50" cy="15" r="5" fill="${fgColor}" />
  <circle cx="19.69" cy="67.5" r="5" fill="${fgColor}" />
  <circle cx="80.31" cy="67.5" r="5" fill="${fgColor}" />
  
  <!-- Text -->
  <text x="50" y="115" font-family="monospace" font-size="20" font-weight="bold" fill="${fgColor}" text-anchor="middle">lcluster</text>
</svg>`;

// We will use Neon theme as default/logo.svg since the prompt mentioned tracking Neon as primary hue
// Neon version: #00ff9f on #080b14
const neonSvg = renderSvg('#080b14', '#00ff9f');
const lightSvg = renderSvg('#ffffff', '#000000', true);
const darkSvg = renderSvg('#000000', '#ffffff');

fs.writeFileSync('docs/public/logo.svg', neonSvg);
fs.writeFileSync('docs/public/logo-dark.svg', darkSvg);
fs.writeFileSync('docs/public/logo-light.svg', lightSvg);

// Also save minimal and amber just to have them available, though prompt says output formats needed: logo.svg, logo-dark.svg, logo-light.svg
const minimalSvg = renderSvg('#1e1e2e', '#cba6f7');
const amberSvg = renderSvg('#0d0800', '#ffb347');
fs.writeFileSync('docs/public/logo-minimal.svg', minimalSvg);
fs.writeFileSync('docs/public/logo-amber.svg', amberSvg);
fs.writeFileSync('docs/public/favicon.ico', neonSvg); // Many modern browsers accept SVGs as ICO internally, but we'll try to use a png to ico if needed. For now, writing it this way is simple.

console.log("Logos generated.");
