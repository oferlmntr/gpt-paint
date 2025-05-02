import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const publicDir = path.join(__dirname, '../public');
const distDir = path.join(__dirname, '../dist');

// Files to copy and watch
const filesToWatch = [
  { src: path.join(publicDir, 'manifest.json'), dest: path.join(distDir, 'manifest.json') },
  { src: path.join(publicDir, 'popup.html'), dest: path.join(distDir, 'popup.html') }
];

// Icon files
const iconSrcDir = path.join(publicDir, 'icons');
const iconDestDir = path.join(distDir, 'icons');
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];

// Ensure directories exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist directory');
}

if (!fs.existsSync(iconDestDir)) {
  fs.mkdirSync(iconDestDir, { recursive: true });
  console.log('✅ Created icons directory in dist/');
}

// Copy a file with logging
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${path.basename(src)} to ${path.relative(process.cwd(), dest)}`);
  } catch (err) {
    console.error(`❌ Error copying ${src}: ${err.message}`);
  }
}

// Initial copy of all files
console.log('📁 Performing initial copy of extension files...');
filesToWatch.forEach(file => copyFile(file.src, file.dest));
iconFiles.forEach(iconFile => {
  const srcPath = path.join(iconSrcDir, iconFile);
  const destPath = path.join(iconDestDir, iconFile);
  if (fs.existsSync(srcPath)) {
    copyFile(srcPath, destPath);
  } else {
    console.warn(`⚠️ Icon file ${iconFile} not found in public/icons/`);
  }
});

// Watch for changes in the public directory
console.log('👀 Watching for file changes...');

// Watch manifest.json and popup.html for changes
chokidar
  .watch([...filesToWatch.map(file => file.src)], {
    persistent: true
  })
  .on('change', filePath => {
    const file = filesToWatch.find(f => f.src === filePath);
    if (file) {
      copyFile(file.src, file.dest);
    }
  });

// Watch icon files for changes
chokidar
  .watch(path.join(iconSrcDir, '*.png'), {
    persistent: true
  })
  .on('change', filePath => {
    const filename = path.basename(filePath);
    const destPath = path.join(iconDestDir, filename);
    copyFile(filePath, destPath);
  })
  .on('add', filePath => {
    const filename = path.basename(filePath);
    const destPath = path.join(iconDestDir, filename);
    copyFile(filePath, destPath);
  });

// Add debug info to contentScript.tsx
console.log('🔍 Extension development mode is active! Updates will be automatic.');
console.log('💡 To view extension logs:');
console.log('   1. Open chrome://extensions');
console.log('   2. Find your extension and enable "Developer mode"');
console.log('   3. Click "Inspect views: service worker" (or similar)');
console.log('   4. Check the Console tab for extension background logs');
console.log('   5. Also open DevTools on ChatGPT page (right-click -> Inspect)');
console.log('   6. Check the Console tab for content script logs with prefix "[ChatGPT Drawing Tool]"');
console.log('📝 Press Ctrl+C to stop watching'); 