/**
 * @author rubyisapm
 */

var path = require('path');
var utils = require('../build/utils');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require('./index');
var scriptServer = {
    dev: '//staticadm.tcy365.org:1506/A',//开发版
    test: '//staticadm.tcy365.org:1507/A',//提测版
    testStable: '//staticadm.tcy365.org:1505/A',//测试稳定版
    pre: '//staticadm.tcy365.com:2505/A',//预发版
    official: '//staticadm.tcy365.com/A',//正式版
    docker: '//static.tcy365.{domain_suffix}/A'
};
var text = {
    dev: '开发版1506',
    test: '提测版1507',
    testStable: '测试版1505',
    pre: '预发版2505',
    official: '正式版',
    docker: 'docker'
};
var viewFile = config.viewFile;

function htmlPlugins(prod) {
    var ejsTemplates = utils.readFilesInDir(path.resolve(__dirname, '../ejs'));

    var htmlPlugins = [];
    ejsTemplates.map(function(file) {
        var filename = path.relative('./ejs/', file).split('.')[0];
        var option = {
            filename: path.resolve(config.build.assetsRoot, viewFile + '/' + filename + '.html'),
            template: file,
            inject: false,
            script: '<script src="' + config.dev.assetsPublicPath + config.dev.assetsSubDirectory + '/' + config.version + '/js/' + filename + '.js?v=' + (+new Date()) + '"></script>'
        };
        if (prod) {
            if (config.toScriptServer) {
                Object.keys(scriptServer).map(function(serverKey) {
                    var server = scriptServer[serverKey];
                    var optionClone = JSON.parse(JSON.stringify(option));
                    optionClone.script = '<script src="' + server + config.build.assetsPublicPath + config.build.assetsSubDirectory + '/' + config.version + '/js/' + filename + '.js?v=' + (+new Date()) + '"></script>';
                    optionClone.filename = path.resolve(config.build.assetsRoot, 'html/', text[serverKey] + '/' + filename + '.' + config.pageExtend);
                    optionClone.minify = {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true
                    };
                    optionClone.chunksSortMode = 'dependency';
                    htmlPlugins.push(new HtmlWebpackPlugin(optionClone));
                });

            } else {
                option.filename = path.resolve(config.build.assetsRoot, 'html/', viewFile + '/' + filename + '.' + config.pageExtend);
                option.script = '<script src="' + config.build.assetsPublicPath + config.build.assetsSubDirectory + '/' + config.version + '/js/' + filename + '.js?v=' + (+new Date()) + '"></script>';
                option.minify = {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                };
                option.chunksSortMode = 'dependency';
                htmlPlugins.push(new HtmlWebpackPlugin(option));
            }

        } else {
            htmlPlugins.push(new HtmlWebpackPlugin(option));
        }
    });
    return htmlPlugins;
}

module.exports = htmlPlugins;
