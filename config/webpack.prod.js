"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJsPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const common = require("./common");

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = process.env.ZUCCHINI_BUILD_PATH_PREFIX;

module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  mode: "production",
  devtool: false,
  entry: common.SRC_INDEX_TSX,
  output: {
    // The build folder.
    path: common.BUILD_PROD,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    publicPath: publicPath,
  },
  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ".js",
    ],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.worker\.js$/,
        use: {loader: "worker-loader"},
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: "url-loader",
            options: {limit: 10000, name: "static/media/[name].[hash:8].[ext]"},
          },
          {
            test: /\.js$/,
            include: common.SRC,
            loader: "babel-loader",
            options: {compact: true},
          },
          {
            test: /\.tsx?$/,
            include: common.SRC,
            use: [
              {
                loader: "ts-loader",
                // disable type checker - we will use it in fork plugin
                options: {transpileOnly: true, configFile: common.TSCONFIG},
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {hmr: false},
              },
              {loader: 'css-loader', options: {modules: true}},
              "sass-loader",
            ],
          },
          // "file" loader makes sure assets end up in the `build` folder.
          // When you `import` an asset, you get its filename.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: "file-loader",
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {name: "static/media/[name].[hash:8].[ext]"},
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserJsPlugin({parallel: true}),
      new OptimizeCssAssetsPlugin({}),
    ],
  },
  plugins: [
    common.DEFINE_PLUGIN,
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({inject: true, template: common.SRC_INDEX_HTML}),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new MiniCssExtractPlugin({filename: "static/css/[name].[contenthash].css"}),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({fileName: "asset-manifest.json"}),
    // Perform type checking and linting in a separate process to speed up compilation
    new ForkTsCheckerWebpackPlugin({async: false, tsconfig: common.TSCONFIG, tslint: false}),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
  },
};
