/**
 * Created by sunharuka on 15/11/10.
 */
var crypto = require('crypto');
var fs = require('fs');
var privatekey = fs.readFileSync(__dirname+'/../certs/server/my-server.key.pem');
var publickey = fs.readFileSync(__dirname+'/../certs/client/my-server.pub');

var encryptedData = crypto.privateEncrypt(privatekey,new Buffer('Everything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OKEverything is going to be 200 OK','utf8'));
console.log(encryptedData.toString('base64'));

var decryptedData = crypto.publicDecrypt(publickey,encryptedData);
console.log(decryptedData.toString('utf8'))