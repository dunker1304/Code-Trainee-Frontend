const env = require("./env-config.js");

module.exports = {
  presets: [
    "next/babel"
  ],
  plugins: [
    ["transform-define", env],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["module-resolver", {
      root: ["."],
      alias: {
        styles: "./styles"
      },
      cwd: "babelrc",
    }],
    ["lodash"],
    ["import", {
      libraryName: "antd"
    }]
  ]
};  