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
var docUtils = require('../utils/docUtils');
var geoip = require('geoip-lite');
var gm = require('gm');
var fs = require('fs');
var path = require('path');
var ipaddr = require('ipaddr.js');
var awsS3 = require('../utils/AwsS3Deploy');

/**
 * 保存wifi信息逻辑
 * 判断连接状态
 * @param infos
 * @param options
 * @param cb
 * @private
 */
var _saveWifiInfos = function (infos, options, cb) {
    if (!infos) {
        return cb(new error.Arg('WIFI信息为空'));
    }
    //去重条件: 拥有bssid的前提下,同国家
    var bulk = Wifi.collection.initializeUnorderedBulkOp();
    var bssidAry = [];
    var bssidContents = {};
    _.each(infos, function (_wifiInfo) {
        //过滤无用内容
        _wifiInfo = _.pick(_wifiInfo,
            "_id",
            "ssid",
            "bssid",
            "level",
            "sec_level",
            "capabilities",
            "frequency",
            "password",
            "identity",
            "keyMgmt",
            "eap",
            "ip",
            "latitude",
            "longitude",
            "connectable",
            "tryTime",
            "accuracy",
            "sharedable",
            "is_root",
            "other_settings");
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
        var _id = _wifiInfo._id;
        delete _wifiInfo._id;
        _wifiInfo.country = location.country;
        _wifiInfo.city = location.city;
        _wifiInfo.is_hotspot = false;
        _wifiInfo.updatedAt = new Date();
        //_wifiInfo.connectable = true;
        if (_.isNull(_wifiInfo.connectable) || _.isUndefined(_wifiInfo.connectable)) {
            _wifiInfo.connectable = true;
        }
        //保存经纬度
        if (!_.isNaN(_wifiInfo.longitude) && !_.isNaN(_wifiInfo.latitude)) {
            _wifiInfo.location = [_wifiInfo.longitude, _wifiInfo.latitude];
        }

        //判断wifi的连接状态
        var baseCondition = {};
        if (_wifiInfo.tryTime > 0) {
            baseCondition = {lastConnectedAt: {$lte: new Date(_wifiInfo.tryTime)}};
            _wifiInfo.lastConnectedAt = new Date(_wifiInfo.tryTime);
        } else {
            _wifiInfo.lastConnectedAt = new Date();
        }

        if (_id) {//有_id为已处理数据直接更新
            try {
                _id = mongoose.mongo.ObjectId(_wifiInfo._id);
            } catch (e) {
                return;
            }
            var _idCondition = _.extend({_id: _id,is_hotspot:false}, baseCondition);
            bulk.find(_idCondition).updateOne({$set:_wifiInfo,$inc: {gatherTimes: 1}});
            return;
        }
        if (_wifiInfo.bssid) {//有bssid则匹配更新
            _wifiInfo.bssid = _wifiInfo.bssid.toUpperCase();

            //TODO 原始数据缺少city属性 需预处理补全
            var _bssidCondition = _.extend({bssid: _wifiInfo.bssid, country: location.country,is_hotspot:false}, baseCondition);
            bssidAry.push(_wifiInfo.bssid);
            bssidContents[_wifiInfo.bssid] = {condition:_bssidCondition,data:_wifiInfo};
            //bulk.find(_bssidCondition).updateOne(_wifiInfo);
            return;
        }
        //其他情况插入数据
        _wifiInfo.createdAt = new Date();
        _wifiInfo.gatherTimes = 0;
        bulk.insert(_wifiInfo);
    });//准备更新数据结构
    Wifi.find({bssid:{$in:bssidAry}},{bssid:true},function(err,bssidsInDb){
        if(err) return cb(err);

        _.each(bssidsInDb,function(bssidInDb){//更新bssid
            var updateContent = bssidContents[bssidInDb.bssid];
            if(!updateContent){
                return;
            }
            bulk.find(updateContent.condition).update({ $set: updateContent.data,$inc: {gatherTimes: 1}});
            delete bssidContents[bssidInDb.bssid];//删除更新的内容
        });
        for(var insertBssid in bssidContents){//插入bssid
           var instertContent =  bssidContents[insertBssid];
            if(!instertContent){
                return;
            }
            instertContent.data.createdAt = new Date();
            instertContent.data.gatherTimes = 0;
            bulk.insert(instertContent.data);
        }
        bulk.execute(cb);
    });
};
/**
 * wifi信息采集
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var gatherWifiInfo = function (req, res, next) {
    //console.log('gather wifi header:', req.get('content-type'));
    //console.log('gatherwifi :', req.body);
    var body = req.body;
    //TODO 校验上传信息
    if (!body) {
        var err = new error.Arg('填报WIFI信息为空');
        return next(err);
    }
    _saveWifiInfos(body.infos, {location: req.location, isHotspot: false}, function (err, result) {
        if (err) {
            return next(err);
        }
        res.body = {infos:[]};
        next();
    });
};

/**
 * wifi热点上报
 * @param req
 * @param res
 * @param next
 */
