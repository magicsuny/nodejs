/**
 * Created by sunharuka on 15/6/11.
 */
var express = require('express');
var router = express.Router();
var common = require('./common');
var async = require('async');
var multer = require('multer')
var config = require('../profile/config');
var _ = require('underscore');
var error = require('../utils/error');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Wifi = require('../model/db').Wifi;
var upload = multer({dest: '/tmp/upload'});
var docUtils = require('../utils/docUtils');
var geoip = require('geoip-lite');

/**
 * 保存wifi信息逻辑
 * 判断连接状态
 * @param infos
 * @param options
 * @param cb
 * @private
 */
var _saveWifiInfos = function (infos, options, cb) {
    if(!infos){
        return cb(new Error('No infos to gather!',errorCode.paramsError));
    }
    //去重条件: 拥有bssid的前提下,同国家
    var bulk = Wifi.collection.initializeUnorderedBulkOp();
    _.each(infos, function (_wifiInfo) {
        //解析地址
        var location = options.location;
        if (_wifiInfo.ip) {
            try {
                location = geoip.lookup(_wifiInfo.ip) || location;
            } catch (e) {
                log.error(e);
            }
        } else {
            _wifiInfo.ip = options.ip;
        }
        _wifiInfo.country = location.country;
        _wifiInfo.city = location.city;
        _wifiInfo.is_hotspot = options.isHotspot;
        _wifiInfo.updatedAt = new Date();
        if (_wifiInfo.connectable) {
            _wifiInfo.connectable = true;
        } else {
            _wifiInfo.connectable = false;
        }
        //保存经纬度
        if (!_.isNaN(_wifiInfo.longitude) && !_.isNaN(_wifiInfo.latitude)) {
            _wifiInfo.location = [_wifiInfo.longitude, _wifiInfo.latitude];
        }

        //判断wifi的连接状态
        var baseCondition = {};
        if (_wifiInfo.tryTime) {
            baseCondition = {lastConnectedAt: {$lte: new Date(_wifiInfo.tryTime)}};
            _wifiInfo.lastConnectedAt = new Date(_wifiInfo.tryTime);
        }

        if (_wifiInfo._id) {//有_id为已处理数据直接更新
            var _id = _wifiInfo._id;
            delete _wifiInfo._id;
            var _idCondition = _.extend({_id: _id}, baseCondition);
            bulk.find(_idCondition).upsert().updateOne(_wifiInfo);
        } else if (_wifiInfo.bssid) {//有bssid则匹配更新
            //TODO 原始数据缺少city属性 需预处理补全
            var _bssidCondition = _.extend({bssid: _wifiInfo.bssid, country: location.country}, baseCondition);
            bulk.find(_bssidCondition).upsert().updateOne(_wifiInfo);
        } else {//其他情况插入数据
            _wifiInfo.createdAt = new Date();
            bulk.insert(_wifiInfo);
        }
    });
    bulk.execute(cb);
};
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
    if (!body) {
        var err = new Error('填报WIFI信息为空', errorCode.paramsError);
        return next(err);
    }
    _saveWifiInfos(body.infos, {location: req.location, isHotspot: false}, function (err, result) {
        if (err) {
            return next(err);
        }
        res.send({err: 0, msg: ''});
    });
};

/**
 * wifi热点上报
 * @param req
 * @param res
 * @param next
 */
