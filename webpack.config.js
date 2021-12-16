const path = require('path');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin'); // installed via npm

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, 'src') + '/scripts/index.js',
  },
  output: {
    publicPath: '',
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
    // stats: {
    //   children: true,
    // }
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: 'babel-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader?name=./images/[contenthash].[ext]',
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: 'file-loader?name=./vendor/[contenthash].[ext]',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
};