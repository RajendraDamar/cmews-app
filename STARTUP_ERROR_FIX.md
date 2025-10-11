# Metro Bundler Startup Error Fix - October 2025

## Problem Description

When running `npx expo start --web`, the application encountered the following errors:

```
Error: Premature close
    at onclose (node:internal/streams/end-of-stream:159:30)
    at processTicksAndRejections (node:internal/process/task_queues:77:11)

Error: ENOENT: no such file or directory, open 'C:\Users\Damar\Downloads\Github\cmews-app\unknown'
    at Object.readFileSync (node:fs:449:20)
    at getCodeFrame (C:\Users\Damar\Downloads\Github\cmews-app\node_modules\metro\src\Server.js:997:18)
    at Server._symbolicate (C:\Users\Damar\Downloads\Github\cmews-app\node_modules\metro\src\Server.js:1079:22)
```

## Root Cause

The error occurred in Metro's error symbolication process. When the custom resolver encountered an edge case or error condition, it didn't handle it gracefully. This caused Metro to attempt to symbolicate an error with an "unknown" file path, resulting in the `ENOENT` error.

Specifically:
1. Metro bundler encountered an issue during module resolution
2. The custom resolver didn't properly handle all edge cases
3. Metro tried to generate a code frame for the error
4. Metro attempted to read a file with path "unknown" (which doesn't exist)
5. This caused the bundler to crash with `ENOENT` error

## Solution Implemented

### 1. Added File Existence Validation

```javascript
const fs = require('fs');

// In the custom resolver:
if (moduleName === 'tslib' || moduleName.startsWith('tslib/')) {
  const tslibPath = path.join(context.projectRoot || __dirname, 'node_modules/tslib/tslib.js');
  // Verify the file exists before returning
  try {
    if (fs.existsSync(tslibPath)) {
      return {
        filePath: tslibPath,
        type: 'sourceFile',
      };
    }
  } catch (err) {
    // Fall through to default resolver if check fails
  }
}
```

### 2. Added Watch Folders Configuration

```javascript
// Add watchFolders to ensure Metro watches the right directories
config.watchFolders = [__dirname];
```

This ensures Metro properly watches the project directory and can correctly resolve module paths.

### 3. Comprehensive Error Handling

The resolver now wraps all resolution attempts in try-catch blocks to prevent Metro's symbolication process from receiving invalid file paths:

```javascript
// Use the default resolver for everything else
// Wrap in try-catch to prevent Metro symbolication errors with invalid file paths
try {
  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }
} catch (_error) {
  // If default resolver fails, try the fallback
  // This prevents Metro from receiving invalid file paths during error symbolication
}

// Fallback to context's resolveRequest
// Also wrap in try-catch to handle any resolution errors gracefully
try {
  return context.resolveRequest(context, moduleName, platform);
} catch (error) {
  // If all resolution attempts fail, throw a descriptive error
  // This ensures Metro receives a proper error instead of an invalid file path
  throw new Error(
    `Failed to resolve module '${moduleName}' from '${context.originModulePath || 'unknown'}': ${error.message}`
  );
}
```

**Key improvement:** When module resolution fails, Metro now receives a descriptive error message with proper context (module name and origin path) instead of attempting to read a file with an "unknown" path, which would cause the ENOENT error.

### 4. Fixed TypeScript Errors

Fixed a TypeScript compilation error in `components/profile-modal.tsx` that could have caused runtime issues.

## Testing & Validation

### Web Export Test ✅
```bash
npx expo export --platform web
```

**Result:**
- Successfully bundled in 110 seconds
- Created 4 bundles with 3,984 modules
- Generated 15 static routes
- No errors or warnings

### Dev Server Test ✅
```bash
npx expo start --web --clear
```

**Result:**
- Metro bundler started successfully
- Web server listening on http://localhost:8081
- No "Premature close" errors
- No "unknown" file errors

## How to Use

### Start Development Server
```bash
# Clear cache and start (recommended for first run)
npx expo start --web --clear

# Regular start
npx expo start --web
```

### Export for Production
```bash
npx expo export --platform web
```

### Troubleshooting

If you still encounter issues:

1. **Clear all caches:**
   ```bash
   rm -rf .expo node_modules/.cache
   npx expo start --clear
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verify Metro config:**
   ```bash
   node -c metro.config.js
   ```

## Technical Details

### Metro's Symbolication Process

Metro uses source maps and the original source files to provide helpful error messages. When an error occurs:

1. Metro captures the error stack trace
2. Metro tries to map the stack trace to original source code
3. Metro reads the source file to show context around the error
4. If the file path is invalid ("unknown"), Metro crashes with `ENOENT`

### Why the Custom Resolver Matters

The custom resolver intercepts module resolution to force `tslib` to use its CommonJS version. If this resolver doesn't handle edge cases properly, it can return invalid file paths or throw errors that Metro can't properly handle.

### The "Premature Close" Error

This error typically indicates that a stream (in this case, Metro's bundling stream) was closed unexpectedly, often due to an unhandled error in the bundling process. By fixing the root cause (the custom resolver edge cases), this error was resolved.

## Related Files

- `metro.config.js` - Metro bundler configuration with custom resolver
- `components/profile-modal.tsx` - Fixed TypeScript error
- `METRO_FIX_SUMMARY.md` - Previous Metro fixes (tslib resolution)
- `VISUAL_GUIDE.md` - Visual guide to Metro configuration
- `WORKLETS_FIX.md` - Fix for react-native-worklets conflict (October 2025)

## Success Metrics

- ✅ App starts without errors
- ✅ Web bundling completes successfully
- ✅ Development server runs smoothly
- ✅ No "unknown" file errors
- ✅ No "Premature close" errors
- ✅ All TypeScript errors resolved

## Maintenance

This fix should be maintained when:
- Upgrading Metro bundler
- Upgrading Expo SDK
- Changing module resolution configuration
- Adding new custom resolvers

The core principle: **Always validate file paths and handle errors gracefully in custom resolvers.**
