module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      // Reanimated plugin MUST be last and only for native
      ...(process.env.EXPO_PUBLIC_PLATFORM !== 'web' ? ['react-native-reanimated/plugin'] : []),
    ],
  };
};
