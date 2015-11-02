var express = require('express');
var router = express.Router();
var common = require('./common');
var config = require('../profile/config');
var _ = require('underscore');
var error = require('../utils/error');
var Promise = require('bluebird');
var docUtils = require('../utils/docUtils');


/**
 * 下发云设置
 * @param req
 * @param res
 * @param next
 */
var distributeClientConfig = function (req, res, next) {
    res.body = config.wifiClientSetting;
    next();
};

/**
 * 测速地址列表获取
 * @param req
 * @param res
 * @param next
 */
var testDLSList = function (req, res, next) {
    log.debug('get ', req.location.country, ' for testspeedlist');
    var result = config.dlsTestList[req.location.country] ;
    if(!result){
        result =  config.dlsTestList['US'];
    }
    res.body = result;
    next();
};


var apiVersion = 1;

var apiProfile = [
    {
        method     : 'get',
        path       : '/config/client',
        description: '获取客户端设置',
        summary    : '获取客户端设置,目前以配置文件的形式保存在客户端',
        version    : apiVersion,
        params     : [],
        responses  : {
            200: {
                description: '客户端设置推送',
                schema     : {
                    type: 'object', properties: {
                        code: {
                            type       : 'number',
                            description: 'error code',
                            default    : 0
                        },
                        msg : {type: 'string', description: 'error message'},
                        data: {
                            type      : 'object',
                            properties: {
                                enableWifiCollect  : {
                                    type       : 'boolean',
                                    description: '是否允许采集',
                                    default    : true
                                },
                                showFreeWifiCount  : {
                                    type       : 'number',
                                    description: '显示免费wifi的数量',
                                    default    : 5
                                },
                                gatherWifiCountOnce: {
                                    type       : 'number',
                                    description: '每次采集wifi信息上传记录数',
                                    default    : 10
                                },
                                gatherNSWifi       : {
                                    type       : 'boolean',
                                    description: '采集不允许分享的wifi密码',
                                    default    : true
                                }
                            }
                        }
                    }
                },
                examples   : {
                    "application/json": {
                        "code": 0,
                        "msg" : "",
                        "data": {
                            enableWifiCollect  : true,
                            showFreeWifiCount  : 5,
                            gatherWifiCountOnce: 10,
                            gatherNSWifi       : true
                        }

                    }
                }
            }
        },
        handler    : [distributeClientConfig]
    },
    {
        method     : 'get',
        path       : '/config/dlslist',
        version    : apiVersion,
        summary    : '测速地址列表',
        description: '根据IP反查国家返回该国家的测速地址 \n' +
        '如无法识别国家默认使用美国下载地址 \n',
        params     : [],
        responses  : {
            200: {
                description: '测速地址',
                schema     : {
                    type: 'object', properties: {
                        code: {
                            type       : 'number',
                            description: 'error code',
                            default    : 0
                        },
                        msg : {type: 'string', description: 'error message'},
                        data: {
                            type : 'array',
                            items: {type: 'string', description: '下载地址'}

                        }
                    }
                },
                examples   : {
                    "application/json": {
                        "code": 0,
                        "msg" : "",
                        "data": ['http://url1', 'http://url2', 'http://url3']
                    }
                }
            }
        },
        handler    : [common.gatherIpInfo, testDLSList]
    }

];


apiProfile.forEach(function (p) {
    var method = p.method;
    var path = p.path;
    var handler = p.handler;

    var profileMW = function (req, res, next) {
        req.profile = p;
        next();
    };

    if (!Array.isArray(handler)) throw new Error('handlers middleware must be Array');

    handler.unshift(profileMW);
    var fn = router[method];

    if (fn && fn instanceof Function) {
        fn.call(router, path, handler);
    }
});

module.exports = {
    router     : router,
    profile    : apiProfile,
    tag        : 'client',
    description: 'client配置相关API'
}