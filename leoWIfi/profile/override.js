/**
 * Created by sunharuka on 15/6/11.
 */
var winston = require('winston');
var _       = require('underscore');
exports.cache = {
    url : 'localhost',
    port: 6379
};
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

process.env.NODE_ENV = 'development';
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
}

var logFile = {
    info : '../info.log',
    error: '../error.log'
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

