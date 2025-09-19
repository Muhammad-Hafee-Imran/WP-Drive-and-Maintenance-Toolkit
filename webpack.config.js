// webpack.config.js
const path = require('path');
const wpDefaults = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...wpDefaults,
  entry: {
    'google-drive/index': path.resolve(__dirname, 'src/React/google-drive-ui/index.jsx'),
    'posts-maintenance/index': path.resolve(__dirname, 'src/React/posts-maintenance-ui/index.jsx'),

  },
  output: {
    ...wpDefaults.output,
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    assetModuleFilename: '[name][ext]',
    clean: false,
  },
  externals: {
     ...wpDefaults.externals,
  react: 'React',
  'react-dom': 'ReactDOM',
  '@wordpress/element': 'wp.element',
  '@wordpress/i18n': 'wp.i18n',
  '@wordpress/components': 'wp.components',
  '@wordpress/data': 'wp.data',
  '@wordpress/api-fetch': 'wp.apiFetch',
  },

 

  devtool: false,  // disable source maps in production
  mode: 'production',  // ensure optimizations run
};
