const webpack = require("webpack");
const config = require("./webpack.config.js");

webpack(config, () => {
  console.log(arguments);
})
