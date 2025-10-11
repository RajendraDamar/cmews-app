# Documentation Index

This folder contains detailed documentation about various fixes and improvements made to the cmews-app project.

## Metro Bundler & Build Configuration

### [METRO_TSLIB_FIX.md](./METRO_TSLIB_FIX.md) ⭐ **CURRENT SOLUTION**
**Status**: ✅ Active - October 2025

Complete guide to fixing the Metro bundler tslib ESM resolution error:
- **Problem**: `Cannot destructure property '__extends' of 'tslib.default' as it is undefined`
- **Solution**: Custom Metro resolver to force tslib to CommonJS version
- **Impact**: Enables cross-platform compatibility (web, iOS, Android)
- **Testing**: Includes validation procedures and testing scripts

**Key Features**:
- Works on all platforms
- Allows moti + framer-motion on web
- No app code changes required
- Future-proof with package exports support

### [FRAMER_MOTION_REMOVAL_SUMMARY.md](./FRAMER_MOTION_REMOVAL_SUMMARY.md)
**Status**: 📚 Historical reference (superseded by METRO_TSLIB_FIX.md)

Original documentation about removing framer-motion to prevent web-only dependencies. The approach described here (blocking framer-motion entirely) has been superseded by the more sophisticated tslib resolver fix.

**Still Relevant**:
- Animation strategy overview
- Package dependencies status
- React Native Reanimated configuration
- Code verification procedures

**Superseded**:
- Metro blockList approach (replaced with custom resolver)
- Complete framer-motion blocking (now works on web)

---

## Quick Reference

### Current Active Configurations

**Metro Config** (`metro.config.js`):
```javascript
// Custom resolver for tslib
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib' || moduleName.startsWith('tslib/')) {
    return { filePath: path.join(context.projectRoot, 'node_modules/tslib/tslib.js'), type: 'sourceFile' };
  }
  // Default resolver for other modules
};
```

**Babel Config** (`babel.config.js`):
```javascript
// react-native-reanimated/plugin must be last
plugins.push('react-native-reanimated/plugin');
```

### Testing & Validation

Run the comprehensive test suite:
```bash
./test-metro-fix.sh
```

Or test individual components:
```bash
# Metro config validation
node -e "require('./metro.config.js'); console.log('✓ Config OK')"

# Web export
npx expo export --platform web

# Development server
npx expo start --web --clear
```

### Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| Web      | ✅     | Uses moti + framer-motion via tslib fix |
| iOS      | ✅     | Uses moti + react-native-reanimated |
| Android  | ✅     | Uses moti + react-native-reanimated |

---

## Contributing

When adding new documentation:
1. Create a descriptive markdown file
2. Add an entry to this index
3. Include status (Active/Historical/Deprecated)
4. Link related documentation
5. Update the Quick Reference if needed

---

## See Also

- [CHANGES.md](../CHANGES.md) - Complete change history
- [IMPLEMENTATION.md](../IMPLEMENTATION.md) - Implementation details
- Project root for `metro.config.js`, `babel.config.js`, etc.
