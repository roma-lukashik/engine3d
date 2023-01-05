const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

module.exports = {
  mode: "development",
  entry: "./index.ts",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(obj|glsl)$/,
        use: "raw-loader",
      },
    ],
  },
  experiments: {
    topLevelAwait: true,
  },
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "models", to: "models" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
}
