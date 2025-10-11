# Worklets Web Fix - Quick Reference

## The Problem

When running the app on **web in development mode**, this error occurred:

```
Uncaught Error
[Worklets] createSerializableObject should never be called in JSWorklets.
```

## The Fix

Two changes were made to resolve this:

### 1. Babel Configuration (babel.config.js)

```javascript
// Only add reanimated plugin for native platforms, not web
if (platform !== 'web') {
  plugins.push('react-native-reanimated/plugin');
}
```

### 2. Worklets Library Patch

Patched `react-native-worklets` to skip web serialization in dev mode:

```diff
-if (__DEV__) {
+if (__DEV__ && !SHOULD_BE_USE_WEB) {
   // ... serialization code
}
```

## How to Use

### Fresh Install

```bash
# Clone and install (patches apply automatically)
git clone <repo>
npm install

# Start web development
npx expo start --web --clear
```

### Existing Install

```bash
# Update dependencies
npm install

# Patches apply automatically via postinstall
# Verify with:
./test-worklets-web-fix.sh

# Start development
npx expo start --web --clear
```

## Verification

```bash
# Run automated test
./test-worklets-web-fix.sh

# Check patch is applied
cat node_modules/react-native-worklets/lib/module/threads.js | grep "SHOULD_BE_USE_WEB"
# Should show: if (__DEV__ && !SHOULD_BE_USE_WEB) {
```

## Platform Support

| Platform | Worklets | Animations | Status |
|----------|----------|------------|---------|
| **Web** | Limited (web-compatible only) | ✅ Works | ✅ Fixed |
| **iOS** | ✅ Full support | ✅ Native animations | ✅ Works |
| **Android** | ✅ Full support | ✅ Native animations | ✅ Works |

## Key Files

- `babel.config.js` - Platform-specific Babel configuration
- `patches/react-native-worklets+0.5.1.patch` - Library patch file
- `package.json` - Contains postinstall script for patches
- `WORKLETS_WEB_FIX.md` - Complete documentation
- `test-worklets-web-fix.sh` - Automated validation

## Troubleshooting

### Patch Not Applied

```bash
# Manually apply
npx patch-package

# Verify
./test-worklets-web-fix.sh
```

### Error Still Occurs

```bash
# Clean install
rm -rf node_modules .expo
npm install
npx expo start --web --clear
```

### After Upgrading Dependencies

```bash
# Check if patch still applies
npm install

# If patch fails, may need to update for new version
# See WORKLETS_WEB_FIX.md for instructions
```

## What Changed

### Before ❌

- Web builds failed with worklets serialization error
- Development mode broken on web
- Had to use production mode or native only

### After ✅

- Web builds work in development mode
- Full platform support (web + native)
- Automatic patch application on install
- No code changes needed in app

## More Information

- **Complete Documentation**: [WORKLETS_WEB_FIX.md](./WORKLETS_WEB_FIX.md)
- **Original Fix**: [WORKLETS_FIX.md](./WORKLETS_FIX.md)
- **README**: [README.md](./README.md)

## Quick Commands

```bash
# Development
npm install                           # Install with patches
./test-worklets-web-fix.sh           # Validate fix
npx expo start --web --clear         # Start web dev
npx expo start --clear               # Start native dev

# Troubleshooting
npx patch-package                    # Apply patches manually
npm run lint                         # Check code quality
npx tsc --noEmit                     # Type check
```

## Technical Summary

**Root Cause**: `react-native-worklets` calls serialization methods at module load time in dev mode, which fails on web where JSWorklets doesn't support serialization.

**Solution**: 
1. Skip Babel transformation on web (no worklets needed)
2. Patch library to check platform before serialization

**Impact**: Minimal, surgical changes to configuration and library code. Full cross-platform support maintained.
