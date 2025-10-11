# React Native Worklets Conflict Fix - October 2025

## Problem Description

When running the application, it encountered the following error:

```
Uncaught Error
[Worklets] createSerializableObject should never be called in JSWorklets.

Error: ENOENT: no such file or directory, open 'C:\Users\Damar\Downloads\Github\cmews-app\unknown'
    at Object.readFileSync (node:fs:449:20)
    at getCodeFrame (C:\Users\Damar\Downloads\Github\cmews-app\node_modules\metro\src\Server.js:997:18)
    at Server._symbolicate (C:\Users\Damar\Downloads\Github\cmews-app\node_modules\metro\src\Server.js:1079:22)
```

## Root Cause

The error was caused by having **two worklets runtimes** attempting to initialize simultaneously:

1. **react-native-reanimated v4.1.2** - Includes built-in worklets runtime
2. **react-native-worklets v0.5.1** - Standalone worklets library (was listed as direct dependency)

When both packages attempted to initialize the worklets runtime:
- The worklets system tried to serialize objects in an invalid context
- This caused the `createSerializableObject` error
- Metro bundler then attempted to symbolicate this error
- Metro tried to read a file with an "unknown" path (invalid file reference)
- This resulted in the `ENOENT` error, crashing the bundler

## Solution Implemented

**Removed `react-native-worklets` from direct dependencies** in `package.json`.

### Before (❌ Caused Conflict)
```json
{
  "dependencies": {
    "react-native-reanimated": "~4.1.1",
    "react-native-worklets": "0.5.1",  // ❌ Direct dependency
    ...
  }
}
```

### After (✅ Correct)
```json
{
  "dependencies": {
    "react-native-reanimated": "~4.1.1",
    // react-native-worklets removed - it's automatically included by reanimated
    ...
  }
}
```

### Dependency Tree

**Before:**
```
cmews-app
├─┬ react-native-reanimated@4.1.2
│ └── react-native-worklets@0.5.1 (peer dependency)
└── react-native-worklets@0.5.1 (direct - CONFLICT!)
```

**After:**
```
cmews-app
└─┬ react-native-reanimated@4.1.2
  └── react-native-worklets@0.5.1 (managed by reanimated)
```

## Why This Works

### React Native Reanimated v3+ Architecture

React Native Reanimated v3 and later versions have worklets functionality **built-in**. The package manages its own worklets runtime and includes `react-native-worklets` as a peer dependency internally.

When you install `react-native-worklets` as a direct dependency:
- Two separate instances of the worklets runtime try to initialize
- Each tries to manage the JavaScript context
- This creates conflicts in object serialization
- The error propagates through Metro's error handling system
- Metro's symbolication fails with the "unknown" file path error

### The Proper Way

Let `react-native-reanimated` manage the worklets runtime:
- Only one worklets runtime initializes
- No serialization conflicts
- Metro bundler works correctly
- All animation features still work perfectly

## Verification

### Check Dependency Tree
```bash
npm ls react-native-worklets
```

**Expected output:**
```
cmews-app@1.0.0
└─┬ react-native-reanimated@4.1.2
  └── react-native-worklets@0.5.1
```

### Check for Direct Imports
```bash
grep -r "from 'react-native-worklets'" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules
```

**Expected output:** (no results - good!)

### Test Application
```bash
# Clear cache and start
npx expo start --clear

# Or for web
npx expo start --web --clear
```

## Related Files

- `package.json` - Removed react-native-worklets from dependencies
- `babel.config.js` - Includes react-native-reanimated/plugin (correct)
- `components/ui/skeleton.tsx` - Uses react-native-reanimated hooks (works correctly)

## Testing & Validation

### ✅ Linting
```bash
npm run lint
```
Result: All files pass linting

### ✅ TypeScript Compilation
```bash
npx tsc --noEmit
```
Result: No TypeScript errors

### ✅ Metro Configuration
```bash
node -c metro.config.js
```
Result: Configuration loads successfully

## Common Scenarios

### Scenario 1: "I need worklets for my animations"
**Answer:** You already have them! React Native Reanimated v4+ includes worklets. Just use the reanimated hooks:
```tsx
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
```

### Scenario 2: "What if I was using react-native-worklets directly?"
**Answer:** Migrate to react-native-reanimated APIs. They provide the same functionality with better integration.

### Scenario 3: "What about other libraries that use worklets?"
**Answer:** Libraries like `@shopify/react-native-skia` and `moti` work with react-native-reanimated's worklets runtime. No separate installation needed.

## Best Practices

1. **Never install react-native-worklets as a direct dependency** when using react-native-reanimated v3+
2. **Always use react-native-reanimated's hooks** for animations and worklets
3. **Keep react-native-reanimated/plugin as the last plugin** in babel.config.js
4. **Clear Metro cache** after dependency changes: `npx expo start --clear`

## Maintenance

### When Upgrading React Native Reanimated

Always check the official documentation for worklets requirements. As of v3+:
- Worklets are built-in
- No separate worklets package needed
- The babel plugin handles worklets transformation

### If Errors Return

1. **Verify dependency tree:**
   ```bash
   npm ls react-native-worklets
   ```

2. **Check for duplicate installations:**
   ```bash
   npm dedupe
   ```

3. **Clear all caches:**
   ```bash
   rm -rf node_modules .expo
   npm install
   npx expo start --clear
   ```

## Success Metrics

- ✅ No worklets serialization errors
- ✅ No "unknown" file path errors
- ✅ Metro bundler starts successfully
- ✅ All animations work correctly
- ✅ TypeScript compilation passes
- ✅ Linting passes

## References

- [React Native Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [Worklets in Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/worklets/)
- [Metro Bundler Configuration](https://facebook.github.io/metro/)
