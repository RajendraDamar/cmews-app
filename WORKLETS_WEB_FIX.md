# React Native Worklets Web Error Fix - October 2025

## Problem Description

When running the application on web with development mode, the following error occurred:

```
Uncaught Error
[Worklets] createSerializableObject should never be called in JSWorklets.

Call Stack:
WorkletsErrorConstructor
createSerializableObject
node_modules/react-native-worklets/lib/module/WorkletsModule/JSWorklets.js
clonePlainJSObject
node_modules/react-native-worklets/lib/module/serializable.js
createSerializableNative
node_modules/react-native-worklets/lib/module/serializable.js
...
```

This error prevented the app from loading on web in development mode.

## Root Cause

The error was caused by a code path in `react-native-worklets` that executes during module initialization:

1. **Development Mode Serialization**: In `react-native-worklets/lib/module/threads.js`, there's a block of code that runs when `__DEV__` is `true`:

```javascript
if (__DEV__) {
  function runOnUIAsyncWorklet() {
    'worklet';
    throw new WorkletsError('...');
  }
  const serializableRunOnUIAsyncWorklet = createSerializable(runOnUIAsyncWorklet);
  serializableMappingCache.set(runOnUIAsync, serializableRunOnUIAsyncWorklet);
}
```

2. **Web Platform Limitation**: On web, `react-native-worklets` uses `JSWorklets` implementation which doesn't support worklet serialization methods. These methods throw errors by design because web doesn't have a separate UI thread like native platforms.

3. **Module Load Time Execution**: The problematic code executes at module import time, not at function call time, so it triggers before any runtime platform checks can prevent it.

## Solution Implemented

The fix involves two complementary changes:

### 1. Babel Configuration Update

Updated `babel.config.js` to conditionally include the `react-native-reanimated/plugin` only for native platforms:

```javascript
module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  // Get the platform from the babel caller (set by Metro)
  const platform = api.caller((caller) => caller?.platform);

  // Only add the reanimated plugin for native platforms (iOS/Android), not web
  // This prevents worklets initialization errors on web
  if (platform !== 'web') {
    plugins.push('react-native-reanimated/plugin');
  }

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
```

**Rationale**: The Babel plugin transforms worklet functions for native platforms. On web, animations are handled differently and don't require this transformation.

### 2. React Native Worklets Patch

Created a patch using `patch-package` to modify the problematic code in `react-native-worklets`:

**File**: `patches/react-native-worklets+0.5.1.patch`

**Change**: Modified the conditional check to also verify the platform:

```diff
-if (__DEV__) {
+if (__DEV__ && !SHOULD_BE_USE_WEB) {
   function runOnUIAsyncWorklet() {
     'worklet';
     throw new WorkletsError('...');
   }
   const serializableRunOnUIAsyncWorklet = createSerializable(runOnUIAsyncWorklet);
   serializableMappingCache.set(runOnUIAsync, serializableRunOnUIAsyncWorklet);
 }
```

**Rationale**: By adding the `!SHOULD_BE_USE_WEB` check, the serialization code only runs on native platforms where it's supported, not on web where `JSWorklets` would throw an error.

### 3. Package Configuration

Added `patch-package` as a dev dependency and configured automatic patch application:

```json
{
  "scripts": {
    "postinstall": "patch-package"
  },
  "devDependencies": {
    "patch-package": "^8.0.1"
  }
}
```

**Rationale**: This ensures the patch is automatically applied whenever dependencies are installed, maintaining the fix across different environments.

## How It Works

1. **On Native Platforms (iOS/Android)**:
   - Babel plugin transforms worklets for UI thread execution
   - `SHOULD_BE_USE_WEB` is `false`
   - Development mode serialization runs normally
   - Full worklets functionality is available

2. **On Web Platform**:
   - Babel plugin is skipped (no worklet transformation needed)
   - `SHOULD_BE_USE_WEB` is `true`
   - Development mode serialization is skipped
   - Animations use web-compatible implementations
   - No serialization errors occur

## Platform Detection

The `SHOULD_BE_USE_WEB` constant is determined by the worklets library based on `Platform.OS`:

```javascript
// From react-native-worklets/lib/module/PlatformChecker/PlatformChecker.js
export const IS_WEB = Platform.OS === 'web';
export const SHOULD_BE_USE_WEB = IS_JEST || IS_WEB || IS_WINDOWS;
```

## Verification

### 1. Check Patch is Applied

