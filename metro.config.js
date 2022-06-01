// https://github.com/janeasystems/nodejs-mobile-react-native#duplicate-module-name

const blacklist = require('metro-config/src/defaults/blacklist')

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    blacklistRE: blacklist([/nodejs-assets\/.*/, /android\/.*/, /ios\/.*/]),
  },
}
