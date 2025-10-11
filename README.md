# CMEWS App

Community-based Marine and Environmental Weather Service

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Platform-Specific Commands

```bash
# Web
npm run web

# Android
npm run android

# iOS
npm run ios
```

## 📱 Platform Support

| Platform | Status | Details |
|----------|--------|---------|
| Web | ✅ Working | Full feature support, charts show as text |
| Android | ✅ Working | Native performance with full chart rendering |
| iOS | ✅ Working | Native performance with full chart rendering |

## 🏗️ Tech Stack

### Core
- **Expo** (SDK 54) - Cross-platform development
- **React Native** - Mobile framework
- **TypeScript** - Type safety

### UI & Styling
- **NativeWind** - Tailwind CSS for React Native
- **React Native Reusables** - UI component library
- **Lucide Icons** - Icon library

### Navigation & State
- **Expo Router** - File-based routing
- **Zustand** - State management

### Maps & Charts
- **MapLibre** - Maps
- **Victory Native** - Charts (iOS/Android only)

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
└── CHANGES.md            # Complete change history
```

## 🧪 Development

```bash
# Lint code
npm run lint

# Format code
npm run format

# TypeScript check
npx tsc --noEmit
```

## 🏗️ Building for Production

### Web
```bash
npm run build -- --platform web
```

### Native (iOS/Android)
```bash
expo prebuild
```

## 📚 Documentation

- **[CHANGES.md](./CHANGES.md)** - Complete change history and implementation details

## 🐛 Known Issues

### Charts on Web
Victory Native charts use Skia for rendering, which requires CanvasKit on web. To keep bundle size small, charts are disabled on web and data is shown in text format instead.

### Animations on Web  
React Native Reanimated is disabled on web to avoid worklets errors. Web uses CSS animations instead.

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- All contributors

---

**Built with ❤️ using Expo and React Native**