```bash
# After npm install, verify the patch:
cat node_modules/react-native-worklets/lib/module/threads.js | grep -A 2 "if (__DEV__"
# Should show: if (__DEV__ && !SHOULD_BE_USE_WEB) {
```

### 2. Test on Web

```bash
# Clear cache and start web development server
npx expo start --web --clear
```

**Expected**: App loads without worklets serialization errors

### 3. Test on Native

```bash
# Test iOS
npx expo start --ios --clear

# Test Android
npx expo start --android --clear
```

**Expected**: Animations work normally with full worklets support

### 4. Run Automated Tests

```bash
# Run the worklets validation script
./test-worklets-fix.sh
```

## Benefits

- ✅ **Cross-Platform Compatibility**: App works on web, iOS, and Android
- ✅ **No Runtime Errors**: Eliminates worklets serialization errors on web
- ✅ **Proper Platform Handling**: Uses appropriate animation implementation per platform
- ✅ **Maintainable**: Patch is automatically applied on install
- ✅ **Minimal Changes**: Only modifies the specific problematic code path

## Files Modified

1. **babel.config.js**: Added platform-specific plugin configuration
2. **package.json**: Added patch-package dependency and postinstall script
3. **patches/react-native-worklets+0.5.1.patch**: Patch file for worklets library

## Maintenance

### When Upgrading Dependencies

If you upgrade `react-native-worklets` to a version that fixes this issue:

1. Remove the patch file:
   ```bash
   rm patches/react-native-worklets+*.patch
   ```

2. Test on web to verify the fix is no longer needed:
   ```bash
   npx expo start --web --clear
   ```

3. If the error returns, recreate the patch for the new version

### When Contributing

If you modify code in `node_modules/react-native-worklets`, regenerate the patch:

```bash
npx patch-package react-native-worklets
```

## Alternative Solutions Considered

1. **Metro Resolver Stub**: Creating a custom stub module for web
   - **Rejected**: Too invasive and could break other functionality

2. **Forking the Library**: Maintaining our own fork of react-native-worklets
   - **Rejected**: Maintenance burden and update complexity

3. **Disabling DEV Mode on Web**: Running web builds in production mode
   - **Rejected**: Loses valuable debugging capabilities

4. **Waiting for Upstream Fix**: Waiting for library authors to fix
   - **Rejected**: Issue needs immediate resolution for development

## Related Documentation

- [WORKLETS_FIX.md](./WORKLETS_FIX.md) - Original worklets dependency fix
- [WORKLETS_QUICK_REF.md](./WORKLETS_QUICK_REF.md) - Quick reference guide
- [React Native Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Worklets Documentation](https://docs.swmansion.com/react-native-worklets/)

## Success Metrics

- ✅ Web development server starts without errors
- ✅ No worklets serialization errors in console
- ✅ Animations work on all platforms (web, iOS, Android)
- ✅ Development tools and debugging work properly
- ✅ TypeScript compilation passes
- ✅ Linting passes
- ✅ Automated tests pass

## Known Limitations

- **Patch Dependency**: Relies on patch-package to modify third-party code
- **Version Specific**: Patch is for react-native-worklets@0.5.1 (will need update if version changes)
- **Web Animation Differences**: Some advanced worklets features may behave differently on web vs native

## Troubleshooting

### Patch Not Applied After Install

```bash
# Manually apply patches
npx patch-package

# Verify patch was applied
cat node_modules/react-native-worklets/lib/module/threads.js | grep "SHOULD_BE_USE_WEB"
```

### Error Still Occurs on Web

1. Clear all caches:
   ```bash
   rm -rf node_modules .expo
   npm install
   npx expo start --web --clear
   ```

2. Verify Babel config is correct:
   ```bash
   cat babel.config.js
   # Should show platform check for reanimated plugin
   ```

### Different Error After Upgrading

If you see a different worklets error after upgrading dependencies:

1. Check if the patch is still valid:
   ```bash
   npm ls react-native-worklets
   ```

2. If version changed, update the patch:
   ```bash
   # Make changes to node_modules/react-native-worklets
   npx patch-package react-native-worklets
   ```

## Contributing

If you encounter worklets-related issues on web:

1. Check this documentation first
2. Verify your platform detection is working:
   ```javascript
   import { Platform } from 'react-native';
   console.log('Platform:', Platform.OS); // Should be 'web' on web
   ```
3. Check browser console for additional error details
4. Report issues with full error stack trace

## License

This fix maintains compatibility with the original package licenses:
- react-native-reanimated: MIT License
- react-native-worklets: MIT License
- patch-package: MIT License
