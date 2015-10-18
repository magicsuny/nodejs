var winston = require('winston');
var logFile = {
    info : '/var/log/leowifi/info.log',
    error: '/var/log/leowifi/error.log'
};
var _       = require('underscore');

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
        debugStdout: true
    }),
    new winston.transports.File(define('info-file', 'info', logFile.info)),
    new winston.transports.File(define('error-file', 'error', logFile.error))
];

global.log = global.logger = new (winston.Logger)({transports: transports});

//API version
exports.apiVersion = 1;
exports.app_id = 'wifi';
//manager cookie name
exports.managerCookieName = 'YCNP';
exports.cookieMaxAge = 7 * 24 * 60 * 60 * 1000;
exports.cookiePath = '/';
exports.cookiePrivateKey = 'yingYuansiyouCookie123!@#,]-=dwa.,|[sd';

/*
 * max upload file size
 * */
exports.uploadFileSize = 5 * 1024 * 1024; //5MB
/*uploading file temp dir*/
exports.uploadFileTmpDir = '/tmp';


exports.mongoDebugMode = true;

exports.mongoDbConfig = {
    url    : 'mongodb://localhost:27017/yuan',
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
    createdError          : 102,
    uploadedError         : 103,
    albumOperationError   : 104,
    payError              : 105,
    paramsError           : 106,
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