var gatherWifiHotSpotInfo = function (req, res, next) {
    var _wifiInfo = req.body;
    var matchCondition = {};
    //TODO 校验上传信息|头像信息处理
    if (!_wifiInfo) {
        var err = new error.Arg('Parameters Error!');
        return next(err);
    }
    //过滤无用信息
    _wifiInfo = _.pick(_wifiInfo,
        "_id",
        "device_id",
        "ssid",
        "bssid",
        "sec_level",
        "frequency",
        "password",
        "identity",
        "keyMgmt",
        "latitude",
        "longitude",
        "accuracy",
        "is_root"
    );

    //解析地址
    var location = req.location;
    if (_wifiInfo.ip) {
        try {
            location = geoip.lookup(_wifiInfo.ip) || location;
        } catch (e) {
            log.error(e);
        }
    } else {
        _wifiInfo.ip = req.ip;
    }
    _wifiInfo.country = location.country;
    _wifiInfo.city = location.city;
    _wifiInfo.is_hotspot = true;
    _wifiInfo.connectable = true;
    _wifiInfo.sharedable = true;
    _wifiInfo.hotspotInfo = {
        deviceId: _wifiInfo.device_id
    };
    delete _wifiInfo.device_id;

    //保存经纬度
    if (_.isNumber(_wifiInfo.longitude) && _.isNumber(_wifiInfo.latitude)) {
        _wifiInfo.location = [_wifiInfo.longitude, _wifiInfo.latitude];
    }
    //var _id = _wifiInfo._id;
    delete _wifiInfo._id;

    if (_wifiInfo.bssid) {
        _wifiInfo.bssid = _wifiInfo.bssid.toUpperCase();
    }
    matchCondition.bssid = _wifiInfo.bssid;
    //if (!_id) {//有_id为已处理数据直接更新
    //    //_id = new mongoose.mongo.ObjectId();
    //    matchCondition.bssid = _wifiInfo.bssid;
    //} else {
    //    _id = mongoose.mongo.ObjectId(_id);
    //    matchCondition._id = _id;
    //}
    Wifi.findAndModify(matchCondition, [], {
        $set        : _wifiInfo,
        $inc        : {gatherTimes: 1},
        $currentDate: {updatedAt: true, lastConnectedAt: true},
        $setOnInsert: {createdAt: new Date}
    }, {new: true, upsert: true}, function (err, data) {
        if (err) return next(new error.Server('save hotspot error!'));
        var id = data.value._id.toString();
        res.body = {
            id: id
        };
        next();
    });
};

var findWifiBasePolicy = function () {
    //匹配非开放性并且可怜接的wifi
    var baseCondition = {connectable: true};
    //分享隐私策略匹配
    if (!config.wifiServerSetting.matchPrivateWifi) {
        baseCondition.sharedable = true;
    }
    //匹配个人热点
    baseCondition = _.extend(baseCondition, {$or: [{is_hotspot: true}, {sec_level: {'$ne': 1}}]});
    return baseCondition;
}

/**
 * wifi挖掘
 * @param req
 * @param res
 * @param next
 */
