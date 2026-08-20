import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import crypto from 'crypto';

const buildDir = './build';
const cacheDir = './.image-cache';
const baseUrl = process.env.STAGING === 'true' ? '/staging/' : '/';

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

async function optimize() {
  console.log('--- Starting cached image optimization pipeline ---');

  const images = await glob(`${buildDir}/**/*.{png,jpg,jpeg}`, { nodir: true });
  console.log(`Found ${images.length} images in build output.`);

  const assetMap = new Map();
  let optimizedCount = 0;
  let cachedCount = 0;

  for (const imgPath of images) {
    const fileHash = getFileHash(imgPath);
    const ext = path.extname(imgPath);

    const avifCachePath = path.join(cacheDir, `${fileHash}.avif`);
    const webpCachePath = path.join(cacheDir, `${fileHash}.webp`);

    const avifDestPath = imgPath.replace(/\.(png|jpe?g)$/i, '.avif');
    const webpDestPath = imgPath.replace(/\.(png|jpe?g)$/i, '.webp');

    // --- AVIF ---
    if (fs.existsSync(avifCachePath)) {
      fs.copyFileSync(avifCachePath, avifDestPath);
      cachedCount++;
    } else {
      try {
        await sharp(imgPath).avif({ quality: 60, effort: 4 }).toFile(avifCachePath);
        fs.copyFileSync(avifCachePath, avifDestPath);
        optimizedCount++;
      } catch (e) {
        console.warn(`Failed AVIF for ${imgPath}: ${e.message}`);
      }
    }

    // --- WebP ---
    if (fs.existsSync(webpCachePath)) {
      fs.copyFileSync(webpCachePath, webpDestPath);
    } else {
      try {
        await sharp(imgPath).webp({ quality: 75 }).toFile(webpCachePath);
        fs.copyFileSync(webpCachePath, webpDestPath);
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

  console.log(`Optimization stats: ${optimizedCount} new, ${cachedCount} from cache.`);

  // 2. Patch HTML files
  const htmlFiles = await glob(`${buildDir}/**/*.html`, { nodir: true });
  console.log(`Patching ${htmlFiles.length} HTML files...`);

  for (const htmlPath of htmlFiles) {
    let content = fs.readFileSync(htmlPath, 'utf8');
    let modified = false;

    // Remove preloads to prevent double loading
    const preloadRegex = /<link[^>]+as=["']?image["']?[^>]*>/g;
    if (preloadRegex.test(content)) {
      content = content.replace(preloadRegex, '<!-- preload-removed -->');
      modified = true;
    }

    assetMap.forEach((optimized, orig) => {
      const escapedOrig = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`<img[^>]+src=["']?${escapedOrig}["']?[^>]*>`, 'g');

      content = content.replace(regex, (match) => {
        if (content.includes(optimized.avif)) return match;
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
