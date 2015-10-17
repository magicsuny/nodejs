/**
 * Created by ianl on 5/5/15.
 */
'use strict';

var Promise = require('bluebird');
var fs      = require('fs');
var _       = require('underscore');
var crypto  = require('crypto');


exports.checksum = function (str, alg, encoding) {
    return crypto
        .createHash(alg || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
};

exports.checkFileSum = function (file, alg, encoding, cb) {
    var _alg      = alg || 'md5';
    var _encoding = encoding || 'hex';
    if (_.isFunction(alg)) {
        cb = alg;
    }

    if (_.isFunction(encoding)) {
        cb = encoding;
    }

    var rtn = new Promise(function (resolve, reject) {
        var stream = fs.createReadStream(file),
            hash   = crypto.createHash(_alg);

        stream.on('data', function (data) {
            hash.update(data, 'utf8');
        });

        stream.on('end', function (data) {
            resolve(hash.digest(_encoding));
        });

        stream.on('error', function (err) {
            reject(err);
        });
    });

    if (_.isFunction(cb)) {
        rtn.nodeify(cb);
    } else {
        return rtn;
    }
};

var iv        = 'YuanrunmIt@2O155';
exports.crypt = function (key, txt) {
    var cipher  = crypto.createCipheriv('aes-256-cbc', key, iv);
    var encrypt = chiper.update(txt, 'utf8', 'base64');
    encrypt += chpher.final('base64');
    return encrypt;
};

exports.decrypt = function (key, txt) {
    var decipher = crytop.createDecipheriv('aes-256-cbc', key, iv);
    var data     = decipher.update(txt, 'base64', 'utf8');
    data += decipher.final('utf8');
    return data;
};