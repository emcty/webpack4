const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
let minimist = require("minimist");
let Debug = minimist(process.argv.slice(2)).mode  === "development" ? true : false;

module.exports = {
  cache: true, //开启缓存
  entry: './src/index.js',
  output: {
    filename: '[name].js?[hash:8]', //输出的文件名不会加hash值，但会给html中引入此文件的scrip标签加hash.
    // chunkFilename: '[id].[contentHash:8].js', 提取公共模块
    path: path.resolve("./release")
  },
  devServer:{
    contentBase: "./src",
    port: 3000,
    open: true,
    compress: true,
    hot: true,
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    minimize: !Debug, // [new UglifyJsPlugin({...})]
    splitChunks:{
      chunks: 'async',
      minSize: 30000,//模块大于30k会被抽离到公共模块
      minChunks: 2,//模块出现2次就会被抽离到公共模块
      maxAsyncRequests: 5,//异步模块，一次最多只能被加载5个
      maxInitialRequests: 3,//入口模块最多只能加载3个  
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },
        styles: {
          name: 'common',
          test: /\.css$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css?[hash:8]"
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new CleanWebpackPlugin(['./release']), //当文件名为？hash值时，此时不需要删除输出文件夹
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: "测试",
      minify:{
        removeAttributeQuotes: !Debug,
        collapseWhitespace: !Debug,
      }
    })
  ],
  module:{
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: Debug ? 'style-loader': MiniCssExtractPlugin.loader}, //开发模式下开启'style-loader'可实现更新,如果使用MiniCssExtractPlugin，因为是单独提取了css,以link标签导入，所以样式更改后必须要手动F5才能刷新过来，所以MiniCssExtractPlugin在放在生产环境下。
          {
            loader: `css-loader`,
            options: {
              sourceMap: true,
              minimize: !Debug  //生产模式下开启压缩
            }
          },
          {
            loader: 'postcss-loader',
            options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
              plugins: () => [
                  require('precss')(), //不需要也能生效？
                  require('postcss-cssnext')(), //CSS浏览器兼容
              ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        include: path.resolve('./src'),
        loader: 'vue-loader'
      },
      {
        test: /\.(?:woff2?|eot|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          name: Debug ? '[name].[ext]' : '[name]-[hash:10].[ext]'
        }
      },
      {
        test: /\.(?:png|jpe?g|gif)$/,
        loaders: Debug
          ? [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: '[name].[ext]'
                }
              }
            ]
          : [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: '[name]-[hash:10].[ext]'
                }
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  progressive: true,
                  optimizationLevel: 7,
                  interlaced: false,
                  pngquant: {
                    quality: '65-90',
                    speed: 4
                  }
                }
              }
            ]
      },

    ]
  },
}