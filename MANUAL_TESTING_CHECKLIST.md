# Manual Testing Checklist for CMEWS App

Use this checklist to manually verify all buttons, functions, hooks, and UI elements on both mobile and desktop screen sizes.

## How to Use This Checklist

1. Open the app in your browser at `http://localhost:8081`
2. For mobile testing: Open browser dev tools (F12) and set viewport to 375x667
3. For desktop testing: Set viewport to 1920x1080 or use full screen
4. Go through each section and check off items as you test them

---

## 🔐 Authentication Screens

### Login Screen
- [ ] **Mobile**: Login screen displays properly
- [ ] **Desktop**: Login screen displays properly
- [ ] "Welcome Back" title is visible
- [ ] "Sign in to your account to continue" subtitle is visible
- [ ] Email input field is present and functional
- [ ] Can type into email field
- [ ] Password input field is present and functional
- [ ] Can type into password field
- [ ] Password is masked (shows dots)
- [ ] "Sign In" button is visible and clickable
- [ ] Clicking "Sign In" navigates to main app
- [ ] "Create Account" button is visible and clickable
- [ ] Clicking "Create Account" navigates to register screen

### Register Screen
- [ ] **Mobile**: Register screen displays properly
- [ ] **Desktop**: Register screen displays properly
- [ ] "Create Account" title is visible
- [ ] "Sign up to get started" subtitle is visible
- [ ] Full Name input field is present and functional
- [ ] Email input field is present and functional
- [ ] Password input field is present and functional
- [ ] "Sign Up" button is visible and clickable
- [ ] Clicking "Sign Up" navigates to main app
- [ ] "Already have an account? Sign In" button is visible
- [ ] Clicking sign in link goes back to login screen

---

## 🏠 Home/Weather Screen

### Initial Load
- [ ] **Mobile**: Screen loads properly
- [ ] **Desktop**: Screen loads properly
- [ ] Loading skeleton appears briefly
- [ ] Data loads and replaces skeleton

### Location Selector
- [ ] Location information displays (Provinsi, Kota, Kecamatan)
- [ ] Last updated time displays
- [ ] Location is interactive (can be clicked)
- [ ] Refresh functionality works

### Hero Card
- [ ] Temperature displays correctly
- [ ] Weather description displays
- [ ] Weather icon displays
- [ ] Location name displays
- [ ] Last update time shows

### Quick Stats
- [ ] **Mobile**: Stats display in vertical layout
- [ ] **Desktop**: Stats display in horizontal layout
- [ ] Humidity percentage displays
- [ ] Wind speed displays
- [ ] Wind direction displays
- [ ] Feels like temperature displays
- [ ] All icons display correctly

### Hourly Forecast
- [ ] Section title "Prakiraan Per Jam" displays
- [ ] Multiple hours of data display
- [ ] Each hour shows time
- [ ] Each hour shows temperature
- [ ] Each hour shows weather icon
- [ ] Horizontal scroll works

### Detailed Metrics
- [ ] Section displays all metrics
- [ ] Temperature metrics show (current, feels like, min, max)
- [ ] Wind information shows (speed, direction, gust)
- [ ] Atmospheric data shows (pressure, humidity, visibility)
- [ ] Icons for each metric display

### Daily Forecast
- [ ] Section title displays
- [ ] Multiple days display
- [ ] Day names show correctly
- [ ] High/low temperatures display
- [ ] Weather descriptions show
- [ ] Precipitation probability shows
- [ ] Icons for each day display

### Interactions
- [ ] Pull-to-refresh works (drag down from top)
- [ ] Page scrolls smoothly
- [ ] All touch targets are easy to hit

---

## 📊 Forecast Screen

### Tab Navigation
- [ ] **Mobile**: Tabs display properly
- [ ] **Desktop**: Tabs display properly
- [ ] 4 tabs visible: Cuaca, Angin, Gelombang, Arus
- [ ] Each tab has an icon
- [ ] Active tab is highlighted
- [ ] Can switch between tabs
- [ ] Tab changes show different content

### Cuaca (Weather) Tab
- [ ] Multiple day cards display
- [ ] Each card shows day name
- [ ] Each card shows date
- [ ] Each card shows weather icon
- [ ] Each card shows temperature
- [ ] Cards are expandable (can click to expand)
- [ ] Expanded card shows detailed information
- [ ] Can collapse expanded cards

