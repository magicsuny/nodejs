/**
 * Created by sunharuka on 15/10/20.
 */
var crypto = require('crypto');
var ursa = require('ursa');
var config = require('../profile/config');
var fs = require('fs');
//var rsa = {
//    server:ursa.createPrivateKey(fs.readFileSync(config.rsaKeyPath.server)),
//    client:ursa.createPublicKey(fs.readFileSync(config.rsaKeyPath.client))
//}


exports.aesEncrypt = function(data, secretKey) {
    var cipher = crypto.createCipher('aes-128-ecb',config.cipherKey,'');
    return cipher.update(data,'utf8','base64') + cipher.final('base64');
}

exports.aesDecrypt = function(data, secretKey) {
    var cipher = crypto.createDecipher('aes-128-ecb',config.cipherKey);
    return cipher.update(data,'base64','utf8') + cipher.final('utf8');
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

/**
 * rsa私钥加密
 * @param data
 * @returns {string}
 */
exports.rsaPrivateEncrypt = function(data){
    return rsa.server.privateEncrypt(data, 'utf8', 'base64');
};

/**
 * rsa私钥解密
 * @param data
 * @returns {Buffer|Object|string|Buffer|*}
 */
exports.rsaPrivateDecrypt = function(data){
    return rsa.server.decrypt(data,'base64', 'utf8');
}