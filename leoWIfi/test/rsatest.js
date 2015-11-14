var NodeRSA = require('node-rsa');
var fs = require('fs');
var privatekey = fs.readFileSync(__dirname+'/../certs/server/wifimaster.key.pem');
var publickey = fs.readFileSync(__dirname+'/../certs/client/wifimaster.pub');

var skey = new NodeRSA(privatekey);
var ckey = new NodeRSA(publickey);

var cipher = require('../utils/cipherUtils');

var data = {
    "device_id": "string",
    "latitude": 0,
    "longitude": 0,
    "infos": [
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        },
        {
            "bssid": "94:f6:65:73:56:dc",
            "capabilities": "[WPA-PSK-CCMP][ESS]",
            "identity": "",
            "password": "guest4leo",
            "ssid": "leo-guest",
            "accuracy": 0.0,
            "latitude": 0.0,
            "longitude": 0.0,
            "tryTime": 1447127182279,
            "connetable": true,
            "frequency": 5745,
            "is_hotspot": false,
            "is_root": false,
            "level": -39,
            "mIsChanged": true,
            "sec_level": 3,
            "sharedable": true
        }
    ]
};

//var s = Date.now();
//var encrypt = skey.encryptPrivate(new Buffer(JSON.stringify(data)), 'base64');
//console.log(encrypt.toString('base64'),Date.now()-s);
//
//s= Date.now();
//var decrypt = ckey.decryptPublic(encrypt,'utf8');
//console.log(decrypt,Date.now()-s);
//
//
//
//s =Date.now();
//var en = ckey.encrypt(new Buffer(JSON.stringify(data)), 'base64');
//console.log(en,Date.now()-s);
//
//s =Date.now();
//console.log(skey.decrypt(en,'utf8'),Date.now()-s);
//
s = Date.now();
var arsen = cipher.aesEncrypt(JSON.stringify(data));
console.log(arsen,Date.now()-s);

s= Date.now();
var arsde = cipher.aesDecrypt(arsen);
console.log(arsde,Date.now()-s);