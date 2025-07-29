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
  projectName: 'UnifiedOpenHDWebsite', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/OpenHD/UnifiedOpenHDWebsite/edit/main/docusaurus-website/',
          // Versioning configuration
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Evo (Latest)',
              path: '/',
            },
            '2.0': {
              label: '2.0',
              path: '/2.0',
            },
          },
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
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'OpenHD',
      logo: {
        alt: 'OpenHD Logo',
        src: 'img/OpenHD-Logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
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
          href: 'https://github.com/OpenHD',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.youtube.com/@OpenHD-Official',
          label: 'YouTube',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'OpenHD Logo',
        src: 'img/OpenHD-Logo.png',
        href: '/',
        width: 180,
      },
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
                <a href="mailto:openhd@openhdfpv.org" 
                   style="display: inline-flex; align-items: center; gap: 8px; 
                          background: linear-gradient(135deg, #2e8b57, #228b22); 
                          color: white; padding: 12px 20px; 
                          border-radius: 8px; text-decoration: none; font-weight: 500;
                          transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                          transform: translateY(0px);"
                   onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(46, 139, 87, 0.4)'; this.style.background='linear-gradient(135deg, #32a05f, #2e8b57)';"
                   onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.2)'; this.style.background='linear-gradient(135deg, #2e8b57, #228b22)';">
                  <i class="fas fa-envelope"></i>
                  openhd@openhdfpv.org
                </a>
              `,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenHD Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
