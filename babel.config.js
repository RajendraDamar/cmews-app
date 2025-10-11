module.exports = function (api) {
  // Get the platform from the babel caller (set by Metro)
  // IMPORTANT: caller() must be called before cache() to avoid caching errors
  const platform = api.caller((caller) => caller?.platform);
  
  api.cache(true);

  // react-native-reanimated/plugin must be last
  // Note: react-native-reanimated already includes worklets functionality
  // Only add the plugin for native platforms (iOS/Android), not web
  // This prevents worklets initialization errors on web
  const plugins = platform !== 'web' ? ['react-native-reanimated/plugin'] : [];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
