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
| Web | ✅ Working | Full feature support with fallback chart displays |
| Android | ✅ Working | Native performance with React Native ECharts rendering |
| iOS | ✅ Working | Native performance with React Native ECharts rendering |

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
- **MapLibre** - Interactive maps with weather overlays
- **React Native ECharts** - Cross-platform chart visualization
- **React Native Animated API** - Smooth 60fps animations

### Backend
- **Firebase** - Authentication and data storage
- **BMKG API** - Indonesian weather data (mock data currently)

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
React Native ECharts requires native modules and is disabled on web. On web, charts display simplified data in text/table format for compatibility. Full interactive charts are available on iOS and Android.

### Animations on Web  
React Native Reanimated is used sparingly due to web performance concerns. Most animations use the React Native Animated API for better cross-platform stability.

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- All contributors

---

**Built with ❤️ using Expo and React Native**
