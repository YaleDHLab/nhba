const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./config');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  node_modules: path.join(__dirname, 'node_modules'),
};

// Specify babel configuration
const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

// Configuration options used in dev and prod environments
const common = {
  entry: {
    app: PATHS.app,
  },

  // React routes require the history api fallback
  devServer: {
    historyApiFallback: true,
  },

  // Specify which assets webpack should load
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  // Specify where compiled assets will be bundled
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },

  // Include loaders for styles and jsx
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: [PATHS.app, PATHS.node_modules],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file-loader?name=[name].[ext]'],
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app,
      },
    ],
  },
};

// Development configuration
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    // Enable sourcemaps for debugging
    devtool: 'eval-source-map',

    // Configure server
    devServer: {
      contentBase: PATHS.build,
      historyAPIFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors amd minimize output:
      stats: 'errors-only',

      // When using Vagrant or other VM, set:
      // host: process.env.HOST || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default
      host: process.env.HOST,
      port: process.env.PORT || config.api.port + 1,
    },

    plugins: [
      // Use hot module replacement
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
}

// Bundled development configuration
if (TARGET === 'build' || !TARGET) {
  module.exports = merge(common, {
    plugins: [new webpack.optimize.OccurrenceOrderPlugin()],
  });
}

// Production configuration
if (TARGET === 'compress' || !TARGET) {
  module.exports = merge(common, {
    plugins: [
      // Optimize React library for production
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),

      // Squash uglify warnings like 'Condition always true'
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),

      new webpack.optimize.OccurrenceOrderPlugin(),
    ],
  });
}
