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
    //var device = 'F93E1DBFE489E35AE79F42D4D7BCB7EA1B7F24C7041955D5991F1C2D7AAAAFF1BE54C9E9C6D4F84D9491047AF0A86EBE0B34790485599DDFCC078817FAA943B5014E633BBA7820A6EDC4ADA121424FEE5AD913545AADC0332FEB6BCAB3CCA0B0B34AB2D3583D83CC90EDB582446D6E0437A5EF733E5133B7067C04AFC754022BB3A6346C68D6EC1C6267AF588C17475A6C7DAE6E1F2E929F8F06B6AE22DC3881EFBC402172C4C33CA49A4B055B501BE8DCF1CC1FD377765DB5AE590481BF578532E15A4BF2CFEBA038DC5444AFB12CB04CA0FA9057ED3506576B6FCD19FDD15FFE3194EBBE1FEFC04FF999C49974020C';
    var di = "";
    console.log('to be device info decryptdata is\n',device);
    log.info('device is',device);
    try{
        di = cipherUtils.aesDecrypt(device)
    }catch(e){
        return next(new error.Cipher('cipher decrypt request error! check the request!'));
    }
    /*var di = decodeURIComponent(req.get('device'));*/
    var diArray= di.match(regexp);
    var deviceData = {};
    diArray= _.map(diArray,function(diInfo){
       return diInfo.replace(/"/g,'');
    });
    log.info('DI is :',di,' length is :',diArray.length);

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
    console.log('tobe decryptdata is\n',body);
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
