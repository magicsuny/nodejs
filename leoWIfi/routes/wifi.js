/**
 * Created by sunharuka on 15/6/11.
 */
var express = require('express');
var router = express.Router();
var common = require('./common');
//var odm      = require('../model/odm');
//var User     = require('./user');
var async = require('async');
var listUtil = require('../utils/listUtils');
var config = require('../profile/config');
var _ = require('underscore');
var error = require('../utils/error');
var Promise = require('bluebird');
var docUtils = require('../utils/docUtils');


/**
 * wifi信息采集
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var gatherWifiInfo = function (req, res, next) {
    res.send({err: 0, msg: '', data: []});
};

/**
 * wifi挖掘
 * @param req
 * @param res
 * @param next
 */
var matchWifiInfo = function (req, res, next) {

};

/**
 * wifi热点上报
 * @param req
 * @param res
 * @param next
 */
var gatherWifiHotSpotInfo = function (req, res, next) {
    res.send({err: 0, msg: '', data: []});
};


var apiVersion = 1;

var apiProfile = [
    {
        method     : 'post',
        path       : '/wifi',
        version    : apiVersion,
        description: '采集wifi信息',
        params     : [
            {
                name  : 'body',
                in    : 'body',
                schema: {
                    type      : 'object',
                    required  : ['device_id', 'infos'],
                    properties: {
                        device_id: {
                            type       : 'string',
                            description: '客户端设备ID'
                        },
                        infos    : {
                            type : 'array',
                            items: {$ref: '#/definitions/wifiInfo'}
                        }
                    }
                }
            }
        ],
        responses  : {
            200: {
                description: '采集wifi信息',
                schema     : {
                    type: 'object', properties: {
                        code: {
                            type       : 'number',
                            description: 'error code',
                            default    : 0
                        },
                        msg : {type: 'string', description: 'error message'},
                        data: {
                            type: 'object', properties: {
                                id: {type: 'string', description: ''}
                            }
                        }
                    }
                },
                examples   : {
                    "application/json": {
                        "err" : 0,
                        "msg" : "",
                        "data": []
                    }
                }
            }
        },
        handler    : [gatherWifiInfo]
    },
    {
        method     : 'post',
        path       : '/matchwifi',
        version    : apiVersion,
        description: '挖掘wifi信息',
        params     : [
            {
                name  : 'body',
                in    : 'body',
                schema: {
                    type      : 'object',
                    required  : ['device_id', 'infos'],
                    properties: {
                        device_id: {
                            type       : 'string',
                            description: '客户端设备ID'
                        },
                        latitude : {
                            type       : 'string',
                            description: '纬度'
                        },
                        longitude: {
                            type       : 'string',
                            description: '经度'
                        },
                        infos    : {
                            type : 'array',
                            items: {$ref: '#/definitions/simpleWifiInfo'}
                        }
                    }
                }
            }
        ],
        responses  : {
            200: {
                description: '挖掘wifi信息',
                schema     : {
                    type: 'object', properties: {
                        code: {
                            type       : 'number',
                            description: 'error code',
                            default    : 0
                        },
                        msg : {type: 'string', description: 'error message'},
                        data: {
                            properties: {
                                infos: {
                                    type : 'array',
                                    items: {$ref: '#/definitions/wifiInfo'}
                                }
                            }
                        }
                    }
                },
                examples   : {
                    "application/json": {
                        "err" : 0,
                        "msg" : "",
                        "data": {
                            "infos": [
                                {
                                    infos: [
                                        {
                                            id          : "", //数据库id
                                            ssid        : "",
                                            bssid       : "",
                                            level       : 1,
                                            sec_level   : 1,
                                            capabilities: "",
                                            frequency   : 2447,
                                            password    : "",
                                            identity    : "",
                                            keymgmt     : "",
                                            eap         : "",
                                            latitude    : "",
                                            longitude   : "",
                                            "accuracy"  : ""
                                        }
                                    ]
                                }

                            ]
                        }
                    }
                }
            }
        },
        handler    : [matchWifiInfo]
    },
    {
        method     : 'post',
        path       : '/wifihotspot',
        version    : apiVersion,
        description: '采集wifi信息',
        params     : [
            {
                name  : 'body',
                in    : 'body',
                schema: {
                    type      : 'object',
                    required  : ['device_id', 'infos'],
                    properties: {
                        device_id: {
                            type       : 'string',
                            description: '客户端设备ID'
                        },
                        infos    : {
                            type : 'array',
                            items: {$ref: '#/definitions/wifiInfo'}
                        }
                    }
                }
            }
        ],
        responses  : {
            200: {
                description: '采集wifi信息',
                schema     : {
                    type: 'object', properties: {
                        code: {
                            type       : 'number',
                            description: 'error code',
                            default    : 0
                        },
                        msg : {type: 'string', description: 'error message'},
                        data: {
                            type: 'object', properties: {
                                id: {type: 'string', description: ''}
                            }
                        }
                    }
                },
                examples   : {
                    "application/json": {
                        "err" : 0,
                        "msg" : "",
                        "data": []
                    }
                }
            }
        },
        handler    : [gatherWifiHotSpotInfo]
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
    tag        : 'wifi',
    description: 'wifi相关API'
};
