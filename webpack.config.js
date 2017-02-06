var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('style/[name].css');
module.exports = {
  context: path.resolve(__dirname, "./example"),
  entry: {
    LLTransferSimple:'./LLTransfer/simple/index.js',
    TTTransferSimple:'./TTTransfer/simple/index.js'
  },
  output: {
    path: path.resolve(__dirname, './asset'),
    publicPath: '/asset/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        enforce:'pre',
        test: /\.js$/, // include .js files
        exclude: /node_modules/ // exclude any and all files in the node_modules folder
        //loader: "jshint-loader"
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this nessessary.
            'css':'vue-style-loader!css-loader',
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract(['css-loader'])
      }
    ]
  },
  resolve: {
    modules:[path.resolve(__dirname, 'src/js/component'),path.resolve(__dirname, 'src/js/module'),'node_modules'],
    extensions: ['.js', '.json','.vue','.css','.scss'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
    //proxy:{
    //  '**': 'http://localhost:3000'
    //}
  },
  performance: {
    hints: false
  },
  devtool: '#source-map',
  plugins:[extractCSS]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
