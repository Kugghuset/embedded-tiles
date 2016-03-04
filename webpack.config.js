'use strict'

var path = require('path');
var LiveReload = require('webpack-livereload-plugin');

module.exports = {
  context: path.resolve('./public/scripts'),
  entry: './app',
  output: {
    filename: './bundle.js',
    path: './public/dist'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  plugins: [
    new LiveReload({ appendScriptTag: true })
  ],
  resolve: {
    extensions: ['', '.js']
  }
};