# Mobile APK vs Web Visual & Theming Analysis Report

**Date**: 2026-08-22  
**Target**: Mobile APK (Native Android, Samsung Galaxy S23+ / SM-S916B, 1080×2340) vs Mobile Web (Vite/React Native Web, 390×844)  
**Mode**: Read-Only Comprehensive Audit & Technical Analysis  

---

## 1. Executive Summary

A deep comparative visual and architectural audit was conducted between the **Native Android Mobile APK** (via 17 physical ADB screenshots) and the **Mobile Web Viewport** (via Playwright at 390×844).

### Key Finding: Theming & CSS Variable Divergence
The web version functions correctly in both Light and Dark mode because `document.documentElement.classList.add('dark')` allows the browser DOM to resolve the `.dark` class CSS variables (`--card`, `--background`, `--foreground`, etc.) defined in `global.css`.

On **Native Android (Hermes)**, however, `react-native-css-interop` does NOT automatically map `.dark` CSS variable blocks from `global.css` without an explicit class ancestor or NativeWind variable binding. Consequently:
1. **In Dark Mode**, screen containers use inline dark backgrounds (`hsl(222.2 84% 4.9%)`), but all `<Card>`, `<Dialog>`, and `<View className="bg-card">` components evaluate CSS variables against `:root` (Light Mode), turning **pure white (`#ffffff`)**.
2. **Invisible Text Bug**: Text components with `variant="default"` (`text-foreground`) evaluate to `:root` black (`hsl(222.2 84% 4.9%)` / `#020817`). When placed on dark backgrounds (such as in the Profile Modal and Location Header), the text is rendered as **black on dark navy**, rendering critical UI labels completely invisible.
3. **In Light Mode**, both the APK and Web render cleanly with high visual fidelity.

---

## 2. Screenshot-by-Screenshot Deep Audit (ADB Screens 01 – 17)

### Screen 01: `01_home_screen.png` — Home Screen (Top, Dark Mode)
- **Visual State**: Page background is dark navy (`#020817`), Hero Card gradient is full-bleed with glowing sun halo.
- **Theming Anomalies**:
  - **Location Header**: The kecamatan name ("Menteng") is invisible because `text-foreground` evaluates to `:root` black text on the dark background. Only the subtitle ("Jakarta Pusat, DKI Jakarta" using `text-muted-foreground`) is faintly visible in gray.
  - **Weather Alert Card ("Peringatan Hujan Lebat")**: The card renders with a white/light cream background (`bg-card` evaluating to white + 10% orange tint) and black text instead of a dark card with amber border.
  - **Quick Stats Cards ("Ringkasan Cepat")**: All 3 stats cards ("Kelembapan", "Kecepatan Angin", "Terasa Seperti") render with pure white backgrounds (`#ffffff`) and black text against the dark page background.
  - **Hourly Forecast Card ("Prakiraan Per Jam")**: The hourly forecast card container renders with a pure white background.
