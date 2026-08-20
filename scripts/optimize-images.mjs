import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const buildDir = './build';
const baseUrl = process.env.STAGING === 'true' ? '/staging/' : '/';

async function optimize() {
  console.log('--- Starting image optimization pipeline ---');

  // 1. Find all original images in the build output
  const images = await glob(`${buildDir}/**/*.{png,jpg,jpeg}`, { nodir: true });
  console.log(`Found ${images.length} images.`);

  const assetMap = new Map();

  for (const imgPath of images) {
    // Skip if it's already an optimized version (shouldn't happen with these extensions)
    const avifPath = imgPath.replace(/\.(png|jpe?g)$/i, '.avif');
    const webpPath = imgPath.replace(/\.(png|jpe?g)$/i, '.webp');

    // Create AVIF
    if (!fs.existsSync(avifPath)) {
      try {
        await sharp(imgPath).avif({ quality: 60, effort: 4 }).toFile(avifPath);
      } catch (e) {
        console.warn(`Failed AVIF for ${imgPath}: ${e.message}`);
      }
    }

    // Create WebP
    if (!fs.existsSync(webpPath)) {
      try {
        await sharp(imgPath).webp({ quality: 75 }).toFile(webpPath);
      } catch (e) {
        console.warn(`Failed WebP for ${imgPath}: ${e.message}`);
      }
    }

    // Map the URLs
    let relPath = imgPath.replace(/^build/, '').replace(/\\/g, '/');
    if (baseUrl !== '/' && !relPath.startsWith(baseUrl)) {
      relPath = (baseUrl + relPath).replace(/\/+/g, '/');
    }

    assetMap.set(relPath, {
      avif: relPath.replace(/\.(png|jpe?g)$/i, '.avif'),
      webp: relPath.replace(/\.(png|jpe?g)$/i, '.webp'),
    });
  }

  // 2. Patch HTML files
  const htmlFiles = await glob(`${buildDir}/**/*.html`, { nodir: true });
  console.log(`Patching ${htmlFiles.length} HTML files...`);

  for (const htmlPath of htmlFiles) {
    let content = fs.readFileSync(htmlPath, 'utf8');
    let modified = false;

    assetMap.forEach((optimized, orig) => {
      // Find <img> tags with this src. Handle optional quotes.
      const escapedOrig = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`<img[^>]+src=["']?${escapedOrig}["']?[^>]*>`, 'g');

      content = content.replace(regex, (match) => {
        if (content.includes(optimized.avif)) return match; // Already patched
        modified = true;
        return `
<picture>
  <source srcset="${optimized.avif}" type="image/avif">
  <source srcset="${optimized.webp}" type="image/webp">
  ${match}
</picture>`.trim();
      });
    });

    if (modified) {
      fs.writeFileSync(htmlPath, content);
    }
  }

  console.log('--- Image optimization pipeline complete ---');
}

optimize().catch(console.error);
