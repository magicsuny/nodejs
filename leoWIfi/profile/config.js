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
        colorize        : true,
        timestamp       : timestamp,
        prettyPrint     : true,
        debugStdout     : true,
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
exports.uploadAvatarFileDir = '/tmp/upload/';
exports.AvatarS3BuketName = 'leowifi.avatar.development';

/*
 *mongodb config
 */
exports.mongoDebugMode = true;
exports.posterBaseUrl = 'https://s3-ap-southeast-1.amazonaws.com/';
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

/*
 * rsa key
 */
exports.rsaKeyPath = {
    client:'/develop/git/nodejs/leoWifi/certs/client/my-server.pub',
    server:'/develop/git/nodejs/leoWifi/certs/server/my-server.key.pem'
}

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


//wifi全局设置
exports.wifiClientSetting = {
    enableWifiCollect  : true,//是否允许采集
    showFreeWifiCount  : 5,//免费wifi显示条目
    gatherWifiCountOnce: 10,//一次采集wifi信息上传数
    gatherNSWifi       : true//采集不允许分享的wifi密码
};

exports.wifiServerSetting = {
    matchPrivateWifi: true//返回隐私wifi控制
};

exports.dlsTestList = {
    //中国
    CN: ['https://swdlp-static.apple.com/images/zh_CN/iTunes_DwlNow_zhcn_08092008.gif?v=20090311',
        'https://downloads.yahoo.com/download/ff/hk/mac',
        'https://www.microsoft.com/zh-cn/download/confirmation.aspx?id=47046'],
    //美国
    US: ['https://secure-appldnld.apple.com/itunes12/031-36008-20151020-9e811a71-3086-483a-9859-39edd85838f8/itunes64setup.exe',
        'https://downloads.yahoo.com/download/ff/us/mac',
        'https://www.microsoft.com/en-us/download/confirmation.aspx?id=47046'],
    //印度
    IN: ['https://support.apple.com/downloads/DL1846/en_US/secupd2015-007mavericks.dmg',
        'https://downloads.yahoo.com/download/ff/in/mac',
        'https://www.microsoft.com/en-in/download/confirmation.aspx?id=47046'],
    //印度尼西亚
    ID: ['https://support.apple.com/downloads/DL1834/id_ID/secupd2015-006mavericks.dmg',
        'https://downloads.yahoo.com/download/ff/id/mac',
        'http://www.microsoft.com/id-id/download/confirmation.aspx?id=9'],
    //巴西
    BR: ['https://support.apple.com/downloads/DL1834/pt_BR/secupd2015-006mavericks.dmg',
        'https://downloads.yahoo.com/download/ff/br/mac',
        'http://www.microsoft.com/pt-br/download/confirmation.aspx?id=47046'],
    //泰国
    TH: ['https://support.apple.com/downloads/DL1834/th_TH/secupd2015-006mavericks.dmg',
        'https://downloads.yahoo.com/download/ff/th/mac',
        'http://www.microsoft.com/th-th/download/confirmation.aspx?id=36367'],
    //马来西亚
    MY: ['https://support.apple.com/downloads/DL1846/en_US/secupd2015-007mavericks.dmg',
        'https://downloads.yahoo.com/download/ff/my/mac',
        'http://www.microsoft.com/en-my/download/confirmation.aspx?id=5555'],
    //新加坡
    SG: ['https://support.apple.com/downloads/DL1846/en_US/secupd2015-007mavericks.dmg',
        'https://downloads.yahoo.com/download/ff/sg/mac',
        'http://www.microsoft.com/en-sg/download/confirmation.aspx?id=42642']
}

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
