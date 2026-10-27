# OpenHD Website

Official website and documentation platform for OpenHD - Open Source Digital FPV System.

## 🚀 Features

- **Modern Documentation**: Built with Docusaurus 3.8.1
- **Version Management**: Support for multiple OpenHD versions (Evo Latest & 2.0)
- **Local Search**: Fast client-side search functionality
- **Responsive Design**: Modern FPV-themed UI with HUD elements
- **Community Integration**: Direct links to Discord, Telegram, and other channels
- **Asset Management**: All images and assets locally hosted

## 🏗️ Built With

- [Docusaurus](https://docusaurus.io/) - Static site generator
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [React](https://reactjs.org/) - UI framework
- [@easyops-cn/docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local) - Local search

## 🚀 Quick Start

### Prerequisites

- Node.js 24+
- pnpm 9 (via `corepack enable`)

### Installation

```bash
# Clone the repository
git clone https://github.com/OpenHD/OpenHD-Website.git
cd OpenHD-Website

# Enable corepack (once per machine)
corepack enable

# Install dependencies
pnpm install

# Start development server
pnpm start
```

### Building for Production

```bash
# Build static files
pnpm build

# Serve built files locally
pnpm serve

# Build exactly like the staging site (served under /staging/, noindex)
STAGING=true pnpm build
```

Note: During `pnpm build`, a script converts `.png/.jpg` in `static/img` to `.avif`. Use the `OptimizedImg` component or CSS `image-set(...)` to prefer AVIF with fallback.

## 📁 Project Structure

```
├── docs/                          # Current documentation (Evo Latest)
├── versioned_docs/
│   └── version-2.0/               # Version 2.0 documentation
├── static/
│   └── img/
│       └── assets/                # Images and assets
│           └── v2-0/              # Version-specific assets
├── src/
│   └── pages/                     # Custom pages (Homepage, etc.)
├── docusaurus.config.ts           # Main configuration
└── sidebars.ts                    # Sidebar configuration
```

## 🎨 Customization

### Theme
The site uses a custom FPV-themed design with:
- HUD-style elements and overlays
- OpenHD brand colors
- Responsive navigation
- Animated elements

### Adding New Versions
1. Create documentation in `docs/`
2. Run `pnpm docusaurus docs:version X.X`
3. Assets go in `static/img/assets/vX-X/`

## 🔧 Development

### Available Scripts

- `pnpm start` - Start development server
- `pnpm build` - Build for production
- `pnpm serve` - Serve built files
- `pnpm clear` - Clear cache
- `pnpm swizzle` - Eject components for customization

### Images & Optimization
- AVIF conversion runs at build time for files under `static/img`.
- In React, use `src/components/OptimizedImg.tsx`:
  `
  <OptimizedImg path="/img/logo.png" alt="Logo" />
  `
- In CSS, prefer:
  `
  background-image: image-set(url('/img/hero.avif') type('image/avif'), url('/img/hero.png') type('image/png'));
  `

## 🌿 Branches, CI & Deployment

The site is hosted on **GitHub Pages** at [openhdfpv.org](https://openhdfpv.org). Each branch has exactly one job:

| Branch | Purpose | Published at | Indexed by search engines |
|---|---|---|---|
| `main` | Development / **staging**. All PRs target this branch. | [openhdfpv.org/staging/](https://openhdfpv.org/staging/) | No (`noindex`) |
| `production` | The **live** website. Only updated by promoting `main`. | [openhdfpv.org](https://openhdfpv.org/) | Yes |
| `gh-pages` | Build output only. Written by CI, **never edit by hand**. | – | – |

```
feature branch ──PR──▶ main ──────────PR "Promote to production"──────────▶ production
                        │                                                    │
                        ▼                                                    ▼
              openhdfpv.org/staging/                                   openhdfpv.org/
```

### What CI does (`.github/workflows/deploy.yml`)

- **Pull requests** to `main` or `production`: typecheck + full build. Nothing is deployed.
- **Push to `main` or `production`**: CI builds only the pushed branch (`main` with
  `STAGING=true`). The other half is taken from the current `gh-pages`, then the whole
  `gh-pages` branch is replaced. Pages that were deleted or renamed therefore disappear
  from the live site as well.
- **Caching**: pnpm store and `.image-cache` (AVIF/WebP keyed by content hash). A warm image
  cache cuts the build from ~15–50 min to ~2 min, so keep its path stable.
- Deploys are serialized (`pages-deploy` concurrency group); the build and an offline ZIP of
  the production site are attached to every run as artifacts (7 days).

`STAGING=true` switches `baseUrl` to `/staging/` and sets `noindex`, so staging never competes
with the live site in search results.

### Workflow

1. Branch off `main`, open a PR against `main`.
2. After merge, check the result on [openhdfpv.org/staging/](https://openhdfpv.org/staging/).
3. To go live, open a PR **`main` → `production`** and merge it (fast-forward/merge, no squash).
4. Hotfixes on `production` must be merged back into `main` right away, so both branches don't drift apart.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch from `main` (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request against `main` (never against `production` directly)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [OpenHD Main Repository](https://github.com/OpenHD/OpenHD)
- [OpenHD Discord](https://discord.gg/openhd)
- [OpenHD Telegram](https://t.me/OpenHD_User)
- [OpenHD YouTube](https://www.youtube.com/@OpenHD-FPV)

## 📞 Support

- Join our [Discord community](https://discord.gg/openhd)
- Visit our [Telegram channel](https://t.me/OpenHD_User)
- Check the [documentation](https://docs.openhd.org)

---

Made with ❤️ by the OpenHD Community and Devs
