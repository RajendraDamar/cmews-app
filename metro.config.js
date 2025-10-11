const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const fs = require('fs');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname, {
  // Disable CSS support for web to avoid worklets issues
  isCSSEnabled: false,
});

// Configure resolver to handle ESM packages properly
config.resolver.unstable_enablePackageExports = true;

// Add platforms configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure source extensions to prioritize platform-specific files
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'mjs', 'cjs'];

// Add watchFolders to ensure Metro watches the right directories
config.watchFolders = [__dirname];

// Configure transformer to handle ESM modules
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Custom resolver to handle problematic ESM packages
const defaultResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force tslib to always resolve to the CommonJS version
  // This prevents "Cannot destructure property '__extends' of 'tslib.default'" error
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
    } catch (_err) {
      // Fall through to default resolver if check fails
    }
  }

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
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
