var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: {
        index:'./src/component/main.vue'
    },
    output: {
        path: path.resolve(__dirname, '../lib'),
        filename: '[name].js',
        library:'ct-adc-transfers',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                }
            }
        ]
    },
    resolve: {
        modules:['src/component','node_modules'],
        extensions: ['.js', '.json','.vue','.css'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    externals: {
        'ct-utility': {
            commonjs: 'ct-utility',
            commonjs2: 'ct-utility',
            amd: 'ct-utility',
            root: 'ct-utility'
        },
        'vue': {
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue',
            root: 'vue'
        }
    }
};