import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OpenHD',
  tagline: 'Open source digital FPV ecosystem',
  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://openhdfpv.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'OpenHD', // Usually your GitHub org/user name.
  projectName: 'OpenHD-Website', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Custom meta tags for better social media sharing
  headTags: [
    // Open Graph meta tags
    {
      tagName: 'meta',
      attributes: {
        property: 'og:title',
        content: 'OpenHD - Open Source Digital FPV Ecosystem',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content: 'Professional digital FPV system for drones and RC aircraft. High-quality video transmission, telemetry, and ground station software.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image',
        content: 'https://openhdfpv.org/img/social-cards/openhd-default.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:width',
        content: '1200',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:height',
        content: '630',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:url',
        content: 'https://openhdfpv.org/',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'OpenHD',
      },
    },
    // Twitter Card meta tags
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'OpenHD - Open Source Digital FPV Ecosystem',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:description',
        content: 'Professional digital FPV system for drones and RC aircraft. High-quality video transmission, telemetry, and ground station software.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:image',
        content: 'https://openhdfpv.org/img/social-cards/openhd-default.png',
      },
    },
    // Additional meta tags
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'OpenHD is an open source digital FPV ecosystem for professional drone and RC aircraft applications. Features high-quality video transmission, comprehensive telemetry, and advanced ground station software.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'OpenHD, FPV, digital video transmission, drone, RC aircraft, open source, telemetry, ground station, HD video, WiFi FPV',
      },
    },
    // Add structured data for better SEO
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "OpenHD",
        "description": "Open source digital FPV ecosystem for professional drone and RC aircraft applications",
        "url": "https://openhdfpv.org",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": ["Linux", "Windows", "Android"],
        "softwareVersion": "2.6.4-evo",
        "author": {
          "@type": "Organization",
          "name": "OpenHD Community"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "screenshot": "https://openhdfpv.org/img/social-cards/openhd-default.svg"
      }),
    },
    // Add canonical link
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: 'https://openhdfpv.org/',
      },
    },
    // Add manifest for PWA
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    },
    // Theme color for mobile browsers
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#00a6f2',
      },
    },
    // Robots meta
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/OpenHD/OpenHD-Website/edit/main/docusaurus-website/',
          // Versioning configuration
          lastVersion: 'current',
          includeCurrentVersion: true,
          versions: {
            current: {
              label: 'Evo (Latest)',
              path: '/',
              banner: 'none',
            },
            '2.0': {
              label: '2.0 (Legacy)',
              path: '/2.0',
              banner: 'unmaintained',
            },
          },
          // Show h4 headings in table of contents (perfect for FAQ)
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        // Whether to search in pages, default is false
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        explicitSearchResultPath: true,
      },
    ],
    // OpenHD Social Cards Plugin
    [
      '@acid-info/docusaurus-og',
      {
        path: './social-cards', // relative to the build directory
        imageRenderers: {
          'docusaurus-plugin-content-docs': require('./src/lib/ImageRenderers').docs,
          'docusaurus-plugin-content-pages': require('./src/lib/ImageRenderers').pages,
          // 'docusaurus-plugin-content-blog': require('./src/lib/ImageRenderers').blog,
        },
      },
    ],
    // Official Docusaurus ideal image plugin with modern formats
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 80,
        max: 1920, // max resized image width
        min: 640,  // min resized image width  
        steps: 3,  // number of generated widths between min and max
        disableInDev: false, // enable in development for testing
      },
    ],
    // Image zoom plugin with better compatibility
    [
      'docusaurus-plugin-image-zoom',
      {
        // options
        selector: '.markdown :not(em) > img, .theme-doc-markdown :not(em) > img, .theme-doc-markdown picture img',
        config: {
          // medium-zoom options
          margin: 24,
          scrollOffset: 0,
          background: 'rgba(25, 25, 25, 0.9)',
          container: {
            top: 80,
            bottom: 80,
          }
        },
      },
    ],
    // Simple image processing and captions
    () => ({
      name: 'openhd-image-enhancement-plugin',
      getClientModules() {
        return [
          require.resolve('./src/components/AutoCaptions.js'),
          require.resolve('./src/components/ModernImageLoader.js'),
          require.resolve('./src/components/EnhancedMobileSearch.js'),
          require.resolve('./src/components/FooterFunding/FooterFunding.tsx'),
          require.resolve('./src/components/FooterButtons/FooterButtonsInjector.tsx')
          // GitHub Stars handled by React Context in Root.tsx
          // Funding Widget uses optimized DOM injection
          // Footer Buttons use proper React Links for SPA navigation
        ];
      },
    }),
  ],

  markdown: {
    mermaid: true,
  },
  
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-cards/openhd-default.png',
    zoom: {
      selector: '.markdown :not(em) > img, .theme-doc-markdown :not(em) > img',
      background: {
        light: 'rgba(255, 255, 255, 0.9)',
        dark: 'rgba(25, 25, 25, 0.9)',
      },
      config: {
        // medium-zoom options
        margin: 24,
        scrollOffset: 80,
        container: {
          top: 80,
          bottom: 80,
        }
      },
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OpenHD',
      logo: {
        alt: 'OpenHD Logo',
        src: 'img/OpenHD-Logo.png',
      },
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/downloads',
          label: 'Downloads',
          position: 'left',
        },
        {
          to: '/changelog',
          label: 'Changelog',
          position: 'left',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/OpenHD/OpenHD',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'dropdown',
          label: 'Community',
          position: 'right',
          items: [
            {
              html: '<i class="fab fa-telegram"></i> Telegram',
              href: 'https://t.me/OpenHD_User',
            },
            {
              html: '<i class="fab fa-discord"></i> Discord', 
              href: 'https://discord.gg/P9kXs9N2RP',
            },
            {
              html: '<i class="fab fa-youtube"></i> YouTube',
              href: 'https://www.youtube.com/@OpenHD-Official',
            },
            {
              html: '<i class="fab fa-facebook"></i> Facebook',
              href: 'https://www.facebook.com/groups/openhd',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'OpenHD',
          items: [
            {
              html: `
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 15px; line-height: 1.6;">
                  Open source digital FPV ecosystem - The ultimate OpenSource Digital Video solution, 
                  which doesn't require a doctors degree.
                </p>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                  <a href="https://www.youtube.com/@OpenHD-Official" target="_blank" rel="noopener noreferrer" 
                     style="color: rgba(255,255,255,0.8); font-size: 24px; text-decoration: none; transition: color 0.2s ease;" 
                     title="YouTube" onmouseover="this.style.color='rgba(255,255,255,1)'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
                    <i class="fab fa-youtube"></i>
                  </a>
                  <a href="https://github.com/OpenHD" target="_blank" rel="noopener noreferrer" 
                     style="color: rgba(255,255,255,0.8); font-size: 24px; text-decoration: none; transition: color 0.2s ease;" 
                     title="GitHub" onmouseover="this.style.color='rgba(255,255,255,1)'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
                    <i class="fab fa-github"></i>
                  </a>
                  <a href="https://t.me/OpenHD_User" target="_blank" rel="noopener noreferrer" 
                     style="color: rgba(255,255,255,0.8); font-size: 24px; text-decoration: none; transition: color 0.2s ease;" 
                     title="Telegram" onmouseover="this.style.color='rgba(255,255,255,1)'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
                    <i class="fab fa-telegram"></i>
                  </a>
                  <a href="https://discord.gg/P9kXs9N2RP" target="_blank" rel="noopener noreferrer" 
                     style="color: rgba(255,255,255,0.8); font-size: 24px; text-decoration: none; transition: color 0.2s ease;" 
                     title="Discord" onmouseover="this.style.color='rgba(255,255,255,1)'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
                    <i class="fab fa-discord"></i>
                  </a>
                  <a href="https://www.facebook.com/groups/openhd" target="_blank" rel="noopener noreferrer" 
                     style="color: rgba(255,255,255,0.8); font-size: 24px; text-decoration: none; transition: color 0.2s ease;" 
                     title="Facebook" onmouseover="this.style.color='rgba(255,255,255,1)'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
                    <i class="fab fa-facebook"></i>
                  </a>
                </div>
              `,
            },
          ],
        },
        {
          title: 'About Us',
          items: [
            {
              label: 'Features',
              to: '/general/features',
            },
            {
              label: 'Downloads',
              to: '/downloads',
            },
            {
              label: 'Team',
              to: '/general/team',
            },
            {
              label: 'Contributing',
              to: '/general/contributing',
            },
          ],
        },
        {
          title: 'Useful Links',
          items: [
            {
              label: 'Documentation',
              to: '/introduction',
            },
            {
              label: 'FAQ',
              to: '/general/faq',
            },
            {
              label: 'First Time Setup',
              to: '/hardware/first-time-setup',
            },
            {
              label: 'Changelog',
              to: '/changelog',
            },
            {
              label: 'Privacy',
              to: '/privacy',
            },
          ],
        },
        {
          title: 'Send us a Message',
          items: [
            {
              html: `
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 15px; line-height: 1.6;">
                  For partnership or business inquiries, simply reach out to us here.
                </p>
                <a href="#" onclick="var e='developers'+'@'+'openhdfpv.org'; window.location.href='mailto:'+e; return false;" 
                   style="display: inline-flex; align-items: center; gap: 8px; 
                          background: linear-gradient(135deg, #2e8b57, #228b22); 
                          color: white; padding: 12px 20px; 
                          border-radius: 8px; text-decoration: none; font-weight: 500;
                          transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                          transform: translateY(0px);"
                   onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(46, 139, 87, 0.4)'; this.style.background='linear-gradient(135deg, #32a05f, #2e8b57)';"
                   onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.2)'; this.style.background='linear-gradient(135deg, #2e8b57, #228b22)';">
                  <i class="fas fa-envelope"></i>
                  <span>developers@openhdfpv.org</span>
                </a>
              `,
            },
          ],
        },
      ],
      copyright: `
        <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px;">
          <!-- Support OpenHD Section -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 25px; background: rgba(255,255,255,0.05); border-radius: 12px; margin: 0 20px;">
            <h3 style="color: #00a6f2; margin: 0; font-size: 1.2rem; font-weight: 600;">Support OpenHD</h3>
            <p style="color: rgba(255,255,255,0.8); text-align: center; margin: 0; line-height: 1.5; max-width: 500px;">
              Help us continue developing OpenHD with your support. Every contribution helps us improve the platform for the entire FPV community.
            </p>
            
            <!-- Funding widget and buttons layout -->
            <div style="display: flex; align-items: center; gap: 25px; width: 100%; max-width: 650px; flex-wrap: wrap; justify-content: center;">
              <div id="footer-funding-widget-main" style="flex: 1; min-width: 300px; max-width: 400px;">
                <!-- Main funding widget will be rendered here by React -->
              </div>
              <div id="footer-buttons-container">
                <!-- Footer buttons will be rendered here by React -->
              </div>
            </div>
          </div>
        </div>
        <!-- OpenHD Logo Section -->
        <div style="display: flex; justify-content: center; margin-bottom: 20px;">
          <a href="/" style="text-decoration: none;">
            <img src="/img/OpenHD-Logo.png" alt="OpenHD Logo" style="width: 180px; height: auto;" />
          </a>
        </div>
        Copyright © ${new Date().getFullYear()} OpenHD Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'shell-session', 'powershell', 'yaml', 'json', 'python', 'cpp', 'c', 'cmake'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