### Angin (Wind) Tab
- [ ] Wind forecast data displays
- [ ] Wind speed information shows
- [ ] Wind direction information shows
- [ ] Multiple time periods display
- [ ] Icons display correctly

### Gelombang (Wave) Tab
- [ ] Wave forecast data displays
- [ ] Wave height information shows
- [ ] Wave period displays
- [ ] Multiple time periods display
- [ ] Icons display correctly

### Arus (Current) Tab
- [ ] Current forecast data displays
- [ ] Current speed information shows
- [ ] Current direction information shows
- [ ] Multiple time periods display
- [ ] Icons display correctly

### General
- [ ] Content is scrollable
- [ ] Switching tabs maintains overall page state
- [ ] All icons render properly
- [ ] Text is readable

---

## 🗺️ Maps Screen

### Map Display
- [ ] **Mobile**: Map displays properly
- [ ] **Desktop**: Map displays properly
- [ ] Map tiles load correctly
- [ ] Map is interactive (can pan/drag)

### Map Controls
- [ ] Zoom in button (+) is visible
- [ ] Clicking zoom in button works
- [ ] Zoom out button (-) is visible
- [ ] Clicking zoom out button works
- [ ] Current location button is visible (if implemented)

### Search
- [ ] Search bar/button is visible
- [ ] Can type in search field
- [ ] Search is collapsible
- [ ] Search expands when clicked

### Weather Reports
- [ ] Add report button is visible
- [ ] Add report button is clickable
- [ ] Clicking add report opens form dialog
- [ ] Report form has all necessary fields
- [ ] Can fill out report form
- [ ] Form has submit button
- [ ] Form has cancel/close button
- [ ] Closing form works properly

### Weather Markers
- [ ] Weather report markers display on map
- [ ] Markers have appropriate colors/icons
- [ ] Can click on markers
- [ ] **Mobile**: Clicking marker opens bottom sheet
- [ ] **Desktop**: Clicking marker opens sidebar
- [ ] Report details display correctly
- [ ] Can close report details

### Filters and Layers
- [ ] Weather layer toggle is visible
- [ ] Weather layer toggle works
- [ ] Severity filters are accessible
- [ ] Can filter by severity (low, medium, high)
- [ ] Filters update map display

### Responsive Design
- [ ] **Mobile**: Bottom sheet for report details
- [ ] **Mobile**: Map takes full screen
- [ ] **Desktop**: Sidebar for report details
- [ ] **Desktop**: Map and sidebar layout works
- [ ] Both layouts function correctly

---

## ⚙️ Settings Screen

### Access Settings
- [ ] Can navigate to settings from main app
- [ ] Settings screen loads properly

### Tampilan (Appearance) Section
- [ ] Section header displays
- [ ] Section description displays
- [ ] "Mode Gelap" (Dark Mode) row displays
- [ ] Dark mode toggle switch is present
- [ ] Toggling dark mode changes theme
- [ ] Theme change is immediate
- [ ] Theme persists across screens

### Notifikasi (Notifications) Section
- [ ] Section header displays
- [ ] Section description displays
- [ ] "Notifikasi Push" row displays
- [ ] Notification toggle switch is present
- [ ] Can toggle notification setting
- [ ] Toggle state changes visually

### Lokasi (Location) Section
- [ ] Section header displays
- [ ] Section description displays
- [ ] "Izin Lokasi" row displays
- [ ] Location toggle switch is present
- [ ] Can toggle location permission
- [ ] Toggle state changes visually

### Satuan (Units) Section
- [ ] Section header displays
- [ ] Section description displays
- [ ] "Suhu" row displays
- [ ] "Celsius (°C)" value displays
- [ ] Chevron icon displays
- [ ] Row is clickable

### Bahasa (Language) Section
- [ ] Section header displays
- [ ] Section description displays
- [ ] "Bahasa" row displays
- [ ] "Indonesia" value displays
- [ ] Chevron icon displays
- [ ] Row is clickable

### Tentang (About) Section
- [ ] Section header displays
- [ ] Section description displays
- [ ] "Versi" row displays
- [ ] "1.0.0" version displays
- [ ] "Privasi" row displays with chevron
- [ ] "Privasi" row is clickable
- [ ] Clicking privacy navigates to privacy screen
- [ ] "Keluar" (Logout) row displays with chevron
- [ ] "Keluar" row is clickable
- [ ] Clicking logout navigates to login screen

