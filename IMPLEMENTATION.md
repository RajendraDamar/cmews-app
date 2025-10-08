# CMEWS App - Implementation Documentation

## Overview
This React Native app implements a Google Play Store-style navigation with MapLibre integration, following modern mobile app design patterns.

## Features Implemented

### 1. Authentication Flow
- **Login Screen** (`app/(auth)/login.tsx`)
  - Email and password inputs
  - Navigation to registration
  - Mock authentication (redirects to main app)

- **Register Screen** (`app/(auth)/register.tsx`)
  - Full name, email, and password inputs
  - Navigation to login
  - Mock authentication

### 2. Main Navigation (Google Play Store Style)
- **3 Bottom Tabs** (Mobile)
  - Games & Apps (`app/(tabs)/index.tsx`)
  - Books (`app/(tabs)/books.tsx`)
  - Maps (`app/(tabs)/maps.tsx`)

- **Header**
  - Profile icon button (right side)
  - Navigates to settings

### 3. Maps Integration
- **MapLibre GL** for native platforms
- **Search Functionality**
  - Search bar overlay
  - Mock place data
  - Real-time search filtering

- **Place Cards**
  - Place details
  - Directions button
  - Save button

- **Platform Support**
  - Native: Full MapLibre integration
  - Web: Fallback message (MapLibre requires native platform)

### 4. Settings & Privacy
- **Settings Screen** (`app/settings.tsx`)
  - Dark mode toggle
  - Notifications toggle
  - Privacy navigation
  - Sign out functionality

- **Privacy Screen** (`app/privacy.tsx`)
  - Placeholder privacy policy

### 5. Responsive Design
- **Breakpoints Utility** (`lib/breakpoints.ts`)
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: >= 1024px

- **Adaptive Layouts**
  - Search bar and place cards adjust width based on screen size

### 6. Mock Data
- **Constants** (`constants/mock-data.ts`)
  - Apps/Games data
  - Books data
  - Map places (NYC locations)

## Technology Stack

### Dependencies Added
- `@maplibre/maplibre-react-native` - Map rendering
- `react-native-svg` - SVG support for MapLibre
- `@expo/vector-icons` - Icons (Ionicons)
- `zustand` - State management (already installed)

### UI Components
- React Native Reusables (already configured)
- NativeWind (Tailwind CSS for React Native)
- Custom components:
  - SearchBar
  - PlaceCard

## Project Structure

```
app/
├── (auth)/              # Authentication flow
│   ├── _layout.tsx      # Auth stack navigator
│   ├── login.tsx        # Login screen
│   └── register.tsx     # Registration screen
├── (tabs)/              # Main app tabs
│   ├── _layout.tsx      # Tab navigator with 3 tabs
│   ├── index.tsx        # Games/Apps screen
│   ├── books.tsx        # Books screen
│   └── maps.tsx         # Maps screen with MapLibre
├── settings.tsx         # Settings screen
└── privacy.tsx          # Privacy policy screen

components/
├── maps/
│   ├── search-bar.tsx   # Map search component
│   └── place-card.tsx   # Place details card
└── ui/                  # Reusable UI components (pre-existing)

constants/
└── mock-data.ts         # Mock data for demos

lib/
└── breakpoints.ts       # Responsive design utilities
```

## Navigation Flow

1. **App Start** → Auth Screen (Login)
2. **After Login** → Main Tabs (Games/Apps)
3. **Tab Navigation** → Games, Books, Maps
4. **Profile Button** → Settings
5. **Settings** → Privacy or Sign Out → Back to Login

## Key Design Patterns

### 1. Expo Router File-based Routing
- Groups: `(auth)`, `(tabs)`
- Dynamic layouts per group
- Stack and Tab navigators

### 2. Platform-specific Code
- MapLibre conditionally loaded on native platforms
- Web fallback for map view

### 3. Responsive Design
- useWindowDimensions hook
- Conditional styling based on screen width
- Breakpoint utilities for consistent sizing

### 4. Component Composition
- Reusable UI components
- Separation of concerns
- Mock data for demonstration

## Running the App

### Web (Preview)
```bash
npm run web
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Next Steps for Production

1. **Authentication**
   - Integrate real authentication (Firebase Auth already configured)
   - Add form validation
   - Add loading states

2. **Maps**
   - Connect to real mapping API (MapLibre with custom tile server)
   - Add geolocation
   - Implement directions API

3. **Desktop Layout**
   - Implement side navigation drawer
   - Optimize for larger screens

4. **Data**
   - Replace mock data with real APIs
   - Add data fetching with React Query or SWR
   - Implement caching

5. **Features**
   - Search functionality across all tabs
   - User profiles
   - Favorites/bookmarks
   - Push notifications

## Notes

- Initial route is set to `(auth)` for authentication flow
- MapLibre requires native platform; web shows fallback message
- All screens use NativeWind for styling
- Dark mode toggle in settings is UI-only (not yet connected to theme)