- **Web Comparison**: On Mobile Web Dark Mode, the entire screen has a cohesive deep-navy palette (`bg-background` and `bg-card` #0b1329) with white/light text and colored accents.

---

### Screen 02: `02_home_scrolled.png` — Home Screen (Scrolled, Dark Mode)
- **Visual State**: Hourly forecast pills, Detail Cuaca accordions, and 7-day forecast cards.
- **Theming Anomalies**:
  - **Detail Cuaca Container**: Renders as a white card with light gray accordion headers (`bg-muted` = `#f1f5f9`).
  - **Prakiraan 7 Hari Container**: Renders as a white card (`#ffffff`) with black text ("Hari Ini", "Sabtu", "Minggu").
- **Web Comparison**: On Web Dark Mode, all cards use dark slate backgrounds (`hsl(222.2 84% 4.9%)`) with crisp white typography.

---

### Screen 03: `03_detail_cuaca_expanded.png` — Detail Cuaca Accordion Expanded (Dark Mode)
- **Visual State**: "Temperatur" accordion expanded, displaying "Saat Ini (22°C)", "Terasa Seperti (22°C)", "Minimum (22°C)", "Maksimum (34°C)".
- **Theming Anomalies**:
  - The expanded content container renders with a pure white background (`bg-card` = `#ffffff`), light gray divider borders, and black text.
- **Web Comparison**: On Web, the accordion expands into a dark card with subtle dark slate dividers (`border-border` dark = `hsl(217.2 32.6% 17.5%)`).

---

### Screen 04: `04_location_dialog.png` — Location Selection Modal Dialog (Dark Mode)
- **Visual State**: Modal dialog ("Pilih Lokasi") centered over a 50% black backdrop.
- **Theming Anomalies**:
  - The dialog card is pure white (`bg-background` = `#ffffff`) with black title and description.
  - The "Terapkan" button is dark primary (`bg-primary` = `#020817` / black) with white text, and "Batal" is white with black text.
  - In Dark Mode, the dialog card should be dark navy (`#0b1329` / `hsl(222.2 84% 4.9%)`) with white text and a blue primary button.
- **Web Comparison**: On Web Dark Mode, the dialog has a dark container with light inputs and glowing focus borders.

---

### Screen 05: `05_profile_modal.png` — Profile Modal Popup (Dark Mode)
- **Visual State**: Profile popup with avatar ("JD"), user info, theme toggle, and menu rows.
- **Critical Usability Bug (Invisible Text)**:
  - The popup container has a manually forced dark background (`hsl(222.2 84% 4.9%)`).
  - **User Name ("John Doe")**: Rendered in **BLACK TEXT** (`text-foreground` = `#020817`), making it **completely invisible** on the dark modal background.
  - **Menu Item 2 ("Pengaturan")**: Icon visible, but the text label "Pengaturan" is **completely invisible** (black text).
  - **Menu Item 3 ("Privasi")**: Icon visible, but the text label "Privasi" is **completely invisible** (black text).
  - **Menu Item 4 ("Bantuan & Dukungan")**: Icon visible, but the text label is **completely invisible** (black text).
  - Only "Dark" (muted text) and "Keluar" (red destructive text) are visible.
- **Web Comparison**: On Web, all menu item labels are crisp white (`hsl(210 40% 98%)`).

---

### Screen 06: `06_theme_toggled.png` — Profile Modal (Toggled to Light Mode)
- **Visual State**: Profile modal switched to Light Mode.
- **Verification**: All hidden text labels ("John Doe", "Pengaturan", "Privasi", "Bantuan & Dukungan") instantly become readable in black text against the white background.
- **Conclusion**: Confirms that typography on Native Android is stuck rendering with `:root` light-mode values regardless of the active theme state.

---

### Screen 07: `07_home_light_mode.png` — Home Screen (Light Mode)
- **Visual State**: Full home screen rendered in Light Mode.
- **Quality**: The Light Mode interface is clean and visually balanced. Hero card gradient fills 100% of the container, sun halo is centered, stats cards have subtle borders, and typography contrast is sharp.

---

### Screen 08: `08_forecast_screen.png` — Forecast Tab (Cuaca, Light Mode)
- **Visual State**: Segmented tabs (`Cuaca`, `Angin`, `Gelombang`, `Arus`) with 3-day forecast cards ("Hari Ini", "Sabtu", "Minggu").
- **Quality**: Clean presentation in Light Mode. When switched to Dark Mode, these cards suffer the same `:root` white background bug as the Home Screen cards.

---

### Screen 09: `09_forecast_accordion_expanded.png` — Forecast Day Interaction
- **Visual State**: Day card expanded with chevron. Clean spacing and smooth layout in Light Mode.

---

### Screen 10: `10_forecast_angin.png` — Forecast Tab (Angin / Wind)
- **Visual State**: Wind forecast sub-tab. Responsive segment switcher.

---

### Screen 11: `11_forecast_gelombang.png` — Forecast Tab (Gelombang / Marine Waves)
- **Visual State**: 5 Indonesian maritime zones (`Laut Jawa`, `Selat Sunda`, `Laut Natuna`, `Selat Karimata`, `Laut Banda`) with wave height metrics (1.9–3.7 m) and periods (4–6s).
- **Quality**: High visual quality in Light Mode with distinct severity badges (orange for Sedang, pink/red for Kasar).

---

### Screen 12: `12_maps_screen.png` — Maps Tab (MapLibre Native Vector Map)
- **Visual State**: Native MapLibre vector map rendering Greater Jakarta at 60 FPS on Android SurfaceView.
- **Controls**: "Cari lokasi..." search bar, zoom controls (+ / -), GPS pinpoint button, and floating action button (+).
- **Theming Note**: Map tile style is currently using CartoDB Voyager (Light). In Dark Mode, it should dynamically swap to `MAP_STYLES.dark` (CartoDB Dark Matter).

---

### Screen 13: `13_maps_report_bottom_sheet.png` — Weather Report Modal Dialog
- **Visual State**: "Laporkan Cuaca" modal dialog open over the map.
- **Layout & Typography Bug**:
  - **Button Text Clipping**: The "Kirim Laporan" button has a fixed height (`h-12` = 48px) and equal split width (`flex-1`). In Indonesian, "Kirim Laporan" wraps onto two lines, causing "Laporan" to overflow vertically and get clipped at the bottom (`Kirim / L aporan`).
  - **Search Bar Stacking**: The map search bar at the top remains partially visible behind the backdrop.

---

### Screen 14: `14_settings_screen.png` — Settings Screen (Light Mode)
- **Visual State**: Settings screen with Tampilan (Mode Gelap), Notifikasi Push, Izin Lokasi, and Satuan Suhu (Celsius).
- **Quality**: Clean grouped cards with active switches.

---

### Screen 15: `15_settings_dark_mode.png` — Settings Screen (Interactive Row)
- **Visual State**: Setting row toggle test. Tapping the row triggers theme state update without crashing.

---

### Screen 16: `16_privacy_screen.png` — Settings Screen Bottom Options
- **Visual State**: Bahasa (Indonesia), Tentang (Versi 1.0.0), Privasi, and Keluar options.

---

### Screen 17: `17_privacy_screen.png` — Privacy Policy Page
- **Visual State**: Dedicated Privacy Policy screen with standard legal placeholders, back navigation, and clean readable line-height.

---

## 3. Root Cause Architecture Breakdown

### Why Dark Mode Fails on Native Android APK while Working on Web

```
               ┌───────────────────────────────────────────┐
               │              global.css                   │
               │  :root { --card: #ffffff; ... }           │
               │  .dark { --card: #020817; ... }           │
               └─────────────────────┬─────────────────────┘
                                     │
               ┌─────────────────────┴─────────────────────┐
               ▼                                           ▼
      [ WEB PLATFORM ]                            [ NATIVE ANDROID ]
  document.documentElement.add('dark')        No DOM / document.documentElement
                 │                                           │
  All CSS variables switch to .dark           react-native-css-interop defaults
  Card background = #0b1329 (Dark)            all CSS variables to :root
  Text color = #ffffff (White)                Card background = #ffffff (WHITE!)
                                              Text color = #020817 (BLACK!)
```

1. **CSS Variable Scope Isolation**:
   In NativeWind 4, `global.css` defines `:root` and `.dark` blocks. On Web, standard CSS cascading resolves `.dark` when the `<html>` tag has the `.dark` class. On Native Android (Hermes), `react-native-css-interop` does not have a global HTML root element. Without a root component injecting the theme variables or matching `.dark`, every component (`bg-card`, `bg-background`, `text-foreground`) falls back to `:root` (Light Mode).

2. **Mismatched Container vs Component Styling**:
   In `app/_layout.tsx`, `ThemedApp()` sets `style={{ backgroundColor: colorScheme === 'dark' ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)' }}`. This forces the screen background to dark navy, but child components using Tailwind classes (`<Card>`, `<Text>`) continue evaluating against `:root` (white cards, black text).

3. **Portal & Modal Context Loss**:
   Modals (`ProfileModal`, `LocationSelectionDialog`, `ReportFormDialog`) rendered via React Native `<Modal>` or `@rn-primitives/portal` mount outside the main navigation hierarchy, losing any context-injected class names.

---

## 4. Comprehensive Conclusion: Items to Fix

### Category A: Theming & Color Inconsistencies (High Priority)
1. **Unify Native Theme Tokens**:
   - Provide explicit theme color tokens (`getThemeColor(colorScheme === 'dark')` or NativeWind `vars()`) across core UI primitives (`Card`, `Text`, `Dialog`, `Popover`, `Input`, `Select`).
   - In `components/ui/card.tsx`, ensure `style={{ backgroundColor: themeColors.card, borderColor: themeColors.border }}` or use dynamic classes that resolve correctly on native.
   - In `components/ui/text.tsx`, ensure `variant="default"` resolves to `text-white` / `#f3f4f6` in Dark Mode and `text-gray-900` / `#1f2937` in Light Mode.
2. **Profile Modal Invisible Text**:
   - In `components/profile-modal.tsx`, update "John Doe", "Tema", "Pengaturan", "Privasi", and "Bantuan & Dukungan" text colors to explicitly use `colorScheme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)'` so they are always visible.
3. **Location Selector Header ("Menteng")**:
   - In `components/weather/location-selector.tsx`, update `{kecamatan}` text styling to dynamically use theme-aware text colors.
4. **Weather Alert Banner**:
   - In `components/weather/weather-alert.tsx`, adjust card background opacity and border colors so it renders as a dark translucent banner in Dark Mode rather than a light peach box.
5. **Dialog Theming (Location & Report Dialogs)**:
   - In `components/ui/dialog.tsx`, pass theme-aware background colors (`themeColors.card` / `themeColors.background`) to `DialogContent` so modal dialogs are dark in Dark Mode.

### Category B: Layout & UI Polish (Medium Priority)
1. **Fix "Kirim Laporan" Button Text Clipping**:
   - In `components/maps/report-form-dialog.tsx`, change the button label to `"Kirim"` or reduce text size (`labelClasses="text-sm"`) and set `className="flex-1 min-h-[44px] py-2 px-2"` to prevent two-line text wrapping and vertical clipping.
2. **Dynamic Map Tile Dark Mode**:
   - In `app/(tabs)/maps.tsx`, pass `mapStyle={colorScheme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light}` to the MapLibre map component.
3. **Quick Stats Arrow Icon Contrast**:
   - In `components/weather/quick-stats.tsx`, ensure the direction arrow icon container has distinct contrast in both light and dark modes.

---

## 5. Verification Plan

| Fix Item | Verification Method | Success Criteria |
| :--- | :--- | :--- |
| **Dark Theme Cards** | ADB screencap `01_home_screen.png` & `02_home_scrolled.png` | All cards (Quick Stats, Hourly, 7-Day, Detail Cuaca) render in dark navy (`#0b1329`) in Dark Mode. |
| **Profile Modal Labels** | ADB screencap `05_profile_modal.png` | "John Doe", "Pengaturan", "Privasi", and "Bantuan" text labels are 100% visible and readable in white text. |
| **Location Header** | ADB screencap `01_home_screen.png` | "Menteng" is rendered in bold white text in Dark Mode. |
| **Report Form Button** | ADB screencap `13_maps_report_bottom_sheet.png` | "Kirim Laporan" / "Kirim" button text fits on a single line with zero vertical clipping. |
| **Dark Map Style** | ADB screencap `12_maps_screen.png` in Dark Mode | Map renders CartoDB Dark Matter tiles when Dark Mode is active. |
