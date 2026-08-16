const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix SDK 54 native Hermes crash
config.resolver.unstable_enablePackageExports = false;

// Force Web to use the UMD MapLibre bundle to prevent import.meta crashes
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'maplibre-gl') {
    return context.resolveRequest(context, 'maplibre-gl/dist/maplibre-gl.js', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });

