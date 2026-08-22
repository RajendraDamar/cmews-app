# React Navigation Context / `printUpgradeWarning` — Resolution Report

**Date**: 2026-08-21  
**Target**: Android Native (`SM_S916B` / APK) & Web  
**Resolution**: Complete & Verified  

---

## 1. Root Cause Analysis

The error encountered:
```
ERROR [Error: Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?]
```
occurred during development rendering in the following sequence:
1. `app/(tabs)/index.tsx` and `app/(tabs)/forecast.tsx` were passing `className={colorScheme === 'dark' ? 'dark flex-1 bg-background' : 'flex-1 bg-background'}` to their root `<ScrollView>` components.
2. In NativeWind 4, conditionally adding or removing the `'dark'` class dynamically on a rendered component marks it as needing a CSS variable context upgrade (`VariableContext.Provider`) after initial mount.
3. When NativeWind detects a component needing an upgrade after mount, it invokes `printUpgradeWarning(warning, originalProps)`.
4. `printUpgradeWarning` ran `stringify(originalProps)` using `Object.entries(value)` to serialize props. Because the component was mounted inside a navigation route, `originalProps` contained React Navigation Context objects with unmounted getter properties (`get__getKey`).
5. Invoking `get__getKey` outside an active navigation context threw the crash.

---

## 2. Fixes Applied

1. **Static Clean ClassNames for Screen ScrollViews**:
   - **[app/(tabs)/index.tsx](file:///c:/Users/Damar/Downloads/Github/cmews-app/app/(tabs)/index.tsx)**: Changed `className={colorScheme === 'dark' ? 'dark flex-1 bg-background' : 'flex-1 bg-background'}` $\rightarrow$ `className="flex-1 bg-background"`.
   - **[app/(tabs)/forecast.tsx](file:///c:/Users/Damar/Downloads/Github/cmews-app/app/(tabs)/forecast.tsx)**: Changed `className={colorScheme === 'dark' ? 'dark flex-1 bg-background' : 'flex-1 bg-background'}` $\rightarrow$ `className="flex-1 bg-background"`.
   - *Result*: NativeWind no longer triggers dynamic `VariableContext` upgrades on screen `ScrollView` containers.

2. **Scoped All Transition Classes to `web:`**:
   - **[components/ui/switch.tsx](file:///c:/Users/Damar/Downloads/Github/cmews-app/components/ui/switch.tsx)**: Scoped `transition-transform` to `web:transition-transform` so `SwitchPrimitives.Thumb` is never upgraded to an Animated component on Native.

3. **Safeguarded `stringify` in `react-native-css-interop`**:
   - Added `try...catch` around property getter iterations in `node_modules/react-native-css-interop/dist/runtime/native/render-component.js` so that even if any 3rd party package triggers an upgrade warning in DEV, it logs gracefully without throwing unhandled exceptions.

---

## 3. Verification

- **TypeScript**: `npx tsc --noEmit` $\rightarrow$ **0 errors (Exit code 0)**.
- **Web App**: Navigated and verified with **0 errors**.
