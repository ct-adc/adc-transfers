/**
 * @author rubyisapm
 */
var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: {
        index:'./src/LLTransfer/index.js'
    },
    output: {
        path: path.resolve(__dirname, './lib'),
        filename: '[name].js',
        library:'transfers',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },{
                test: /\.css$/,
                loader: 'css-loader'
            },{
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
            }
        ]
    },
    resolve: {
        modules:[path.resolve(__dirname, 'src/js/component'),path.resolve(__dirname, 'src/js/module'),'node_modules'],
        extensions: ['.js', '.json','.vue','.css'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    }
    //externals:[
    //  function(context, request, callback) {
    //    if (/^ct-utility$/.test(request)){
    //      return callback(null, 'commonjs ' + request);
    //    }
    //    callback();
    //  }
    //]
};