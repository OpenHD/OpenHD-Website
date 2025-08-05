const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * Fetch release data from GitHub and save as static JSON files
 * This avoids CORS issues by pre-fetching data at build time
 */

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
      
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('🔄 Fetching OpenHD release data...');
  
  try {
    // Create static directory if it doesn't exist
    const staticDir = path.join(__dirname, '..', 'static', 'api');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    // Fetch stable releases
    console.log('📦 Fetching stable releases...');
    const stableData = await fetchJson('https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/Json/OpenHD-download-index.json');
    fs.writeFileSync(
      path.join(staticDir, 'stable-releases.json'), 
      JSON.stringify(stableData, null, 2)
    );
    console.log('✅ Stable releases saved');
    
    // Fetch development releases
    console.log('🧪 Fetching development releases...');
    const devData = await fetchJson('https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/Json/OpenHD-development-releases.json');
    fs.writeFileSync(
      path.join(staticDir, 'development-releases.json'), 
      JSON.stringify(devData, null, 2)
    );
    console.log('✅ Development releases saved');
    
    // Create a metadata file with fetch timestamp
    const metadata = {
      lastUpdated: new Date().toISOString(),
      stableCount: stableData.os_list.reduce((acc, cat) => acc + cat.subitems.length, 0),
      devCount: devData.os_list.reduce((acc, cat) => acc + cat.subitems.length, 0)
    };
    
    fs.writeFileSync(
      path.join(staticDir, 'releases-metadata.json'), 
      JSON.stringify(metadata, null, 2)
    );
    
    console.log('🎉 All release data fetched successfully!');
    console.log(`📊 Stable releases: ${metadata.stableCount}`);
    console.log(`🧪 Development releases: ${metadata.devCount}`);
    console.log(`🕒 Last updated: ${metadata.lastUpdated}`);
    
  } catch (error) {
    console.error('❌ Error fetching release data:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fetchJson };