var findWifiInfo = function (req, res, next) {
    //console.log('find wifi header:',req.get('content-type'));
    //console.log('find wifi :',req.body);

    var body = req.body;
    var infos = body.infos;
    var idConditions = [];
    var bssidQuerys = [];
    var ssidQuerys = [];
    var baseCondition = findWifiBasePolicy();
    _.each(infos, function (_wifiInfo) {
        //id查找
        if (_wifiInfo._id) {
            try {
                idConditions.push(mongoose.mongo.ObjectId(_wifiInfo._id));
            } catch (e) {
                log.error('convert objectId error:', _wifiInfo._id);
            }
            return;
        }
        //bssid查找
        if (_wifiInfo.bssid) {
            var _bssidCondition = _.extend({bssid: _wifiInfo.bssid.toUpperCase()}, baseCondition);
            if (_wifiInfo.country) {
                _bssidCondition.country = _wifiInfo.country;
            }
            if (_wifiInfo.city) {
                _bssidCondition.city = _wifiInfo.city;
            }
            bssidQuerys.push(_bssidCondition);
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
            if (_.isNumber(body.latitude) && _.isNumber(body.longitude)) {
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
            ssidQuerys.push(_ssidCondition);
        }
    });
    async.parallel([
        function (cb) {
            if (idConditions.length == 0) {
                return cb();
            }
            var _idCondition = _.extend({_id: {$in: idConditions}}, baseCondition);
            Wifi.find(_idCondition).exec(cb);
        },
        function (cb) {
            async.map(ssidQuerys, function (ssidQuery, eachCB) {
                Wifi.find(ssidQuery).limit(20).exec(eachCB);
            }, cb);
        },
        function (cb) {
            async.map(bssidQuerys, function (bssidQuery, eachCB) {
                Wifi.find(bssidQuery).exec(eachCB);
            }, cb);
        }
    ], function (err, results) {
        if (err) return next(err);
        var data = _.flatten(results);
        var resultData = [];
        var hasData = {};
        for (var i = 0; i < data.length; i++) {
            var _result = data[i];
            if (!_result) {
                continue;
            }
            if (_result.bssid && hasData[_result.bssid]) {
                continue;
            }
            if (_result.bssid) {
                hasData[_result.bssid] = true;
            }

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
                keyMgmt     : null,
                eap         : null,
                latitude    : null,
                longitude   : null,
                accuracy    : null,
                poster      : {
                    normal: null,
                    thumb : null
                },
                country     : null,
                city        : null,
                is_hotspot  : null
            };
            _result = _result.toObject();
            if (!_result.poster) {
                _result.poster = {
                    normal: null,
                    thumb : null
                };
            } else {
                if (_result.poster.normal) {
                    _result.poster.normal = config.posterBaseUrl + path.join(config.AvatarS3BuketName, _result.poster.normal);
                }
                if (_result.poster.thumb) {
                    _result.poster.thumb = config.posterBaseUrl + path.join(config.AvatarS3BuketName, _result.poster.thumb);
                }
            }
            var _resultData = {};
            for (var key in resultTpl) {
                _resultData[key] = !_.isUndefined(_result[key]) ? _result[key] : resultTpl[key];

            }
            resultData.push(_resultData);
            //resultData.push(_.extendOwn(resultTpl, _result._doc));
        }
        res.body = {
            infos: resultData
        };
        next();
    });
};

/**
 * multer 存储配置
 */
var avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.exists(config.uploadAvatarFileDir, function (exists) {
            if (exists) {
                cb(null, config.uploadAvatarFileDir)
            } else {
                log.info('upload path not exists . ');
                fs.mkdir(config.uploadAvatarFileDir, function (err) {
                    if (err) log.error(err);
                    log.info('upload path craeted!');
                    cb(null, config.uploadAvatarFileDir)
                });
            }
        })
    },
    filename   : function (req, file, cb) {
        if (!req.deviceInfo) {
            return cb(new error.Header('no deviceInfo gathered'));
        }
        var deviceId = req.deviceInfo.guid;
        cb(null, deviceId + '_' + Date.now())
    }
});

