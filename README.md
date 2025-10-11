# CMEWS App

Community-based Early Warning System for Weather Monitoring

## 🎉 Latest Update - October 2025

### Metro Bundler Fix - Now Supporting All Platforms!

The app now runs smoothly on **web, iOS, and Android** with a comprehensive fix for the Metro bundler tslib error.

**Quick Start:**
```bash
# Validate the fix
./test-metro-fix.sh

# Start development
npx expo start --web --clear
```

**Documentation:**
- [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) - Visual explanation
- [METRO_FIX_SUMMARY.md](./METRO_FIX_SUMMARY.md) - Quick reference
- [markdown/METRO_TSLIB_FIX.md](./markdown/METRO_TSLIB_FIX.md) - Technical details

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

### Platform-Specific Commands

```bash
# Web
npx expo start --web

# Android
npx expo start --android

# iOS
npx expo start --ios
```

## 📱 Platform Support

| Platform | Status | Details |
|----------|--------|---------|
| Web | ✅ Working | Full feature support with animations |
| Android | ✅ Working | Native performance optimization |
| iOS | ✅ Working | Native performance optimization |

## 🏗️ Tech Stack

### Core
- **Expo** (SDK 54) - Cross-platform development
- **React Native** - Mobile framework
- **TypeScript** - Type safety

### UI & Styling
- **NativeWind** - Tailwind CSS for React Native
- **React Native Reusables** - UI component library
- **Lucide Icons** - Icon library

### Animation
- **Moti** - Declarative animations (web + native)
- **React Native Reanimated** - Advanced animations
- **Framer Motion** - Web animations (via Moti)

### Navigation & State
- **Expo Router** - File-based routing
- **Zustand** - State management

### Maps & Charts
- **MapLibre** - Native maps (@maplibre/maplibre-react-native)
- **react-map-gl** - Web maps
- **Victory Native** - Charts and data visualization

### Backend
- **Firebase** - Authentication and data storage

## 📁 Project Structure

```
cmews-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.tsx      # Home/Dashboard
│   │   ├── forecast.tsx   # Weather forecast
│   │   └── maps.tsx       # Weather maps
│   └── (auth)/            # Authentication
│       ├── login.tsx
│       └── register.tsx
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   ├── weather/          # Weather-specific
│   ├── forecast/         # Forecast components
│   └── maps/             # Map components
├── lib/                  # Utilities and types
├── store/                # Zustand stores
├── markdown/             # Documentation
└── metro.config.js       # Metro bundler config
```

## 🔧 Configuration

### Metro Bundler (metro.config.js)

The app uses a custom Metro resolver to handle tslib properly:

```javascript
// Forces tslib to use CommonJS version for compatibility
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib' || moduleName.startsWith('tslib/')) {
    return {
      filePath: path.join(context.projectRoot, 'node_modules/tslib/tslib.js'),
      type: 'sourceFile'
    };
  }
  // Default resolver for other modules
};
```

See [METRO_FIX_SUMMARY.md](./METRO_FIX_SUMMARY.md) for details.

### Babel (babel.config.js)

```javascript
module.exports = {
  presets: [
    ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    'nativewind/babel'
  ],
  plugins: [
    'react-native-reanimated/plugin'  // Must be last
  ]
};
```

## 🧪 Testing & Validation

### Automated Testing
```bash
# Run comprehensive validation
./test-metro-fix.sh
```

This validates:
- Metro configuration
- tslib resolution
- TypeScript compilation
- Linting
- Web export

### Manual Testing
```bash
# Lint
npm run lint

# Format
npm run format

# TypeScript check
npx tsc --noEmit
```

## 🏗️ Building for Production

### Web
```bash
npx expo export --platform web
```

### Native (iOS/Android)
```bash
npx expo prebuild
```

## 📚 Documentation

### Quick Reference
- [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) - Visual diagrams and explanations
- [METRO_FIX_SUMMARY.md](./METRO_FIX_SUMMARY.md) - Metro fix overview

### Detailed Guides
- [markdown/METRO_TSLIB_FIX.md](./markdown/METRO_TSLIB_FIX.md) - Technical deep dive
- [markdown/README.md](./markdown/README.md) - Documentation index
- [CHANGES.md](./CHANGES.md) - Change history

### Implementation Details
- [markdown/IMPLEMENTATION.md](./markdown/IMPLEMENTATION.md) - Feature implementation
- [markdown/FRAMER_MOTION_REMOVAL_SUMMARY.md](./markdown/FRAMER_MOTION_REMOVAL_SUMMARY.md) - Animation strategy

## 🐛 Troubleshooting

### Metro bundler errors

1. Clear cache:
   ```bash
   npx expo start --clear
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Run validation:
   ```bash
   ./test-metro-fix.sh
   ```

### Common Issues

**"Cannot destructure '__extends' of 'tslib.default'"**
- Fixed by custom Metro resolver (already implemented)
- See [METRO_FIX_SUMMARY.md](./METRO_FIX_SUMMARY.md)

**Web bundle not loading**
- Clear Metro cache: `npx expo start --clear`
- Check browser console for errors

**Native build issues**
- Run: `npx expo prebuild --clean`
- Rebuild native projects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- All contributors

---

## 📞 Support

For issues or questions:
- Check [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) for common problems
- Review [markdown/](./markdown/) documentation
- Open an issue on GitHub

---

**Built with ❤️ using Expo and React Native**
