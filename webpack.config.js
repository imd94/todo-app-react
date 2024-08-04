const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fse = require("fs-extra");

let cssConfig = {
  test: /\.s[ac]ss$/i,
  use: [
    'css-loader?url=false',
    { 
      loader: 'sass-loader',
      options: { 
        sourceMap: true
      } 
    }
  ]
}

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy images", function () {
      fse.copySync('./app/assets/images', './docs/assets/images')

      /*
        If you needed to copy another file or folder
        such as your "images" folder, you could just
        call fse.copySync() as many times as you need
        to here to cover all of your files/folders.
      */
    })
  }
}

config = {
  entry: "./app/Main.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "app"),
    filename: "bundled.js",
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "app/index-template.html",
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]],
          },
        },
      },
      cssConfig
    ],
  },
}

if (currentTask == "webpackDev" || currentTask == "dev") {
  //cssConfig.use.unshift('style-loader')
  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
  config.devtool = "source-map"
  config.devServer = {
    port: 3000,
    static: {
      directory: path.join(__dirname, "app")
    },
    hot: true,
    liveReload: false,
    historyApiFallback: { index: "index.html" },
  }
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
  )
}


if (currentTask == "webpackBuild" || currentTask == "build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
  config.mode = "production"
  config.output = {
    publicPath: "/",
    path: path.resolve(__dirname, "docs"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  }
  config.plugins.push(
    new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
    new RunAfterCompile()
  )
}

module.exports = config;
