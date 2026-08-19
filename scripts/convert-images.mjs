import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticImgDir = path.join(__dirname, '../static/img');

async function convertDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      await convertDir(fullPath);
    } else if (file.match(/\.(png|jpe?g)$/i)) {
      const avifPath = fullPath.replace(/\.(png|jpe?g)$/i, '.avif');
      const webpPath = fullPath.replace(/\.(png|jpe?g)$/i, '.webp');

      if (!fs.existsSync(avifPath)) {
        console.log(`Converting ${file} to AVIF...`);
        try {
          await sharp(fullPath)
            .avif({ quality: 60 })
            .toFile(avifPath);
        } catch (err) {
          console.error(`Failed to convert ${file}:`, err);
        }
      }

      if (!fs.existsSync(webpPath)) {
        console.log(`Converting ${file} to WebP...`);
        try {
          await sharp(fullPath)
            .webp({ quality: 75 })
            .toFile(webpPath);
        } catch (err) {
          console.error(`Failed to convert ${file}:`, err);
        }
      }
    }
  }
}

console.log('Starting image conversion...');
convertDir(staticImgDir).then(() => {
  console.log('Image conversion complete.');
}).catch(err => {
  console.error('Error during image conversion:', err);
  process.exit(1);
});
