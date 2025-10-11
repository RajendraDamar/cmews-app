module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  // react-native-reanimated/plugin must be last
  // Note: react-native-reanimated already includes worklets functionality
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
