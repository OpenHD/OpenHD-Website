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

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/OpenHD/OpenHD-Website.git
cd OpenHD-Website

# Install dependencies
npm install

# Start development server
npm start
```

### Building for Production

```bash
# Build static files
npm run build

# Serve built files locally
npm run serve
```

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
2. Run `npm run docusaurus docs:version X.X` 
3. Assets go in `static/img/assets/vX-X/`

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve built files
- `npm run clear` - Clear cache
- `npm run swizzle` - Eject components for customization

### Asset Migration
Use the included PowerShell script to migrate external assets:

```powershell
powershell -ExecutionPolicy Bypass -File migrate-assets.ps1
```

## 🚀 Deployment

This site is designed to be deployed on:
- **GitHub Pages** (recommended)
- Netlify
- Vercel
- Any static hosting service

### GitHub Pages Deployment

The site includes GitHub Actions workflow for automatic deployment. Simply push to the main branch.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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
