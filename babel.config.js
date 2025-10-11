module.exports = function (api) {
  api.cache(true);
<<<<<<< HEAD
  
=======
  let plugins = [];

  // Get the platform from the babel caller (set by Metro)
  const platform = api.caller((caller) => caller?.platform);

  // react-native-reanimated/plugin must be last
  // Note: react-native-reanimated already includes worklets functionality
  // Only add the plugin for native platforms (iOS/Android), not web
  // This prevents worklets initialization errors on web
  if (platform !== 'web') {
    plugins.push('react-native-reanimated/plugin');
  }

>>>>>>> 4021367bdb50792258062acf76a2b9855f1c8a8e
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      // Reanimated plugin MUST be last and only for native
      ...(process.env.EXPO_PUBLIC_PLATFORM !== 'web' ? ['react-native-reanimated/plugin'] : []),
    ],
  };
};
