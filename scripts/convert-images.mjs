#!/usr/bin/env node
// Convert PNG/JPG images in static/img to AVIF during build
// Skips files that already have up-to-date .avif

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd());
const IMG_DIR = path.join(ROOT, 'static', 'img');

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function ensureAvif(srcPath) {
  const ext = path.extname(srcPath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return { skipped: true };

  const outPath = srcPath.replace(/\.(png|jpe?g)$/i, '.avif');
  try {
    const [srcStat, outStat] = await Promise.allSettled([
      fs.stat(srcPath),
      fs.stat(outPath),
    ]);

    const srcMtime = srcStat.status === 'fulfilled' ? srcStat.value.mtimeMs : 0;
    const outMtime = outStat.status === 'fulfilled' ? outStat.value.mtimeMs : 0;
    if (outMtime >= srcMtime) return { skipped: true };

    await sharp(srcPath)
      .avif({ quality: 60, effort: 4 })
      .toFile(outPath);
    return { created: true, outPath };
  } catch (err) {
    // Non-fatal; continue build
    return { error: true, message: err.message };
  }
}

async function main() {
  try {
    await fs.access(IMG_DIR);
  } catch {
    // No images dir; nothing to do
    return;
  }

  // Pass 1: collect sources and detect ambiguous basenames (case-insensitive collisions)
  const sources = [];
  for await (const file of walk(IMG_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const rel = path.relative(IMG_DIR, file);
      const key = rel.replace(/\.(png|jpe?g)$/i, '').toLowerCase();
      sources.push({ file, rel, key });
    }
  }

  const groups = new Map();
  for (const s of sources) {
    const arr = groups.get(s.key) || [];
    arr.push(s);
    groups.set(s.key, arr);
  }

  const ambiguousKeys = new Set(
    [...groups.entries()]
      .filter(([, arr]) => arr.length > 1)
      .map(([k]) => k)
  );

  // Optional cleanup: remove previously created AVIFs for ambiguous keys
  const cleanupTasks = [];
  for (const key of ambiguousKeys) {
    const arr = groups.get(key) || [];
    for (const s of arr) {
      const avifPath = path.join(IMG_DIR, s.rel.replace(/\.(png|jpe?g)$/i, '.avif'));
      cleanupTasks.push(fs.rm(avifPath, { force: true }).catch(() => {}));
    }
  }
  await Promise.all(cleanupTasks);

  // Pass 2: convert only non-ambiguous sources
  const tasks = [];
  for (const s of sources) {
    if (ambiguousKeys.has(s.key)) continue; // skip to avoid case-collision
    tasks.push(ensureAvif(s.file));
  }

  const results = await Promise.all(tasks);
  const created = results.filter(r => r && r.created).length;
  const errors = results.filter(r => r && r.error);
  const skippedAmbiguous = ambiguousKeys.size;
  if (created > 0) {
    console.log(`[convert-images] Created ${created} AVIF file(s).`);
  }
  if (errors.length > 0) {
    console.warn(`[convert-images] ${errors.length} error(s) during conversion.`);
  }
  if (skippedAmbiguous > 0) {
    console.warn(`[convert-images] Skipped ${skippedAmbiguous} case-ambiguous basename(s) to avoid conflicts.`);
  }
}

main();
