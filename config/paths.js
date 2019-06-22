"use strict";

const path = require("path");

function resolveRelativeToProject (relativePath) {
  return path.resolve(__dirname + "/../", relativePath);
}

module.exports = {
  BUILD: resolveRelativeToProject("build"),
  PUBLIC: resolveRelativeToProject("public"),
  INDEX_HTML: resolveRelativeToProject("src/index.html"),
  INDEX_TSX: resolveRelativeToProject("src/index.tsx"),
  PACKAGE_JSON: resolveRelativeToProject("package.json"),
  SRC: resolveRelativeToProject("src"),
  TSCONFIG: resolveRelativeToProject("tsconfig.json"),
};
