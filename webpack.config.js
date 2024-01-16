const path = require("path");

module.exports = {
  cache: false,
  entry: "./src/hooks/useHumanWriter.tsx",
  output: {
    filename: "use-typewriter.js",
    path: path.resolve(__dirname, "dist"),
    library: "useTypewriter",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules|\.stories\.tsx$/,
        use: "ts-loader",
      },
    ],
  },
};
