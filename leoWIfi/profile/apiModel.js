/**
 * Created by sunharuka on 15/7/1.
 */

var errorCode = require('../profile/config').errorCode;
var _ = require('underscore');
var util = require('util');

exports.wifiInfoGather = {
    type: 'object', properties: {
        _id           : {type: 'string', description: "db objectId"},
        ssid          : {type: 'string', description: "wifi ssid"},
        bssid         : {type: 'string', description: "wifi bssid"},
        level         : {type: 'integer', description: "wifi level"},
        sec_level     : {type: 'integer', description: "wifi sec_level"},
        capabilities  : {type: 'string', description: "wifi capabilities"},
        frequency     : {type: 'integer', description: "wifi frequency"},
        password      : {type: 'string', description: "wifi password"},
        identity      : {type: 'string', description: "wifi identity"},
        keyMgmt       : {type: 'string', description: "wifi keyMgmt"},
        eap           : {type: 'string', description: "wifi eap"},
        ip            : {type: 'string', description: "wifi ip"},
        latitude      : {type: 'number', description: "wifi latitude"},
        longitude     : {type: 'number', description: "wifi longitude"},
        connectable   : {type: 'boolean', description: 'wifi connectable'},
        tryTime       : {type: 'number', description: 'try timestamp'},
        accuracy      : {type: 'string', description: "wifi accuracy"},
        sharedable    : {type: 'boolean', description: 'wifi sharedable'},
        is_root       : {type: 'boolean', description: "wifi is_root"},
        other_settings: {type: 'string', description: "other setting"}
    }
};

exports.simpleWifiInfo = {
    type: 'object', properties: {
        _id         : {type: 'string', description: "db objectId"},
        ssid        : {type: 'string', description: "wifi ssid"},
        bssid       : {type: 'string', description: "wifi bssid"},
        level       : {type: 'integer', description: "wifi level"},
        sec_level   : {type: 'integer', description: "wifi sec_level"},
        capabilities: {type: 'string', description: "wifi capabilities"},
        frequency   : {type: 'integer', description: "wifi frequency"},
        password    : {type: 'string', description: "wifi password"},
        identity    : {type: 'string', description: "wifi identity"},
        keyMgmt     : {type: 'string', description: "wifi keyMgmt"},
        eap         : {type: 'string', description: "wifi eap"},
        is_root     : {type: 'boolean', description: "wifi is_root"},
        latitude    : {type: 'number', description: "wifi latitude"},
        longitude   : {type: 'number', description: "wifi longitude"}
    }
};

exports.wifiInfoResponse = {
    type: 'object', properties: {
        _id           : {type: 'string', description: "db objectId"},
        ssid          : {type: 'string', description: "wifi ssid"},
        bssid         : {type: 'string', description: "wifi bssid"},
        level         : {type: 'integer', description: "wifi level"},
        sec_level     : {type: 'integer', description: "wifi sec_level"},
        capabilities  : {type: 'string', description: "wifi capabilities"},
        frequency     : {type: 'integer', description: "wifi frequency"},
        password      : {type: 'string', description: "wifi password"},
        identity      : {type: 'string', description: "wifi identity"},
        keyMgmt       : {type: 'string', description: "wifi keyMgmt"},
        eap           : {type: 'string', description: "wifi eap"},
        latitude      : {type: 'number', description: "wifi latitude"},
        longitude     : {type: 'number', description: "wifi longitude"},
        accuracy      : {type: 'string', description: "wifi accuracy"},
        is_root       : {type: 'boolean', description: "wifi is_root"},
        is_hotspot    : {type: 'boolean', description: "是否个人wifi热点"},
        other_settings: {type: 'string', description: "other setting"},
        poster          : {
            type: 'object', properties: {
                normal: {type: 'string', description: "标准图Url"},
                thumb: {type: 'string', description: "缩略图Url"}
            }
        },
        country       : {type: 'string', description: '国家代码'},
        city          : {type: 'string', description: '城市代码'}
    }
}


function genErrorMsg() {
    var desc = '错误代码,返回成功时错误代码是０, 错误代码：';
    desc += util.format('%j', errorCode);
    return desc;
}

var errorMessage = genErrorMsg();
var errCode = _.values(errorCode);

exports.ErrorRtn = {
    type      : 'object',
    required  : ['code'],
    properties: {
        code: {
            type       : 'integer',
            description: '错误代码',
            enum       : errCode,
            default    : 101
        },
        msg : {type: 'string', description: '错误描述', default: ''}
    }
};

exports.OperRtn = {
    type      : 'object',
    properties: {
        err: {type: 'integer', description: '错误代码，操作成功返回0', default: 0},
        msg: {type: 'string', description: '错误描述信息', default: ''}
    }
};
