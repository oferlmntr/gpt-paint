import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Bump minor version in manifest.json ---
const manifestSrc = path.join(__dirname, '../public/manifest.json');
const manifestDest = path.join(__dirname, '../dist/manifest.json');

let manifest = JSON.parse(fs.readFileSync(manifestSrc, 'utf-8'));
if (manifest.version) {
  const parts = manifest.version.split('.').map(Number);
  if (parts.length === 3) {
    parts[1] += 1; // bump minor
    parts[2] = 0; // reset patch
    manifest.version = parts.join('.');
    fs.writeFileSync(manifestSrc, JSON.stringify(manifest, null, 2));
    console.log(`🔄 Manifest version bumped to ${manifest.version}`);
  }
}

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

// --- Zip the dist folder ---
try {
  const distDir = path.join(__dirname, '../dist');
  const zipPath = path.join(__dirname, '../dist/gpt-power-ups.zip');
  execSync(`cd ${distDir} && zip -r gpt-power-ups.zip .`);
  console.log('✅ dist folder zipped to gpt-power-ups.zip');
} catch (err) {
  console.warn('⚠️  Could not zip dist folder. Is the zip CLI installed?');
} 