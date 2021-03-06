'use strict';

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {join} = require('path');

const resolveRelativeToProject = relativePath => join(__dirname, relativePath);

const TSCONFIG = resolveRelativeToProject('tsconfig.json');
const SRC = resolveRelativeToProject('src');
const SRC_INDEX_TSX = resolveRelativeToProject('src/index.tsx');
const DIST = resolveRelativeToProject('dist');

module.exports = {
  devtool: 'source-map',
  entry: SRC_INDEX_TSX,
  output: {
    path: DIST,
    filename: 'index.js',
    library: 'Zucchini',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
    ],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        include: SRC,
        use: [
          {loader: 'ts-loader', options: {configFile: TSCONFIG}},
        ],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.scss$/,
        include: SRC,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {modules: {localIdentName: '[path]-[local]'}}},
          {loader: 'sass-loader', options: {includePaths: [SRC]}},
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserJsPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
  },
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
