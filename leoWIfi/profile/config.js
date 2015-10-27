var winston = require('winston');
var logFile = {
    info : '/var/log/leowifi/info.log',
    error: '/var/log/leowifi/error.log'
};
var _ = require('underscore');

var timestamp = function () {
    return new Date()
};

var define = function (name, level, fullPath) {
    var defaults = {
        silent   : false, timestamp: timestamp, filename: logFile.error,
        showLevel: true, json: false, maxsize: 1024 * 1024 * 20
    };
    return _.extend(defaults, {name: name, level: level, filename: fullPath});
};

var transports = [
    new winston.transports.Console({
        colorize   : true,
        timestamp  : timestamp,
        prettyPrint: true,
        debugStdout: true,
        handleExceptions: true
    }),
    new winston.transports.File(define('info-file', 'info', logFile.info)),
    new winston.transports.File(define('error-file', 'error', logFile.error))
];

global.log = global.logger = new (winston.Logger)({transports: transports});

//API version
exports.apiVersion = 1;
//manager cookie name
exports.managerCookieName = 'leowifi';
exports.cookieMaxAge = 7 * 24 * 60 * 60 * 1000;
exports.cookiePath = '/';
exports.cookiePrivateKey = 'leowifi!@#$#@';
//manager proxy
exports.trustProxy = true;
//cipher key
exports.cipherKey = 'leomasterwifi!@';

/*
 * max upload file size
 * */
exports.uploadFileSize = 5 * 1024 * 1024; //5MB
/*uploading file temp dir*/
exports.uploadAvatarFileDir = '/tmp/upload/avatar/';


exports.mongoDebugMode = true;
exports.posterBaseUrl = 'http:\/\/106.187.49.16:3000/wifi/v1/hotspot/poster/';
exports.mongoDbConfig = {
    url    : 'mongodb://localhost:27017/leowifi',
    options: {
        db    : {native_parser: true},
        server: {
            poolSize      : 5,
            auto_reconnect: true,
            socketOptions : {
                keepAlive: 1
            }
        },
        //replset: { rs_name: 'myReplicaSetName' },
        user  : 'root',
        pass  : ''
    }
};

exports.errorCode = global.errorCode = {
    //@TODO, refine error code logic
    unknownError          : 101,
    paramsError           : 102,
    uploadedError         : 103,
    headerError           : 104,
    activityOperationError: 107,
    authError             : 108,
    dbError               : 109,
    cacheError            : 110,
    deleteError           : 111,
    statusError           : 112,
    updateError           : 113,
    getContentError       : 114,
    loginError            : 115,
    userInfoMissed        : 200,
    notfoudError          : 404
};

//默认的返回行数
exports.DefaultRows = 10;

exports.statd = {
    host     : '192.168.20.240',
    port     : 8125,
    prefix   : 'yuan.',
    globalize: true
};


//wifi全局设置
exports.wifiClientSetting = {
    enableWifiCollect  : true,//是否允许采集
    showFreeWifiCount  : 5,//免费wifi显示条目
    gatherWifiCountOnce: 10,//一次采集wifi信息上传数
    gatherNSWifi       : true//采集不允许分享的wifi密码
};

exports.wifiServerSetting = {
    matchPrivateWifi: false//返回隐私wifi控制
};

/**
 * 对象属性覆盖,用src中的属性覆盖dest.　只覆盖dest中定义的属性，支持任意层次的对象属性覆盖
 * 暴露只是为了方便测试
 * @param dest
 * @param src
 * @param name　内部使用,为了显示覆盖的属性
 */
exports.mergeConfig = mergeConfig;
function mergeConfig(dest, src, name) {
    name = name || '';

    for (var p in dest) {
        if (typeof dest[p] === 'object' && typeof src[p] === 'object') {
            //var nested = name === '' ? '' : name + '.' + p;
            mergeConfig(dest[p], src[p], p);
        } else if (src.hasOwnProperty(p)) {
            dest[p] = src[p];
            console.log('override %s.%s from "%s" to "%s"', name, p, dest[p], src[p]);
        }
    }
}

var defaultFile = './override';
var override;
try {
    var env = process.env.NODE_ENV;
    if (env) {
        override = require('./' + env);
    } else {
        override = require(defaultFile);
    }
} catch (err) {
    log.error('can not load property file ', './' + env + '.js using ', defaultFile, '.js');
    //override = require(defaultFile);
}


//console.log(override);
//mergeConfig(module.exports, require('./override'));
if (override) mergeConfig(module.exports, override);
