const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    oauth2Server: path.join(__dirname, '..', 'src', 'app.ts'),
    initializer: path.join(__dirname, '..', 'src', 'utils', 'initializer.ts'),
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].server.oauth2Server.js',
    libraryTarget: 'umd',
  },
  target: 'node',
  node: {
    fs: 'empty',
    net: 'empty',
  },
  externals: [/^[a-z\-0-9]+$/],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-syntax-dynamic-import',
          ],
        },
      },
      {
        test: /\.(ts)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.pug$/,
        loaders: [
          {
            loader: 'pug-loader',
          },
        ],
      },
    ],
  },
  plugins: [],
  resolve: {
    alias: {},
    extensions: ['.ts', '.js', '.pug'],
  },
}
