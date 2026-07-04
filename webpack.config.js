const path = require('path');
const webpack = require('webpack');

// 共通のモジュールルール
const commonModule = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
    },
  ],
};

// ==========================================
// 1. 画面側（コンテンツスクリプトやオプション画面）の設定
// ==========================================
const webConfig = {
  context: `${__dirname}/src/js`,
  target: 'web', 
  entry: {
    contents: './contents.js',
    options: './options.js',
    insert: './insert.js',
    token: './token.js',
  },
  output: {
    path: path.resolve(__dirname, './build/js'),
    filename: '[name].bundle.js',
  },
  devtool: false,
  module: commonModule,
};

// ==========================================
// 2. バックグラウンド（Service Worker）の設定
// ==========================================
const workerConfig = {
  context: `${__dirname}/src/js`,
  target: 'webworker',
  entry: {
    background: './background.js',
  },
  output: {
    path: path.resolve(__dirname, './build/js'),
    filename: '[name].bundle.js',
  },
  devtool: false,
  module: commonModule,
};

module.exports = [webConfig, workerConfig];