var gatherWifiHotSpotInfo = function (req, res, next) {
    var body = req.body;
    //TODO 校验上传信息|头像信息处理
    if (!body) {
        var err = new Error('填报WIFI信息为空', errorCode.paramsError);
        return next(err);
    }
    _saveWifiInfos(body.infos, {location: req.location, isHotspot: true, ip: req.ip}, function (err, result) {
        if (err) {
            return next(err);
        }
        res.resData = [];
        next();
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
    var idConditions = [];
    var querys = [];
    //基本过滤条件
    var baseCondition = {connectable: true};
    _.each(infos, function (_wifiInfo) {
        //id查找
        if (_wifiInfo._id) {
            idConditions.push(_wifiInfo._id);
            return;
        }
        //bssid查找
        if (_wifiInfo.bssid) {
            var _bssidCondition = _.extend({bssid: _wifiInfo.bssid}, baseCondition);
            if (_wifiInfo.country) {
                _bssidCondition.country = _wifiInfo.country;
            }
            if (_wifiInfo.city) {
                _bssidCondition.city = _wifiInfo.city;
            }
            querys.push(function (cb) {
                Wifi.find(_bssidCondition).exec(cb);
            });
            return;
        }
        //ssid查找
        if (_wifiInfo.ssid) {
            var _ssidCondition = _.extend({ssid: _wifiInfo.ssid}, baseCondition);
            if (_wifiInfo.country) {
                _ssidCondition.country = _wifiInfo.country;
            }
            if (_wifiInfo.city) {
                _ssidCondition.city = _wifiInfo.city;
            }
            //按照地区过滤以上报点为圆心周围500米有密码wifi
            if (!_.isNull(body.latitude) && !_.isNull(body.longitude)) {
                _ssidCondition.location = {
                    $nearSphere: {
                        $geometry   : {
                            type       : "Point",
                            coordinates: [body.longitude, body.latitude]
                        },
                        $minDistance: 0,
                        $maxDistance: 500
                    }
                };
            }
            querys.push(function (cb) {
                Wifi.find(_ssidCondition).limit(5).exec(cb);
            });
            return;
        }
    });
    querys.push(function (cb) {
        if (idConditions.length == 0) {
            return cb();
        }
        var _idCondition = _.extend({_id: {$in: idConditions}}, baseCondition);
        Wifi.find(_idCondition).exec(cb);
    });
    async.parallel(querys, function (err, results) {
        if (err) return next(err);
        var data = _.flatten(results);
        data = _.each(data, function (_result) {
            var resultTpl = {
                _id         : null,
                ssid        : null,
                bssid       : null,
                level       : null,
                sec_level   : null,
                capabilities: null,
                frequency   : null,
                password    : null,
                identity    : null,
                keymgmt     : null,
                eap         : null,
                latitude    : null,
                longitude   : null,
                accuracy    : null,
                icon        : {
                    nomal: null,
                    small: null
                },
                country     : null,
                city        : null

            };
            return _.extend(resultTpl, _result);
        });
        res.send({
            err : 0,
            msg : '',
            data: {
                infos: data
            }
        });
        next();
    })
};

/**
 * 下发云设置
 * @param req
 * @param res
 * @param next
 */
var distributeClientConfig = function (req, res, next) {
    res.resData = config.wifiClientSetting;
    next();
};

var uploadHotspotPoster = function (req, res, next) {
    debugger;
};

var apiVersion = 1;

var apiProfile = [
    {
        method     : 'post',
        path       : '/wifi',
        version    : apiVersion,
        summary    : '采集wifi信息',
        description: '采集wifi信息规则:  \n' +
        '* 反查国家城市信息IP优先级 wifi连接时的IP>上报IP 如没有查到则置为空.  \n' +
        '* 目前不保存无密码可直连的wifi信息.  \n\n' +
        new docUtils.tbl('规则分类', '处理方式', '规则描述')
            .row('_id', 'upsert', 'tryTime>=系统最后记录状态时间')
            .row('bssid', 'upsert', '同一国家,城市,bssid一致.并且tryTime>=系统最后记录状态时间')
            .row('其他', 'insert', '直接更新').render(),
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
                            items: {$ref: '#/definitions/wifiInfoGather'}
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
                        "code": 0,
                        "msg" : "",
                        "data": []
                    }
                }
            }
        },
        handler    : [common.gatherIpInfo, gatherWifiInfo]
    },
    {
        method     : 'post',
        path       : '/hotspot',
        version    : apiVersion,
        summary    : '采集wifi热点信息（暂定）',
        description: '采集wifi热点信息规则（暂定）:  \n' +
        '* 反查国家城市信息IP优先级 wifi连接时的IP>上报IP 如没有查到则置为空.  \n\n' +
        new docUtils.tbl('规则分类', '处理方式', '规则描述')
            .row('_id', 'upsert', 'tryTime>=系统最后记录状态时间')
            .row('bssid', 'upsert', '同一国家,城市,bssid一致.并且tryTime>=系统最后记录状态时间')
            .row('其他', 'insert', '直接更新').render(),
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
                        "code": 0,
                        "msg" : "",
                        "data": []
                    }
                }
            }
        },
        handler    : [common.gatherIpInfo, gatherWifiHotSpotInfo]
    },
    {
        method     : 'post',
        path       : '/findwifi',
        version    : apiVersion,
        summary    : '挖掘wifi信息',
        description: '挖掘wifi信息规则:  \n' +
        '* 仅返回有密码并且状态可连接的wifi信息  \n' +
        '* 匹配规则待改进.  \n\n' +
        new docUtils.tbl('规则分类', '规则描述')
            .row('_id', '_id匹配并且connectable=true')
            .row('bssid', '同一国家,城市,bssid.并且connetable=true')
            .row('ssid', '同一国家,城市,ssid. connectable=true,并且以请求经纬度为中心半径500米距离查找').render(),
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
                                    items: {$ref: '#/definitions/wifiInfoResponse'}
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
                                    _id         : "", //数据库id
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
                                    accuracy    : "",
                                    icon        : {
                                        nomal: "http://标准图Url",
                                        small: "http://缩略图Url"
                                    },
                                    country     : 'CN',
                                    city        : 'beijing'

                                }

                            ]
                        }
                    }
                }
            }
        },
        handler    : [findWifiInfo, common.gatherDeviceInfo]
    },
    {
        method     : 'get',
        path       : '/config',
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
