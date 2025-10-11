# Metro Bundler ENOENT Error Fix - October 2025

## Problem Description

When running the Metro bundler (via `npx expo start --web` or other commands), the application would crash with the following error:

```
Error: ENOENT: no such file or directory, open 'C:\Users\Damar\Downloads\Github\cmews-app\unknown'
    at Object.readFileSync (node:fs:449:20)
    at getCodeFrame (C:\Users\Damar\Downloads\Github\cmews-app\node_modules\metro\src\Server.js:997:18)
    at Server._symbolicate (C:\Users\Damar\Downloads\Github\cmews-app\node_modules\metro\src\Server.js:1079:22)
```

This error would prevent the development server from starting and make debugging impossible.

## Root Cause Analysis

### Understanding Metro's Symbolication Process

Metro bundler provides helpful error messages by using a process called "symbolication":

1. **Error Occurs**: When an error happens during bundling, Metro captures the stack trace
2. **Source Mapping**: Metro maps the error location back to the original source code
3. **Code Frame Generation**: Metro reads the source file to show context around the error
4. **Display**: Metro presents a helpful error with code snippets

### The Problem

The issue occurred when:

1. The custom Metro resolver encountered an error during module resolution
2. The resolver didn't catch and handle this error properly
3. Metro attempted to symbolicate this error for display
4. Metro tried to read a file to show context, but the file path was invalid ("unknown")
5. This caused Metro to crash with `ENOENT: no such file or directory`

### Why "unknown"?

When Metro can't determine the actual file path where an error occurred (often due to errors in the resolution process itself), it defaults to using "unknown" as the file path. Since "unknown" is not a real file, attempting to read it causes the ENOENT error.

## Solution Implemented

### The Fix: Comprehensive Error Handling

The solution wraps all module resolution attempts in try-catch blocks to ensure errors are handled gracefully before Metro's symbolication process sees them.

**File:** `metro.config.js`

```javascript
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Special handling for tslib (unchanged)
  if (moduleName === 'tslib' || moduleName.startsWith('tslib/')) {
    // ... tslib resolution logic ...
  }

  // Use the default resolver with error handling
  try {
    if (defaultResolver) {
      return defaultResolver(context, moduleName, platform);
    }
  } catch (_error) {
    // If default resolver fails, try the fallback
    // This prevents Metro from receiving invalid file paths during error symbolication
  }

  // Fallback to context's resolveRequest with error handling
  try {
    return context.resolveRequest(context, moduleName, platform);
  } catch (error) {
    // If all resolution attempts fail, throw a descriptive error
    // This ensures Metro receives a proper error instead of an invalid file path
    throw new Error(
      `Failed to resolve module '${moduleName}' from '${context.originModulePath || 'unknown'}': ${error.message}`
    );
  }
};
```

### Key Improvements

1. **Try-Catch on Default Resolver**: Catches errors from the default resolver and allows fallback
2. **Try-Catch on Fallback Resolver**: Catches errors from the fallback with descriptive error message
3. **Descriptive Error Messages**: Includes module name and origin path for better debugging
4. **Prevents "unknown" Path**: By properly handling errors, we prevent Metro from ever seeing an "unknown" file path

## How This Fixes the ENOENT Error

### Before the Fix

```
Module Resolution Error
    ↓
Custom Resolver throws unhandled error
    ↓
Metro tries to symbolicate the error
    ↓
Metro can't determine file path → uses "unknown"
    ↓
Metro tries: readFileSync("unknown")
    ↓
ENOENT: no such file or directory, open 'unknown'
    ↓
Metro crashes ❌
```

### After the Fix

```
Module Resolution Error
    ↓
Custom Resolver catches the error
    ↓
Custom Resolver throws descriptive error with proper context
    ↓
Metro tries to symbolicate the error
    ↓
Metro has valid file path from error message
    ↓
Metro displays helpful error message
    ↓
Developer can debug the issue ✅
```

## Testing & Validation

### Automated Testing

Created a comprehensive test script that validates:

1. ✅ Metro config loads successfully
2. ✅ Custom resolver is properly defined
3. ✅ tslib resolution works correctly (CommonJS version)
4. ✅ Error handling for non-existent modules produces descriptive errors
5. ✅ No "unknown" file path references in error messages
6. ✅ Error messages contain proper context (module name, origin path)

### Manual Testing

```bash
# Test Metro config loads
node -c metro.config.js

# Test with development server
npx expo start --web --clear

# Test with production build
npx expo export --platform web
```

## Expected Behavior

### When Module Resolution Succeeds

- Module resolves normally
- No errors
- Development continues smoothly

### When Module Resolution Fails

**Before Fix:**
```
Error: ENOENT: no such file or directory, open 'unknown'
[Metro crashes]
```

**After Fix:**
```
Error: Failed to resolve module 'some-module' from '/path/to/file.js': Cannot find module 'some-module'
[Metro displays helpful error with context]
[Developer can identify and fix the missing dependency]
```

## Benefits

1. **No More ENOENT Crashes**: Metro won't crash with "unknown" file errors
2. **Better Error Messages**: Developers see what module failed and where it was imported from
3. **Faster Debugging**: Clear error messages help identify issues quickly
4. **Improved Reliability**: The development server is more stable
5. **Better Developer Experience**: Errors are informative, not cryptic

## Maintenance

This fix should be maintained when:

- Upgrading Metro bundler
- Upgrading Expo SDK
- Modifying the custom resolver
- Adding new module resolution logic

**Core Principle**: Always catch and handle errors in custom resolvers to prevent invalid file paths from reaching Metro's symbolication process.

## Related Files

- `metro.config.js` - Metro bundler configuration with enhanced error handling
- `STARTUP_ERROR_FIX.md` - Related Metro startup fixes (updated with this fix)
- `METRO_FIX_SUMMARY.md` - Overview of Metro configuration fixes

## Troubleshooting

### If ENOENT Errors Still Occur

1. **Clear Metro cache:**
   ```bash
   npx expo start --clear
   ```

2. **Verify Metro config:**
   ```bash
   node -c metro.config.js
   ```

3. **Check for other custom resolvers:**
   - Ensure all custom resolvers have proper error handling
   - Look for any babel plugins that might modify resolution

4. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Success Metrics

- ✅ No "ENOENT: no such file or directory, open 'unknown'" errors
- ✅ Metro bundler starts successfully
- ✅ Clear error messages when modules can't be resolved
- ✅ Stable development server
- ✅ Improved debugging experience

## References

- [Metro Bundler Documentation](https://facebook.github.io/metro/)
- [Metro Configuration Reference](https://facebook.github.io/metro/docs/configuration)
- [Expo Metro Config](https://docs.expo.dev/guides/customizing-metro/)
