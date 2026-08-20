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
  console.log(`Found ${images.length} images to optimize.`);

  const assetMap = new Map();

  for (const imgPath of images) {
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

    // Calculate URLs for HTML patching
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

    // FIX DOUBLE LOADING: Remove all image preloads in the head
    // Docusaurus preloads original images which triggers extra downloads
    const preloadRegex = /<link[^>]+as=["']?image["']?[^>]*>/g;
    if (preloadRegex.test(content)) {
      content = content.replace(preloadRegex, '<!-- preload-removed -->');
      modified = true;
    }

    assetMap.forEach((optimized, orig) => {
      // Escape for regex
      const escapedOrig = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Regex to find <img> tags with this specific src
      const imgRegex = new RegExp(`<img[^>]+src=["']?${escapedOrig}["']?[^>]*>`, 'g');

      content = content.replace(imgRegex, (match) => {
        // Skip if already optimized in this file
        if (match.includes('data-optimized')) return match;

        modified = true;
        const optimizedImg = match.replace('<img', '<img data-optimized="true"');

        return `
<picture>
  <source srcset="${optimized.avif}" type="image/avif">
  <source srcset="${optimized.webp}" type="image/webp">
  ${optimizedImg}
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
