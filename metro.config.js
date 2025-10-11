const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

// Configure resolver to handle ESM packages properly
config.resolver.unstable_enablePackageExports = true;

// Configure source extensions to prioritize platform-specific files
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'mjs', 'cjs'];

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
    return {
      filePath: tslibPath,
      type: 'sourceFile',
    };
  }

  // Use the default resolver for everything else
  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