/**
 * 上传热点头像 暂定,目前以deviceId作为索引保存头像.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var uploadHotspotPoster = function (req, res, next) {
    var bssid = req.body.bssid;
    var file = req.file;
    if (!file) {
        return next(new error.Upload('no avatar upload'));
    }
    if (!bssid) {//没有bssid返回错误
        return next(new error.Arg('bssId is missing'));
    }
    //if (!id) {//没有id则生成
    //    id = new mongoose.mongo.ObjectId();
    //} else {
    //    try {
    //        id = mongoose.mongo.ObjectId(id);
    //    } catch (e) {
    //        return next(new error.Arg('Id is Not objectId'));
    //    }
    //}
    async.parallel([
        function (cb) {
            Wifi.findAndModify({bssid: bssid}, [], {
                $set        : {
                    "poster.normal": file.filename,
                    "poster.thumb" : file.filename + '-thumb'
                },
                $currentDate: {updatedAt: true},
                $setOnInsert: {createdAt: new Date}
            }, {new: true, upsert: true}, cb);
        },
        function (cb) {
            gm(file.path).resize(100, 100).write(file.path + '-thumb', cb);
        },
    ], function (err, results) {
        if (err) return next(new error.Upload('upload hotspot error!'));
        async.parallel([
            function (cb) {
                awsS3.uploadFile(file.filename, file.path, file.mimetype, cb);
            },
            function (cb) {
                awsS3.uploadFile(file.filename + '-thumb', file.path + '-thumb', file.mimetype, cb);
            }
        ], function (err, s3results) {
            if (err) return log.error(err);
            fs.unlink(file.path);
            fs.unlink(file.path + '-thumb');
            log.info('avatar:' + file.path + ' deleted!');
        });
        var id = results[0].value._id.toString();
        res.body = {
            id: id
        };
        next();

    });
};

/**
 * 获取wifi热点海报
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var hotspotPoster = function (req, res, next) {
    //console.log('find wifi header:',req.get('content-type'));
    //console.log('find wifi :',req.body);

    var body = req.body;
    var infos = body.infos;
    var idConditions = [];
    var bssidConditions = [];
    _.each(infos, function (_wifiInfo) {
        //id查找
        if (_wifiInfo._id) {
            try {
                idConditions.push(mongoose.mongo.ObjectId(_wifiInfo._id));
            } catch (e) {
                log.error('convert objectId error:', _wifiInfo._id);
            }
            return;
        }
        //bssid查找
        if (_wifiInfo.bssid) {
            bssidConditions.push(_wifiInfo.bssid.toUpperCase());
            return;
        }
    });
    var orCondition = [];
    if (idConditions.length > 0) {
        orCondition.push({_id: {$in: idConditions}});
    }
    if (bssidConditions.length > 0) {
        orCondition.push({bssid: {$in: bssidConditions}});
    }

    if (orCondition.length == 0) {
        res.body = [];
        next();
    } else {
        Wifi.find({$or: orCondition}, {_id: true, bssid: true, poster: true}, function (err, results) {
            var data = [];
            for (var i = 0; i < results.length; i++) {
                var _result = results[i];
                if (!_result) {
                    continue;
                }
                if (_result.poster && _result.poster.normal && _result.poster.thumb) {
                    _result.poster.normal = config.posterBaseUrl + path.join(config.AvatarS3BuketName, _result.poster.normal);
                    _result.poster.thumb = config.posterBaseUrl + path.join(config.AvatarS3BuketName, _result.poster.thumb);
                    data.push(_result);
                }
            }
            res.body = {infos: data};
            next();
        });
    }

}


/**
 * 临时 清除数据库
 * @param req
 * @param res
 * @param next
 */
