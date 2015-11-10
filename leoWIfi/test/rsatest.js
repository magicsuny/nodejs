/**
 * Created by sunharuka on 15/11/9.
 */
'use strict';

var fs = require('fs')
    , ursa = require('ursa')
    , crt
    , key
    , msg
    ;

key = ursa.createPrivateKey(fs.readFileSync(__dirname+'/../certs/server/my-server.key.pem'));
crt = ursa.createPublicKey(fs.readFileSync(__dirname+'/../certs/client/my-server.pub'));

console.log('Encrypt with Public');
var now = Date.now();
msg = crt.encrypt("Everything is going to be 200 OK", 'utf8', 'base64');
var end = Date.now();
console.log('encrypted', msg, '\n',end-now);

console.log('Decrypt with Private');
now = Date.now();
msg = key.decrypt(msg, 'base64', 'utf8');
end = Date.now();
console.log('decrypted', msg, '\n',end-now);

console.log('############################################');
console.log('Reverse Public -> Private, Private -> Public');
console.log('############################################\n');

console.log('Encrypt with Private (called public)');
now = Date.now();
msg = key.privateEncrypt("Everything is going to be 200 OK", 'utf8', 'base64');
end = Date.now();
console.log('encrypted', msg, '\n',end-now);

console.log('Decrypt with Public (called private)');
now = Date.now();
msg = crt.publicDecrypt(msg, 'base64', 'utf8');
end = Date.now();
console.log('decrypted', msg, '\n',end-now);