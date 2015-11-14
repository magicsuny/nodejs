/**
 * Created by sunharuka on 15/10/20.
 */
var crypto = require('crypto');
var NodeRSA = require('node-rsa');
var config = require('../profile/config');
var fs = require('fs');
var rsa = {
    /*server:new NodeRSA(fs.readFileSync(config.rsaKeyPath.server)),
    client:new NodeRSA(fs.readFileSync(config.rsaKeyPath.client))*/
}


exports.aesEncrypt = function(data, secretKey) {
   // var iv = new Buffer(16);
    var cipherData = new Buffer(data, 'utf8');
    var cipher = crypto.createCipheriv('aes-128-ecb',config.cipherKey,'');
    var encrypted = [cipher.update(cipherData)];
    encrypted.push(cipher.final());
    return Buffer.concat(encrypted).toString('hex');
}

exports.aesDecrypt = function(data, secretKey) {
    var cipherData =new Buffer(data.trim(), 'hex');
    var decipher = crypto.createDecipheriv('aes-128-ecb', config.cipherKey,'');
    var decrypted = [decipher.update(cipherData,'hex')];
    decrypted.push(decipher.final());
    return Buffer.concat(decrypted).toString('utf8');
}


exports.decrypt = function(cipher, key) {
   // var decodeKey = crypto.createHash('sha256').update(key, 'utf-8').digest();
    if (cipher === null)
        return null
    else if (typeof cipher == 'undefined')
        return undefined;
    else if (cipher === '')
        return '';

    //cipher = new Buffer(cipher, 'hex');
    var iv = cipher.slice(0, 16);
    iv = new Buffer('');
    var ciphertext = cipher.slice(16);

    var decipher = crypto.createDecipheriv('aes-128-ecb', config.cipherKey,'');
    var decrypted = [decipher.update(cipher,'hex','utf8')];
    decrypted.push(decipher.final('utf8'));

    return Buffer.concat(decrypted).toString('utf8');
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
    var encryptedData = rsa.server.encryptPrivate(new Buffer(data), 'base64');
    return encryptedData.toString('base64');
};

/**
 * rsa私钥解密
 * @param data
 * @returns {Buffer|Object|string|Buffer|*}
 */
exports.rsaPrivateDecrypt = function(data){
    return rsa.server.decrypt(data, 'utf8');
}