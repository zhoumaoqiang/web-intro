const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: "development",
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {test: /\.(gif|svg|png|jpg)$/, use: ['file-loader']},
      {test: /\.xml$/, use: ['xml-loader']},
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    new CleanWebpackPlugin(['dist'])
  ]
} 