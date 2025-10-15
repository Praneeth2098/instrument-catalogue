const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce file watching to prevent EMFILE error
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Exclude node_modules from watching
config.watcher = {
  additionalExts: ['cjs', 'mjs'],
  watchman: {
    deferStates: ['hg.update'],
  },
};

// Reduce the number of files being watched
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/.*/,
];

module.exports = config;
