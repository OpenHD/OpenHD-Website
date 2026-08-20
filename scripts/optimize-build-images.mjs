import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const buildDir = './build';
const baseUrl = process.env.STAGING === 'true' ? '/staging/' : '/';

async function optimizeImages() {
  console.log('--- Starting post-build image optimization pipeline ---');

  // 1. Find all images in the build directory
  const images = await glob(`${buildDir}/**/*.{png,jpg,jpeg}`, { nodir: true });
  console.log(`Found ${images.length} images to optimize.`);

  const assetMap = new Map();

  for (const imgPath of images) {
    const avifPath = imgPath.replace(/\.(png|jpe?g)$/i, '.avif');
    const webpPath = imgPath.replace(/\.(png|jpe?g)$/i, '.webp');

    // Convert to AVIF
    if (!fs.existsSync(avifPath)) {
      try {
        await sharp(imgPath).avif({ quality: 60, effort: 4 }).toFile(avifPath);
      } catch (err) {
        // console.error(`Failed AVIF: ${imgPath}`, err.message);
      }
    }

    // Convert to WebP
    if (!fs.existsSync(webpPath)) {
      try {
        await sharp(imgPath).webp({ quality: 75 }).toFile(webpPath);
      } catch (err) {
        // console.error(`Failed WebP: ${imgPath}`, err.message);
      }
    }

    // Store relative paths for HTML replacement
    let relOrig = imgPath.replace(/^build/, '').replace(/\\/g, '/');
    let relAvif = avifPath.replace(/^build/, '').replace(/\\/g, '/');
    let relWebp = webpPath.replace(/^build/, '').replace(/\\/g, '/');

    // Fix baseUrl
    if (baseUrl !== '/' && !relOrig.startsWith(baseUrl)) {
      relOrig = (baseUrl + relOrig).replace(/\/+/g, '/');
      relAvif = (baseUrl + relAvif).replace(/\/+/g, '/');
      relWebp = (baseUrl + relWebp).replace(/\/+/g, '/');
    }

    assetMap.set(relOrig, { avif: relAvif, webp: relWebp });
    // Also handle path without leading slash
    if (relOrig.startsWith('/')) {
      assetMap.set(relOrig.substring(1), { avif: relAvif, webp: relWebp });
    }
  }

  // 2. Patch HTML files
  const htmlFiles = await glob(`${buildDir}/**/*.html`, { nodir: true });
  console.log(`Patching ${htmlFiles.length} HTML files...`);

  for (const htmlPath of htmlFiles) {
    let content = fs.readFileSync(htmlPath, 'utf8');
    let modified = false;

    // FIX DOUBLE LOADING: Remove all image preloads in the head
    // We look for any link tag that has as="image" (with or without quotes)
    const preloadRegex = /<link[^>]+as=["']?image["']?[^>]*>/g;
    if (preloadRegex.test(content)) {
      content = content.replace(preloadRegex, '<!-- preload-removed -->');
      modified = true;
    }

    // Wrap <img> in <picture>
    assetMap.forEach((optimized, orig) => {
      const escapedOrig = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const imgRegex = new RegExp(`<img[^>]+src=["']?${escapedOrig}["']?[^>]*>`, 'g');

      content = content.replace(imgRegex, (match) => {
        if (content.includes(optimized.avif)) return match;
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

  console.log('--- Post-build optimization complete ---');
}

optimizeImages().catch(console.error);