var clearData = function (req, res, next) {
    log.warn('clear wifis collections'); //test
    Wifi.remove({}, function (err, data) {
        console.log('wifis removed!');
        res.send('ok');
    })
}


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
                            description: 'error code',
                            type       : 'number',
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
                        "data": {
                            infos:[]
                        }
                    }
                }
            }
        },
        handler    : [common.gatherIpInfo, common.decryptData, gatherWifiInfo]
    },
    {
        method     : 'post',
        path       : '/hotspot',
        version    : apiVersion,
        summary    : '采集wifi热点信息',
        description: '采集wifi热点信息规则:  \n' +
        '* 反查国家城市信息IP优先级 wifi连接时的IP>上报IP 如没有查到则置为空.  \n' +
        '* 目前只考虑每台设备对应单热点情况.  \n',
        params     : [
            {
                name  : 'body',
                in    : 'body',
                schema: {$ref: '#/definitions/hotspotGather'}
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
                                _id: {type: 'string', description: '数据库Id'}
                            }
                        }
                    }
                },
                examples   : {
                    "application/json": {
                        "code": 0,
                        "msg" : "",
                        "data": {
                            id: '562dc94bd523477eaa433206'
                        }
                    }
                }
            }
        },
        handler    : [common.gatherIpInfo, common.decryptData, gatherWifiHotSpotInfo]
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
                            type       : 'number',
                            description: '纬度'
                        },
                        longitude: {
                            type       : 'number',
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
                        "code" : 0,
                        "msg" : "",
                        "data": {
                            "_id": ""
                        }
                    }
                }
            }
        },
        handler    : [common.gatherIpInfo, common.decryptData, findWifiInfo,common.encryptData]
    },
    {
        method     : 'post',
        path       : '/findposter',
        version    : apiVersion,
        summary    : '获取海报/头像地址',
        description: '获取海报/头像地址:  \n' +
        '* 匹配规则为 _id>bssid  \n',
        params     : [
            {
                name  : 'body',
                in    : 'body',
                schema: {
                    type      : 'object',
                    required  : ['device_id', 'infos'],
                    properties: {
                        infos: {
                            type : 'array',
                            items: {$ref: '#/definitions/getPosterRequest'}
                        }
                    }
                }
            }
        ],
        responses  : {
            200: {
                description: '获取头像',
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
                                    items: {$ref: '#/definitions/getposterResponse'}
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
                            infos: [
                                {
                                    _id   : 'XXX',
                                    bssid : 'XXX',
                                    poster: {
                                        normal: 'http://XXX',
                                        thumb : 'http://xXX'
                                    }
                                }, {
                                    _id   : 'XXX',
                                    bssid : 'XXX',
                                    poster: {
                                        normal: 'http://XXX',
                                        thumb : 'http://xXX'
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        handler    : [common.gatherIpInfo, hotspotPoster]
    },
    {
        method     : 'post',
        path       : '/hotspot/poster',
        version    : apiVersion,
        summary    : '上传热点头像',
        description: '上传热点头像规则说明:  \n' +
        '* 参数中热点的ID作为标识  \n' +
        '* 文件命名规则:deviceId+时间戳, 缩略图: deviceId+时间戳+“-thumb“ \n\n',
        params     : [
            {
                name       : 'poster',
                type       : 'file',
                in         : 'formData',
                required   : true,
                description: '头像文件'
            },
            {
                name       : 'bssid',
                type       : 'string',
                in         : 'formData',
                description: '热点bssid'
            }

        ],
        responses  : {
            200: {
                description: '上传热点头像',
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
                        "data": {
                            id: '562dc94bd523477eaa433206'
                        }
                    }
                }
            }
        },
        handler    : [common.gatherDeviceInfo,multer({storage: avatarStorage}).single('poster'), common.gatherIpInfo, uploadHotspotPoster]
    },
    {
        method     : 'get',
        path       : '/cleardata',
        version    : apiVersion,
        summary    : '清楚数据',
        description: '清楚数据（上线后删除)）',
        params     : [],
        responses  : {
            200: {
                description: 'ok'
            }
        },
        handler    : [clearData]
    }

    //,
    //{
    //    method     : 'get',
    //    path       : '/hotspot/poster/:name',
    //    version    : apiVersion,
    //    summary    : '获取海报',
    //    description: '根据名称获取热点海报',
    //    params     : [
    //        {
    //            name       : 'name',
    //            type       : String,
    //            in         : 'path',
    //            required   : true,
    //            description: '海报名称'
    //        }
    //    ],
    //    responses  : {
    //        200: {
    //            description: '根据名称获取热点海报'
    //        }
    //    },
    //    handler    : [hotspotPoster]
    //}
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
}