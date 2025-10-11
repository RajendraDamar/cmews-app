const { getDefaultConfig } = require('expo/metro-config');

const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

// Block framer-motion to prevent web-only dependencies in React Native builds
config.resolver.blockList = [
  /node_modules\/framer-motion\/.*/,
];

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
