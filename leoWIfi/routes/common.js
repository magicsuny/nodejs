var config   = require('../profile/config.js');
var _        = require('underscore');
var validate = require('../utils/validate');
var cipherUtils = require('../utils/cipherUtils');
var util     = require('util');
var error    = require('../utils/error');
var geoip = require('geoip-lite');
var ipaddr = require('ipaddr.js');
var Device = require('../model/db').Device;
/**
 * 获取deviceInfo
 * @param req
 * @param res
 * @param next
 */
var deviceCols = ["market_id","guid","app_id","app_ver","os_name","android_ver","vendor","model","screen_des","screen_dpi","language","timezone","imei","imsi","mac","android_id"];

exports.gatherDeviceInfo = function(req,res,next){
    var regexp = new RegExp('"([^"]+)"',"g");
    var device = req.get('device');
    var di = "";
    log.debug('encrypted deviceInfo is',device);
    try{
        di = cipherUtils.aesDecrypt(device)
    }catch(e){
        return next(new error.Cipher('cipher decrypt request error! check the request!'));
    }
    var diArray= di.match(regexp);
    var deviceData = {};
    diArray= _.map(diArray,function(diInfo){
       return diInfo.replace(/"/g,'');
    });
    log.debug('DI is :',di,' length is :',diArray.length);

    if(diArray.length < deviceCols.length){
        return next();
    }

    for(var i=0;i<deviceCols.length;i++){
        if(diArray[i]){
            deviceData[deviceCols[i]] = diArray[i];
        }else{
            deviceData[deviceCols[i]] = "";
        }
    }

    req.deviceInfo = deviceData;
    next();
};

/**
 * 保存deviceInfo
 * @param req
 * @param res
 * @param next
 */
exports.saveDeviceInfo = function(req,res,next){
    var deviceInfo = req.deviceInfo;
    if(deviceInfo){
        Device.findAndModify({guid:deviceInfo.guid},[],                                                //mongoose update方法好像不支持 $currentDate 和 $setOnInsert
            {$set: deviceInfo,$currentDate: {updatedAt: true},$setOnInsert: {createdAt: new Date}},
            {upsert: true}, function (err, data) {
            if (err){
                log.error('save device info error');
            }
            delete req.deviceInfo;
        });
    }
    next();
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.gatherIpInfo = function(req,res,next){
    var clientIp = req.ip;//ipaddr.process(req.ip).octets.join('.');
    try {
        var location = geoip.lookup(clientIp);
        if (location && location.country) {
            req.location = location;
            log.info('remote ip', clientIp, 'found country', location.country);
        } else {
            req.location = {
                country:'unknown',
                city:'unknown'
            };
            log.info('remote ip', clientIp, 'not found, use unknown country', req.location.country);
        }
    } catch (error) {
        req.location = {
            country:'unknown',
            city:'unknown'
        };
        log.info('lookup ip', clientIp, 'exception, use unknown country', req.location.country);
    }
    next();
}


exports.authCons = function(req, res, next){

    var retByPath = function(redirect, req, res){
        var adminRet = {err: config.errorCode.loginError || 1, msg: 'You need to login'};
        if(req.originalUrl.indexOf('/a') > 0) return res.send(adminRet);
        return res.redirect(redirect);
    };

    var cookie = req.cookies[config.managerCookieName];
    if(!cookie) return retByPath('/login', req, res);
    var arr = cookie.split(':');
    if(md5(arr[1]+config.cookiePrivateKey) != arr[arr.length - 1]) return retByPath('/logout', req, res);

    next();
};

exports.err = function (err, req, res, next) {
    var errObj;
    if (typeof(err) == 'object') {
        errObj = {
            err: err.code || config.errorCode.unknownError,
            msg: err.message || 'unknown error'
        };
    } else{
        errObj = {err: config.errorCode.unknownError, msg: err};
    }
    return res.send(errObj);
};


exports.pre = function(req, res, next){
    res.setHeader("x-powered-by", "Leomaster");
    var start = Date.now();
    var _send = res.send;
    res.send = function(){
        return _send.apply(res, arguments);
    };
    return next();
};


exports.validate = function (req, res, next) {
    var profile = req['profile'];
    if (profile) {
        var query   = profile['params'],
            uri     = profile['uri'],
            body    = profile['body'],
            headers = profile['headers'],
            rtn     = '';
        if (query) {
            rtn = validate(req.query, query);
            if (rtn !== '') {
                return next(new error.Arg('query:' + rtn));
            }
        }

        if (uri) {
            rtn = validate(req.params, uri);
            if (rtn !== '') {
                return next(new error.Arg('uri:' + rtn));
            }
        }

        if (body) {
            rtn = validate(req.body, body);
            if (rtn !== '') {
                return next(new error.Arg('body:' + rtn));
            }
        }

        if (headers) {
            rtn = validate(req.headers, headers);
            if (rtn !== '') {
                return next(new error.Arg('headers:' + rtn));
            }
        }

    }
    next();
};


exports.decryptData = function(req,res,next){
    var body = req.body;
    try{
        var jsonStr = cipherUtils.aesDecrypt(body)
        body = JSON.parse(jsonStr.trim());
    }catch(e){
        return next(new error.Cipher('cipher decrypt request error! check the request!'));
    }
    req.body = body;
    next();
};


exports.encryptData = function(req,res,next){
    var data = res.body;
    try{
        data = JSON.stringify(data);
        res.body = cipherUtils.aesEncrypt(data);
    }catch(e){
        return next(new error.Cipher('cipher encrypt resopnse error! check the response!'));
    }
    next();
}
//end
