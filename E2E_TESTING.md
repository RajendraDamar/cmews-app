# E2E Testing Documentation for CMEWS App

This document provides comprehensive testing coverage for all buttons, functions, hooks, and UI elements in the CMEWS app.

## Test Setup

The tests use Playwright to verify functionality across both mobile (375x667) and desktop (1920x1080) screen sizes.

### Running Tests

```bash
# Run all tests (both mobile and desktop)
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run only mobile tests
npm run test:mobile

# Run only desktop tests
npm run test:desktop

# View test report
npm run test:report
```

## Test Coverage

### 1. Authentication Screens (`e2e/auth.spec.ts`)

**Login Screen:**
- ✅ Display of login form elements (title, description, inputs, buttons)
- ✅ Email and password input functionality
- ✅ Navigation to register screen
- ✅ Login button navigation to main app

**Register Screen:**
- ✅ Display of registration form elements
- ✅ Name, email, and password input functionality
- ✅ Navigation back to login screen
- ✅ Registration button navigation to main app

### 2. Home/Weather Screen (`e2e/home.spec.ts`)

**Core Features:**
- ✅ Loading skeleton display
- ✅ Location selector display and interaction
- ✅ Hero card with weather information (temperature, description)
- ✅ Quick stats cards (humidity, wind speed, feels like)
- ✅ Pull-to-refresh functionality
- ✅ Hourly forecast display
- ✅ Detailed metrics (pressure, visibility, wind)
- ✅ Daily forecast display

**Responsive Design:**
- ✅ Mobile view (vertical stacking)
- ✅ Desktop view (horizontal layout)

### 3. Forecast Screen (`e2e/forecast.spec.ts`)

**Tab Navigation:**
- ✅ Display of all 4 tabs (Cuaca, Angin, Gelombang, Arus)
- ✅ Switching between tabs
- ✅ Tab icons display

**Weather Tab:**
- ✅ Display of forecast cards for multiple days
- ✅ Expandable day cards interaction

**Wind Tab:**
- ✅ Wind forecast data display
- ✅ Wind speed and direction information

**Wave Tab:**
- ✅ Wave forecast data display
- ✅ Wave height information

**Current/Arus Tab:**
- ✅ Current forecast data display
- ✅ Current speed and direction information

**General Features:**
- ✅ Scrollable content
- ✅ Tab state persistence
- ✅ Responsive design (mobile and desktop)

### 4. Maps Screen (`e2e/maps.spec.ts`)

**Map Display:**
- ✅ Map or map placeholder display
- ✅ Map controls (zoom in/out buttons)

**Weather Reports:**
- ✅ Add report button
- ✅ Report form dialog/modal opening
- ✅ Weather report markers on map
- ✅ Report details view on marker click

**Controls:**
- ✅ Search functionality
- ✅ Weather layer toggle
- ✅ Severity filters
- ✅ Close buttons for modals/sheets

**Interactions:**
- ✅ Zoom in functionality
- ✅ Zoom out functionality

**Responsive Design:**
- ✅ Desktop sidebar view
- ✅ Mobile bottom sheet view
- ✅ Responsive map container

### 5. Settings Screen (`e2e/settings.spec.ts`)

**Display Sections:**
- ✅ Settings page title
- ✅ Appearance section
- ✅ Notifications section
- ✅ Location section
- ✅ Units section
- ✅ Language section
- ✅ About section

**Interactive Elements:**
- ✅ Dark mode toggle switch
- ✅ Notification toggle switch
- ✅ Location permission toggle switch
- ✅ Privacy link navigation
- ✅ Logout button navigation
- ✅ Temperature unit display
- ✅ Language display
- ✅ Version display

**General Features:**
- ✅ Scrollable content
- ✅ Chevron icons for clickable rows
- ✅ Responsive design (mobile and desktop)

### 6. Privacy Screen (`e2e/settings.spec.ts`)

**Content Display:**
- ✅ Privacy policy title
- ✅ Privacy policy content
- ✅ Key privacy points listing

**Navigation:**
- ✅ Back navigation
- ✅ Scrollable content
- ✅ Responsive design

### 7. Navigation (`e2e/navigation.spec.ts`)

**Tab Bar:**
- ✅ Tab bar visibility
- ✅ All main tabs present (Home, Forecast, Maps)
- ✅ Tab navigation between screens
- ✅ State persistence when switching tabs
- ✅ Tab icons display
- ✅ Active tab highlighting

**Header:**
- ✅ Header title display
- ✅ Settings navigation from header

**Error Handling:**
- ✅ 404 page handling
- ✅ Network error graceful degradation

**Responsive Design:**
- ✅ Mobile tab bar
- ✅ Desktop navigation

## Screen Size Testing

### Mobile (375x667)
All tests run on mobile viewport to ensure:
- Proper layout stacking
- Touch-friendly button sizes
- Bottom tab bar visibility
- Bottom sheet modals
- Scrollable content

### Desktop (1920x1080)
All tests run on desktop viewport to ensure:
- Horizontal layout optimization
- Sidebar navigation
- Modal dialogs
- Proper spacing and margins
- Desktop-optimized controls

## Components Tested

### UI Components
- ✅ Button (all variants: default, destructive, outline, secondary, ghost, link)
- ✅ Input fields (text, email, password)
- ✅ Switch/Toggle controls
- ✅ Cards (Card, CardHeader, CardTitle, CardDescription, CardContent)
- ✅ Tabs (TabsList, TabsTrigger, TabsContent)
- ✅ Dialog/Modal
- ✅ Bottom Sheet
- ✅ Skeleton loaders

### Custom Components
- ✅ LocationSelector
- ✅ HeroCard
- ✅ QuickStats
- ✅ HourlyForecastCard
- ✅ DetailedMetrics
- ✅ DailyForecastCard
- ✅ ExpandableDayCard
- ✅ WindCard
- ✅ WaveCard
- ✅ CurrentCard
- ✅ SeverityMarker
- ✅ ReportBottomSheet
- ✅ ReportFormDialog

### Hooks Tested
- ✅ useTheme (theme switching)
- ✅ useBreakpoint (responsive design)
- ✅ useRouter (navigation)
- ✅ useState (form inputs, toggles)
- ✅ useEffect (data loading)

## Known Limitations

1. **Map Testing**: Full map interactions are limited on web platform. Tests verify map container presence and basic controls.
2. **Pull-to-Refresh**: Web implementation of pull-to-refresh is tested via reload functionality.
3. **Animations**: Reanimated animations work differently on web vs native. Tests verify presence of elements, not animation smoothness.
4. **Gestures**: Complex gestures (swipe, pinch) are not fully testable on web platform.

## Test Results Location

- Test results: `test-results/`
- HTML report: `playwright-report/`
- Screenshots (on failure): `test-results/*/screenshots/`

## Next Steps

To run these tests:

1. Start the web server: `npm run web`
2. In another terminal, run tests: `npm test`
3. View results: `npm run test:report`

## Continuous Integration

These tests can be integrated into CI/CD pipeline:

```yaml
- name: Install dependencies
  run: npm ci
  
- name: Install Playwright browsers
  run: npx playwright install --with-deps
  
- name: Run tests
  run: npm test
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```
