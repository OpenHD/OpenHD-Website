#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

/**
 * Migration script to convert static image references to use native-ideal-image webpack loader
 * 
 * Converts:
 * <img src="/img/image.png" /> -> import + <img {...imageObj} />
 * <img src="./image.png" /> -> import + <img {...imageObj} />
 */

async function findComponentFiles() {
  return glob.glob('src/**/*.{tsx,jsx,ts,js}');
}

function generateImportName(imagePath) {
  const basename = path.basename(imagePath, path.extname(imagePath));
  // Convert kebab-case and spaces to camelCase
  return basename
    .replace(/[-\s]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
    + 'Img';
}

function convertImagePath(imagePath) {
  // Convert /img/... to static path (docusaurus-plugin-native-ideal-image expects this format)
  if (imagePath.startsWith('/img/')) {
    return '@site/static' + imagePath;
  }
  // Convert /OpenHD-Website/img/... to static path
  if (imagePath.startsWith('/OpenHD-Website/img/')) {
    return '@site/static/img/' + imagePath.replace('/OpenHD-Website/img/', '');
  }
  return imagePath;
}

async function migrateFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = await fs.readFile(filePath, 'utf8');
  let hasChanges = false;
  const imports = new Set();
  const imageReplacements = new Map();

  // Find useBaseUrl patterns with image paths
  const useBaseUrlRegex = /useBaseUrl\(['"]([^'"]*\.(png|jpe?g|gif|webp|avif))['\"]\)/gi;
  
  let match;
  while ((match = useBaseUrlRegex.exec(content)) !== null) {
    const [fullMatch, imagePath] = match;
    
    // Skip external URLs
    if (imagePath.startsWith('http')) {
      continue;
    }
    
    const importPath = convertImagePath(imagePath);
    const importName = generateImportName(imagePath);
    
    // Add import
    imports.add(`import ${importName} from '${importPath}?formats=avif,webp&w=400,800,1200';`);
    
    // Replace useBaseUrl call with import reference
    const newReference = `${importName}.src`;
    imageReplacements.set(fullMatch, newReference);
    
    hasChanges = true;
  }
  
  // Also find direct img tags with src attributes pointing to static images
  const imgRegex = /<img([^>]*?)src=["']([^"']+\.(png|jpe?g|gif|webp|avif))["']([^>]*?)>/gi;
  
  while ((match = imgRegex.exec(content)) !== null) {
    const [fullMatch, beforeSrc, imageSrc, , afterSrc] = match;
    
    // Skip if it's already using an imported image or external URL
    if (imageSrc.startsWith('http') || !imageSrc.includes('.')) {
      continue;
    }
    
    const importPath = convertImagePath(imageSrc);
    const importName = generateImportName(imageSrc);
    
    // Add import
    imports.add(`import ${importName} from '${importPath}?formats=avif,webp&w=400,800,1200';`);
    
    // Create replacement
    const newImgTag = `<img${beforeSrc}${afterSrc} {...${importName}} />`;
    imageReplacements.set(fullMatch, newImgTag);
    
    hasChanges = true;
  }

  if (hasChanges) {
    // Add imports at the top (after existing imports)
    const importLines = Array.from(imports);
    const lines = content.split('\n');
    
    // Find where to insert imports (after last import or at top)
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '' && insertIndex > 0) {
        // Stop at first empty line after imports
        break;
      }
    }
    
    // Insert imports
    lines.splice(insertIndex, 0, '', '// Auto-generated imports by migrate-to-native-ideal-image', ...importLines);
    content = lines.join('\n');
    
    // Replace img tags
    for (const [oldTag, newTag] of imageReplacements) {
      content = content.replace(oldTag, newTag);
    }
    
    // Write back
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath} - Added ${imports.size} imports`);
  } else {
    console.log(`ℹ️  No changes needed for ${filePath}`);
  }
}

async function main() {
  try {
    console.log('🔄 Starting migration to native-ideal-image...\n');
    
    const componentFiles = await findComponentFiles();
    console.log(`Found ${componentFiles.length} component files\n`);
    
    for (const file of componentFiles) {
      await migrateFile(file);
    }
    
    console.log('\n🎉 Migration complete!');
    console.log('\nNext steps:');
    console.log('1. Review the changes');
    console.log('2. Test the components');
    console.log('3. Commit the changes');
    console.log('4. Remove the custom AVIF plugin from docusaurus.config.ts');
    
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile, generateImportName, convertImagePath };