const webpack = require('webpack');
const path = require('path');

// determine if we are running on production
const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  context: path.join(__dirname, '/src'),
  devtool: dev ? 'inline-sourcemap' : null,
  entry: {
    app: './app.js',
    angular: ['angular', 'angular-route', 'angular-animate', 'angular-resource'],
  },
  output: {
    path: path.join(__dirname, '/public'),
    filename: '[name].min.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
      },
    }],
  },
  plugins: dev ?
    // development build
    [new webpack.optimize.CommonsChunkPlugin({
      names: ['angular'],
    }),
    ] :
    // production build
    [new webpack.optimize.CommonsChunkPlugin({
      names: ['angular'],
    }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        mangle: false,
        sourcemap: false,
      }),
    ],
};
