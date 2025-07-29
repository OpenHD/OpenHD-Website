import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const generateSocialCard = async (title, description, filename) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 630 });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          width: 1200px;
          height: 630px;
          background: linear-gradient(135deg, #2e8b57 0%, #228b22 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          padding: 60px;
        }
        .logo-container {
          display: flex;
          align-items: center;
          margin-bottom: 40px;
        }
        .logo {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          font-size: 32px;
          font-weight: bold;
          color: #2e8b57;
        }
        .brand {
          font-size: 32px;
          font-weight: bold;
          color: white;
        }
        .title {
          font-size: 48px;
          font-weight: bold;
          text-align: center;
          margin: 0 0 20px 0;
          line-height: 1.2;
          max-width: 1000px;
        }
        .description {
          font-size: 24px;
          text-align: center;
          margin: 0;
          opacity: 0.9;
          line-height: 1.4;
          max-width: 800px;
        }
        .footer {
          position: absolute;
          bottom: 40px;
          right: 40px;
          font-size: 18px;
          opacity: 0.8;
        }
        .decoration1 {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }
        .decoration2 {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
        }
      </style>
    </head>
    <body>
      <div class="logo-container">
        <div class="logo">HD</div>
        <div class="brand">OpenHD</div>
      </div>
      <h1 class="title">${title}</h1>
      ${description ? `<p class="description">${description}</p>` : ''}
      <div class="footer">Open Source Digital FPV Ecosystem</div>
      <div class="decoration1"></div>
      <div class="decoration2"></div>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  
  const outputDir = path.join(process.cwd(), 'static', 'img', 'social-cards');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, `${filename}.png`);
  await page.screenshot({ path: outputPath, fullPage: true });
  
  await browser.close();
  console.log(`Generated social card: ${outputPath}`);
};

// Generiere verschiedene Social Cards
const cards = [
  {
    title: 'OpenHD Documentation',
    description: 'Complete guide for setting up and using OpenHD digital FPV system',
    filename: 'docs-default'
  },
  {
    title: 'Installation Guide',
    description: 'Step-by-step instructions to get OpenHD running on your system',
    filename: 'installation-guide'
  },
  {
    title: 'Hardware Setup',
    description: 'Choose the right components for your OpenHD build',
    filename: 'hardware-setup'
  },
  {
    title: 'Downloads',
    description: 'Get the latest OpenHD images and software packages',
    filename: 'downloads'
  },
  {
    title: 'OpenHD Features',
    description: 'Discover what makes OpenHD the best open source FPV solution',
    filename: 'features'
  }
];

// Generiere alle Cards
for (const card of cards) {
  await generateSocialCard(card.title, card.description, card.filename);
}

console.log('All social cards generated successfully!');