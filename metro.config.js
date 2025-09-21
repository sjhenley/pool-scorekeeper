const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const nativeWindConfig = withNativeWind(config, { input: './global.css' });

module.exports = withStorybook(
  nativeWindConfig
);
