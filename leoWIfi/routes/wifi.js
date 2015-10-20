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
var Wifi = require('../model/db').Wifi;

/**
 * wifi信息采集
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var gatherWifiInfo = function (req, res, next) {
    var body = req.body;
    //TODO 校验上传信息
    if(!body){
        var err = new Error('填报WIFI信息为空',errorCode.paramsError);
        return next(err);
    }
    //去重条件: 拥有bssid的前提下,同国家
    var bulk = Wifi.collection.initializeOrderedBulkOp();
    _.each(body.infos,function(_wifiInfo){
        if(_wifiInfo.bssid){
            //保存城市信息
            if(req.location.city){
                _wifiInfo.city=req.location.city;
            }
            ////保存经纬度
            //if(!_.isNaN(_wifiInfo.longitude)&&! _.isNaN(_wifiInfo.latitude)){
            //    _wifiInfo.location = [_wifiInfo.longitude,_wifiInfo.latitude];
            //}
            //保存IP
            _wifiInfo.ip = req.ip;
            bulk.find({bssid:_wifiInfo,country:req.location.country}).upsert().updateOne(_wifiInfo);
        }else{
            bulk.insert(_wifiInfo);
        }
    });
    bulk.execute(function(err,result){
        if(err) return next(err);
        res.send({err: 0, msg: ''});
    });

};

/**
 * wifi挖掘
 * @param req
 * @param res
 * @param next
 */
var findWifiInfo = function (req, res, next) {
    var body = req.body;
    var infos = body.infos;
    var ssid = infos[0].ssid;
    Wifi.find({ssid:ssid}).exec(function(err,data){
        if(err) return next(err);
        res.send({
            err: 0,
            msg: '',
            data: {
                infos:data
            }
        });
    });
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
                        "code" : 0,
                        "msg" : "",
                        "data": []
                    }
                }
            }
        },
        handler    : [common.gatherIpInfo,gatherWifiInfo]
    },
    {
        method     : 'post',
        path       : '/findwifi',
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
                            type      : 'object',
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
                    }
                }
            }
        },
        handler    : [findWifiInfo]
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
                        "code" : 0,
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
