const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: path.join(__dirname, '..', 'src', 'public', 'index.js'),
  },
  output: {
    path: path.join(__dirname, '..', 'dist', 'public'),
    filename: '[name].js',
    chunkFilename: '[name].public.oauth2Server.js',
    globalObject: 'this',
    libraryTarget: 'umd',
  },
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
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {},
          },
          {
            loader: 'css-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  plugins: [],
  resolve: {
    alias: {},
    extensions: ['.ts', '.js'],
  },
}