### General
- [ ] **Mobile**: Settings display properly
- [ ] **Desktop**: Settings centered with max-width
- [ ] Page is scrollable
- [ ] All icons display correctly
- [ ] All separators display correctly

---

## 🔒 Privacy Screen

### Display
- [ ] **Mobile**: Privacy screen displays properly
- [ ] **Desktop**: Privacy screen displays properly
- [ ] "Privacy Policy" title displays
- [ ] Privacy policy content displays
- [ ] All bullet points are visible:
  - [ ] "What information we collect"
  - [ ] "How we use your information"
  - [ ] "How we protect your information"
  - [ ] "Your rights and choices"
  - [ ] "Contact information"

### Navigation
- [ ] Can navigate back from privacy screen
- [ ] Back button/navigation works
- [ ] Content is scrollable

---

## 🧭 Navigation and Tab Bar

### Tab Bar (Mobile)
- [ ] Tab bar is visible at bottom on mobile
- [ ] Tab bar has 3-4 tabs (Home, Forecast, Maps, etc.)
- [ ] Each tab has an icon
- [ ] Each tab has a label
- [ ] Active tab is highlighted
- [ ] Can tap each tab to navigate
- [ ] Navigation is smooth

### Tab Bar (Desktop)
- [ ] Navigation is accessible on desktop
- [ ] Can click tabs to navigate
- [ ] Active tab is indicated

### Tab Navigation
- [ ] Clicking Home/Cuaca Hari Ini goes to weather screen
- [ ] Clicking Prakiraan/Forecast goes to forecast screen
- [ ] Clicking Peta/Maps goes to maps screen
- [ ] Navigation maintains app state
- [ ] Navigation is smooth without flicker

### Header Navigation
- [ ] Header displays appropriate title for each screen
- [ ] Can access settings from header or menu
- [ ] Header style matches theme (light/dark)

---

## 📱 Responsive Design

### Mobile (375x667)
- [ ] All screens fit properly
- [ ] No horizontal scrolling (except where intended)
- [ ] Touch targets are at least 44x44 pixels
- [ ] Text is readable
- [ ] Images and icons scale properly
- [ ] Bottom tab bar is always accessible
- [ ] Modals use bottom sheet pattern
- [ ] Content stacks vertically as needed

### Desktop (1920x1080)
- [ ] All screens use full width appropriately
- [ ] Content has max-width where appropriate
- [ ] Horizontal layouts used where beneficial
- [ ] Sidebars work properly
- [ ] Modals are centered dialogs
- [ ] Mouse interactions work smoothly
- [ ] Hover states work on interactive elements

---

## 🎨 Theme and Styling

### Light Theme
- [ ] Light theme displays correctly
- [ ] Text is readable
- [ ] Contrast is sufficient
- [ ] All colors look appropriate

### Dark Theme
- [ ] Dark theme displays correctly
- [ ] Text is readable
- [ ] Contrast is sufficient
- [ ] All colors look appropriate
- [ ] Switch between themes works smoothly

---

## ⚠️ Error Handling

### Network Errors
- [ ] App handles network errors gracefully
- [ ] Error messages are clear
- [ ] Retry buttons work where provided

### Navigation Errors
- [ ] 404/Not found pages handle correctly
- [ ] Invalid routes redirect appropriately

### Form Validation
- [ ] Forms validate input appropriately
- [ ] Error messages display for invalid input
- [ ] Forms prevent submission of invalid data

---

## ✅ Testing Complete

### Mobile Testing
- [ ] All mobile checks completed
- [ ] All functionality works on mobile viewport
- [ ] Responsive design verified

### Desktop Testing
- [ ] All desktop checks completed
- [ ] All functionality works on desktop viewport
- [ ] Responsive design verified

### Issues Found
List any issues discovered during testing:
1. 
2. 
3. 

### Overall Assessment
- [ ] All critical functionality works
- [ ] UI is polished and professional
- [ ] Responsive design works across viewports
- [ ] No major bugs or errors
- [ ] App is ready for deployment

---

## 📝 Notes

Add any additional observations or notes here:

