# CMEWS App

Community-based Early Warning System for Weather Monitoring

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
expo start
```

### Platform-Specific Commands

```bash
# Web
expo start --web

# Android
expo start --android

# iOS
expo start --ios
```

## 📱 Platform Support

| Platform | Status | Details |
|----------|--------|---------|
| Web | ✅ Working | Full feature support |
| Android | ✅ Working | Native performance |
| iOS | ✅ Working | Native performance |

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
- **React Native Reanimated** - Smooth animations

### Navigation & State
- **Expo Router** - File-based routing
- **Zustand** - State management

### Maps & Charts
- **MapLibre** - Maps (@maplibre/maplibre-react-native)
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
└── markdown/             # Documentation
```

## 🔧 Configuration

### Metro Bundler (metro.config.js)

Simple configuration using Expo defaults with NativeWind:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
```

### Babel (babel.config.js)

Standard Expo configuration with NativeWind and Reanimated:

```javascript
module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

## 🧪 Testing & Validation

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
expo export --platform web
```

### Native (iOS/Android)
```bash
expo prebuild
```

## 📚 Documentation

See the [markdown/](./markdown/) directory for detailed documentation:
- Implementation guides
- Feature documentation
- Architecture decisions

## 🐛 Troubleshooting

### Metro bundler errors

1. Clear cache:
   ```bash
   expo start --clear
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Common Issues

**Web bundle not loading**
- Clear Metro cache: `expo start --clear`
- Check browser console for errors

**Native build issues**
- Run: `expo prebuild --clean`
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

**Built with ❤️ using Expo and React Native**
