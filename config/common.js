'use strict';

const {DefinePlugin} = require('webpack');
const path = require('path');
const fs = require('fs');

function resolveRelativeToProject (relativePath) {
  return path.resolve(__dirname + '/../', relativePath);
}

module.exports = {
  BUILD_PROD: resolveRelativeToProject('build/prod'),
  BUILD_DEV: resolveRelativeToProject('build/dev'),
  SRC_INDEX_HTML: resolveRelativeToProject('src/index.html'),
  SRC_INDEX_TSX: resolveRelativeToProject('src/index.tsx'),
  PACKAGE_JSON: resolveRelativeToProject('package.json'),
  SRC: resolveRelativeToProject('src'),
  TSCONFIG: resolveRelativeToProject('tsconfig.json'),

  DEFINE_PLUGIN: new DefinePlugin({
    'ZUCCHINI_DEFAULT_LIBRARIES': process.env.ZUCCHINI_DEFAULT_LIBRARIES_FILE
      ? fs.readFileSync(process.env.ZUCCHINI_DEFAULT_LIBRARIES_FILE, 'utf8')
      : '[]',
  }),
};
