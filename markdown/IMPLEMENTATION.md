# CMEWS App - Implementation Documentation

## Overview
This React Native app implements a Google Play Store-style navigation with MapLibre integration, following modern mobile app design patterns and using React Native Reusables components.

## Features Implemented

### 1. Authentication Flow (Updated with React Native Reusables)
- **Login Screen** (`app/(auth)/login.tsx`)
  - Card-based authentication UI
  - Input components from react-native-reusables
  - Email and password inputs
  - Navigation to registration
  - Mock authentication (redirects to main app)

- **Register Screen** (`app/(auth)/register.tsx`)
  - Card-based authentication UI
  - Input components from react-native-reusables
  - Full name, email, and password inputs
  - Navigation to login
  - Mock authentication

### 2. Main Navigation (Google Play Store Style)
- **3 Bottom Tabs** (Mobile)
  - Games & Apps (`app/(tabs)/index.tsx`)
  - Books with sub-tabs (`app/(tabs)/books/`)
  - Maps (`app/(tabs)/maps.tsx`)

- **Header**
  - Profile icon button (right side)
  - Profile modal (Google-style) with:
    - User profile display
    - Settings navigation
    - Privacy navigation
    - Help & Support option
    - Sign out functionality

### 3. Books Tab with Material Top Tabs
- **4 Sub-Categories** (Material Top Tabs)
  - For You (`app/(tabs)/books/for-you.tsx`) - Recommended books
  - Top Charts (`app/(tabs)/books/top-charts.tsx`) - Ranked by rating
  - Categories (`app/(tabs)/books/categories.tsx`) - Browse by genre
  - Popular (`app/(tabs)/books/popular.tsx`) - All books

### 4. Maps Integration
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
  - Native: Full MapLibre integration with error handling
  - Web: Fallback message (MapLibre requires native platform)

### 5. Settings & Privacy
- **Settings Screen** (`app/settings.tsx`)
  - Dark mode toggle
  - Notifications toggle
  - Privacy navigation
  - Sign out functionality

- **Privacy Screen** (`app/privacy.tsx`)
  - Placeholder privacy policy

### 6. Responsive Design
- **Breakpoints Utility** (`lib/breakpoints.ts`)
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: >= 1024px

- **Adaptive Layouts**
  - Search bar and place cards adjust width based on screen size

### 7. Mock Data
- **Constants** (`constants/mock-data.ts`)
  - Apps/Games data
  - Books data
  - Map places (NYC locations)

## Technology Stack

### Dependencies Added
- `@maplibre/maplibre-react-native` - Map rendering
- `@react-navigation/material-top-tabs` - Material top tabs for books
- `react-native-pager-view` - Required for material top tabs
- `@rn-primitives/portal` - Portal support for modals
- `react-native-svg` - SVG support for MapLibre
- `@expo/vector-icons` - Icons (Ionicons)
- `zustand` - State management (already installed)

### UI Components & Configuration
- **React Native Reusables** (fully configured)
  - All doctor checks passing
  - Theme configuration in `lib/theme.ts`
  - Utils in `lib/utils.ts`
  - CSS variables in `global.css`
  - Tailwind config using CSS variables
  - PortalHost in root layout
  - Metro config with inlineRem: 16
  
- **Custom Components**
  - ProfileModal - Google-style profile menu
  - SearchBar - Map search component
  - PlaceCard - Place details card

## Project Structure

```
app/
├── (auth)/              # Authentication flow
│   ├── _layout.tsx      # Auth stack navigator
│   ├── login.tsx        # Login screen with Card UI
│   └── register.tsx     # Registration screen with Card UI
├── (tabs)/              # Main app tabs
│   ├── _layout.tsx      # Tab navigator with 3 tabs + profile modal
│   ├── index.tsx        # Games/Apps screen
│   ├── books/           # Books tab with Material Top Tabs
│   │   ├── _layout.tsx  # Material Top Tabs navigator
│   │   ├── for-you.tsx  # Recommended books
│   │   ├── top-charts.tsx  # Top rated books
│   │   ├── categories.tsx  # Browse by category
│   │   └── popular.tsx     # Popular books
│   └── maps.tsx         # Maps screen with MapLibre
├── settings.tsx         # Settings screen
└── privacy.tsx          # Privacy policy screen

components/
├── maps/
│   ├── search-bar.tsx   # Map search component
│   └── place-card.tsx   # Place details card
├── profile-modal.tsx    # Google-style profile modal
└── ui/                  # React Native Reusables components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── text.tsx
    ├── badge.tsx
    └── separator.tsx

constants/
└── mock-data.ts         # Mock data for demos

lib/
├── breakpoints.ts       # Responsive design utilities
├── theme.ts            # Theme colors (light/dark)
└── utils.ts            # cn() utility function
```

## Navigation Flow

1. **App Start** → Auth Screen (Login with Card UI)
2. **After Login** → Main Tabs (Games/Apps)
3. **Tab Navigation** → Games, Books (with 4 sub-tabs), Maps
4. **Profile Button** → Profile Modal → Settings/Privacy/Sign Out
5. **Books Tab** → Material Top Tabs (For You, Top Charts, Categories, Popular)
6. **Settings** → Privacy or Sign Out → Back to Login

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
   - Add password recovery

2. **Maps**
   - Connect to real mapping API (MapLibre with custom tile server)
   - Add geolocation
   - Implement directions API
   - Test MapLibre rendering on native devices

3. **Books Tab**
   - Connect to real book API
   - Add book details screens
   - Implement search functionality
   - Add filtering and sorting

4. **Desktop Layout**
   - Implement side navigation drawer
   - Optimize for larger screens
   - Add responsive layouts for tablets

5. **Data**
   - Replace mock data with real APIs
   - Add data fetching with React Query or SWR
   - Implement caching strategies

6. **Profile**
   - Add user profile editing
   - Add avatar upload
   - Implement user preferences

## Configuration Completed

### React Native Reusables
All configuration checks are passing:
- ✅ Theme files configured (`lib/theme.ts`)
- ✅ Utils configured (`lib/utils.ts`)
- ✅ Metro config with `inlineRem: 16`
- ✅ PortalHost added to root layout
- ✅ CSS variables in `global.css`
- ✅ Tailwind config using CSS variables

### Verified with:
```bash
npx @react-native-reusables/cli doctor
# ✔ All checks passed.
```

## Notes

- Initial route is set to `(auth)` for authentication flow
- MapLibre requires native platform; web shows fallback message with proper error handling
- All screens use NativeWind for styling with CSS variables
- Authentication screens now use Card-based UI from react-native-reusables
- Profile modal follows Google's design pattern with quick access to settings
- Books tab has 4 sub-categories using Material Top Tabs
- Dark mode toggle in settings is UI-only (not yet connected to theme)
- React Native Reusables CLI doctor reports all checks passing
