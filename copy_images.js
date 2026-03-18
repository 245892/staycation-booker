const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'public/gallery');
const destDir = path.join(__dirname, 'src/assets/gallery');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const files = fs.readdirSync(srcDir);
files.forEach(file => {
  if (file.endsWith('.png')) {
    const newName = file.replace(/_\d+\.png$/, '.png');
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, newName));
    console.log(`Copied ${file} to ${newName}`);
  }
});
