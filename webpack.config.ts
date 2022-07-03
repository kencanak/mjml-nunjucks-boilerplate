import * as path from 'path';
import { ASSETS, DIST_FOLDER, SRC_FOLDER } from './webpack-plugins/utils';
import NunjucksBuild from './webpack-plugins/nunjucks-build';
import * as BrowserSyncPlugin from 'browser-sync-webpack-plugin';
const CopyPlugin = require('copy-webpack-plugin');
const compress = require('compression');

module.exports = (env: any, argv: any) => {
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
      'base': [
        './src/index.ts',
      ],
    },
    module: {
      rules: [
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
    },
    devServer: {
      static: path.join(__dirname, DIST_FOLDER),
      hot: true,
    },
    plugins: [
      new NunjucksBuild(),
      new CopyPlugin({
        patterns: ASSETS.map((asset) => {
          return {
            from: path.join(__dirname, SRC_FOLDER, asset),
            to: path.join(__dirname, DIST_FOLDER, asset),
            noErrorOnMissing: true,
          };
        }),
      }),
      // Browsersync for develpment server, only runs with --watch flag.
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // through BrowserSync
        proxy: 'http://localhost:8080/',
        notify: false,
        middleware: [compress()],
        reloadDelay: 200,
        open: false,
      }),
    ],
    optimization: {
      concatenateModules: false,
      minimizer: [
      ],
    },
    performance: {
      maxEntrypointSize: 512000,
    },
  };
};
