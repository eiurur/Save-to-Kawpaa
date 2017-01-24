const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: `${__dirname}/src/js`,
  entry: {
    background: './background.js',
    contents: './contents.js',
    options: './options.js',
    insert: './insert.js',
    retrieveToken: './retrieveToken.js'
  },
  output: {
    path: path.resolve(__dirname, './build/js'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        comments: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-3'],
            module: true
          },
        }],
        exclude: /node_modules/
      }
    ]
  }
}