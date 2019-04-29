const path = require("path");
const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");
const CopyPlugin = require("copy-webpack-plugin");

console.log(nodeExternals());

module.exports = {
  entry: slsw.lib.entries,
  mode: "development",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  externals: [
    nodeExternals({
      modulesDir: path.resolve(__dirname, "../../node_modules")
    })
  ],
  target: "node",
  plugins: [new CopyPlugin([{ from: "migrations", to: "migrations" }])],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  }
};