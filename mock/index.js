var proxy = require("express-http-proxy");
var mockData = require("./define");
var bodyParser = require('body-parser')

var apiProxy = function() {
    if (mockData.define.isProxy) {
        return proxy(mockData.define.domain, {
            forwardPath: function(req, res) {
                return req._parsedUrl.path
            }
        });
    } else {
        return function(req, res, next) {
            var useBodyParam = ['post', 'put', 'delete', 'options', 'patch', 'propfind', 'proppatch', 'mkcol', 'copy', 'move', 'lock', 'unlock'];
            var useQueryParam = ['get', 'head'];
            var method = req.method.toLocaleLowerCase();
            var isQueryLike = useQueryParam.indexOf(method) > -1;
            var queryParams = req.query;//获取query字符串的对象形式(get实质就是添加query) get head
            var bodyParams = req.body;//获取请求主体中的数据 post put delete options patch PROPFIND PROPPATCH MKCOL COPY MOVE LOCK UNLOCK
            var path=req.path.replace(/\/$/,'');

            if (req.baseUrl+path) {
                var reqs = mockData.getInterFace(req.baseUrl+path);
                var hasSame = Array.isArray(reqs);
                if (hasSame) {
                    var matchReqs = reqs.filter(function(item) {
                        var paramsMatch = false,
                            methodMatch = false,
                            contentTypeMatch = false,
                            specParamMatch = false;
                        if (typeof item.$params !== 'undefined') {
                            var paramKeys;
                            if (isQueryLike) {
                                paramKeys = Object.keys(queryParams);
                            } else {
                                paramKeys = Object.keys(bodyParams);
                            }
                            paramsMatch = item.$params.filter(function(item) {
                                return paramKeys.indexOf(item) === -1;
                            }).length === 0;
                        } else {
                            paramsMatch = true;
                        }
                        if (typeof item.$method !== 'undefined') {
                            methodMatch = item.$method.toLowerCase() === method;
                        } else {
                            methodMatch = true;
                        }
                        if (typeof item.$contentType !== 'undefined') {
                            contentTypeMatch = req.is(item.$contentType);
                        } else {
                            contentTypeMatch = true;
                        }
                        if (typeof item.$specParams !== 'undefined') {
                            var params;
                            if (isQueryLike) {
                                params = queryParams;
                            } else {
                                params = bodyParams;
                            }
                            for (var i in item.$specParams) {
                                if (item.$specParams.hasOwnProperty(i)) {
                                    specParamMatch = item.$specParams[i] === params[i];
                                    if (!specParamMatch) {
                                        break;
                                    }
                                }
                            }
                        } else {
                            specParamMatch = true;
                        }
                        return paramsMatch && methodMatch && contentTypeMatch && specParamMatch;
                    });
                    if (matchReqs.length > 0) {
                        return res.json(matchReqs[0].$res);
                    } else {
                        res.json({
                            "msg": "nodata"
                        });
                    }
                } else {
                    res.json(mockData.getInterFace(req.baseUrl+path));
                }
            } else {
                res.json({
                    "msg": "nodata"
                });
            }
        };
    }
}();

module.exports = function(app) {
    //模拟数据
    if (mockData.define.isProxy && mockData.define.matchPath !== '') {
        app.use(mockData.define.matchPath, apiProxy);
    } else {
        var keys = mockData.interFaces.keys();  //遍历Key
        for (var key of keys) {
            app.use(bodyParser.urlencoded({extended:true}));
            app.use(bodyParser.json());
            app.use(key, apiProxy);
        }
    }
};
