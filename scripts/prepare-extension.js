import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy the manifest.json to the dist folder
const manifestSrc = path.join(__dirname, '../public/manifest.json');
const manifestDest = path.join(__dirname, '../dist/manifest.json');

// Copy the popup.html to the dist folder
const popupSrc = path.join(__dirname, '../public/popup.html');
const popupDest = path.join(__dirname, '../dist/popup.html');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../dist/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Copy manifest.json
fs.copyFileSync(manifestSrc, manifestDest);
console.log('✅ manifest.json copied to dist/');

// Copy popup.html
fs.copyFileSync(popupSrc, popupDest);
console.log('✅ popup.html copied to dist/');

// Copy icon files
const iconSrcDir = path.join(__dirname, '../public/icons');
const iconDestDir = path.join(__dirname, '../dist/icons');

// Copy each icon file
['icon16.png', 'icon48.png', 'icon128.png'].forEach(iconFile => {
  const srcPath = path.join(iconSrcDir, iconFile);
  const destPath = path.join(iconDestDir, iconFile);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ ${iconFile} copied to dist/icons/`);
  } else {
    console.log(`❌ ${iconFile} not found in public/icons/`);
  }
}); 