/**
 * Created by liang on 15-11-13.
 */
var express  = require('express');
var router   = express.Router();
var common   = require('../routes/common');
var error    = require('../utils/error');
var multer   = require('multer');
var fs       = require('fs');
var Promise  = require('bluebird');
var request  = Promise.promisify(require("request"));
var cfg      = require('../profile/config');
var _        = require('underscore');
var auth     = require('./auth');
var Wifi       = require('../model/db').Wifi;
var Device      = require('../model/db').Device;

function decorator(f) {
    function decor(req, res, next) {
        return Promise.resolve(f(req, res, next))
            .then(function (data) {
                var obj = {code: 0, msg: ""};
                obj.data = data;

                res.json(obj);
            })
            .catch(function (err) {
//                Error.captureStackTrace(err, Error); // does not work
                return next(err);
            })
    }

    return decor;
}

var _getDevices = function (req, res, next) {
    var start     = parseInt(req.query.start) || 0,
        rows      = parseInt(req.query.rows) || 10;


    return Device.findAndCountAll({},start,rows);
};

var _getWifis = function(req, res, next0) {
    var start     = parseInt(req.query.start) || 0,
        rows      = parseInt(req.query.rows) || 10;

    return Wifi.findAndCountAll({},start,rows);
}


var apiVersion = 1;

var apiProfile = [

    {
        method     : 'get',
        path       : '/test/devices',
        description: '获得已保存的设备信息',
        version    : apiVersion,
        params     : [
            {
                name       : 'start',
                type       : 'number',
                in         : 'query',
                default    : 0,
                description: '起始行数'
            },
            {
                name       : 'rows',
                type       : 'number',
                in         : 'query',
                default    : 10,
                description: '总行数'
            }
        ],
        responses  : {
            200: {
                description: '结果'
            }
        },
        handler    : [decorator(_getDevices)]
    },
    {
        method     : 'get',
        path       : '/test/wifis',
        description: '获得已保存的wifi信息',
        version    : apiVersion,
        params     : [
            {
                name       : 'start',
                type       : 'number',
                in         : 'query',
                default    : 0,
                description: '起始行数'
            },
            {
                name       : 'rows',
                type       : 'number',
                in         : 'query',
                default    : 10,
                description: '总行数'
            }
        ],
        responses  : {
            200: {
                description: '结果'
            }
        },
        handler    : [decorator(_getWifis)]
    }
    ];




apiProfile.forEach(function (p) {
    var method  = p.method;
    var path    = p.path;
    var handler = p.handler;

    var profileMW = function (req, res, next) {
        req.profile = p;
        next();
    };

    if (!Array.isArray(handler)) throw new Error('handlers middleware must be Array');

    handler.unshift(profileMW);
    var fn        = router[method];

    if (fn && fn instanceof Function) {
        fn.call(router, path, handler);
    }
});


module.exports = {
    router                  : router,
    profile                 : apiProfile,
    tag                     : '测试相关',
    description             : '用于测试的相关API'
};
