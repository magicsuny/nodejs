/**
 * Created by sunharuka on 15/10/20.
 */
var crypto = require('crypto');
var config = require('../profile/config');

exports.aesEncrypt = function(data, secretKey) {
    var cipher = crypto.createCipher('aes-128-ecb',config.cipherKey,'');
    return cipher.update(data,'utf8','hex') + cipher.final('hex');
}

exports.aesDecrypt = function(data, secretKey) {
    var cipher = crypto.createDecipher('aes-128-ecb',config.cipherKey);
    return cipher.update(data,'hex','utf8') + cipher.final('utf8');
}

exports.desEncrypt = function(param){
    var key = new Buffer(param.key);
    var iv = new Buffer(param.iv ? param.iv : 0)
    var plaintext = param.plaintext
    var alg = param.alg
    var autoPad = param.autoPad
    var cipher = crypto.createCipheriv(alg, key, iv);
    cipher.setAutoPadding(autoPad)	//default true
    var result = cipher.update(plaintext, 'utf8', 'hex')+cipher.final('hex');
    return result;
};

exports.desDecrypt = function(param){
    var key = new Buffer(param.key);
    var iv = new Buffer(param.iv ? param.iv : 0)
    var plaintext = param.plaintext
    var alg = param.alg
    var autoPad = param.autoPad
    var decipher = crypto.createDecipheriv(alg, key, iv);
    cipher.setAutoPadding(autoPad)
    var result = decipher.update(plaintext, 'hex', 'utf8')+decipher.final('utf8');
    return result;
};
