var NodeRSA = require('node-rsa');
var fs = require('fs');
/*var privatekey = fs.readFileSync(__dirname + '/../certs/server/wifimaster.key.pem');
var publickey = fs.readFileSync(__dirname + '/../certs/client/wifimaster.pub');

var skey = new NodeRSA(privatekey);
var ckey = new NodeRSA(publickey);*/

var cipher = require('../utils/cipherUtils');

var data = {
    "device_id": "8bc871c16e453e929d35bde8e0fc45ad",
    "infos"    : [{
        "accuracy"    : 56.732696533203125,
        "bssid"       : "20:dc:e6:87:b1:e0",
        "capabilities": "[WPA-PSK-CCMP][WPA2-PSK-CCMP][WPS][ESS]",
        "connetable"  : false,
        "frequency"   : 2427,
        "identity"    : "",
        "is_hotspot"  : false,
        "is_root"     : false,
        "latitude"    : 39.969857,
        "level"       : -43,
        "longitude"   : 116.484504,
        "mIsChanged"  : true,
        "sec_level"   : 3,
        "sharedable"  : false,
        "ssid"        : "leo-2",
        "tryTime"     : -1
    }, {
        "accuracy"    : 56.732696533203125,
        "bssid"       : "26:14:4b:7f:92:ce",
        "capabilities": "[WPA-PSK-CCMP][WPA2-PSK-CCMP][ESS]",
        "connetable"  : false,
        "frequency"   : 2462,
        "identity"    : "",
        "is_hotspot"  : false,
        "is_root"     : false,
        "latitude"    : 39.969857,
        "level"       : -43,
        "longitude"   : 116.484504,
        "mIsChanged"  : true,
        "sec_level"   : 3,
        "sharedable"  : false,
        "ssid"        : "XY",
        "tryTime"     : -1
    }, {
        "accuracy"    : 56.732696533203125,
        "bssid"       : "16:14:4b:7f:92:ce",
        "capabilities": "[WPA-PSK-CCMP][WPA2-PSK-CCMP][ESS]",
        "connetable"  : false,
        "frequency"   : 2462,
        "identity"    : "",
        "is_hotspot"  : false,
        "is_root"     : false,
        "latitude"    : 39.969857,
        "level"       : -42,
        "longitude"   : 116.484504,
        "mIsChanged"  : true,
        "sec_level"   : 3,
        "sharedable"  : false,
        "ssid"        : "HanMei",
        "tryTime"     : -1
    }]
};

var data = { ssid: 'AndroidAP3',
    bssid: '54:40:AD:DC:3F:0F',
    device_id: '8bc871c16e453e929d35bde8e0fc45ad',
    password: 'jjbb1101',
    sec_level: 3,
    longitude: 116.484404,
    accuracy: 53.25863265991211,
    latitude: 39.969923,
    frequency: 0 };

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

s = Date.now();
var arsde = cipher.aesDecrypt('894981c3981cc18e1ef04fb049ee24fec45319042e243143c713865ede040c78bc352f2e26bc7f714f413e29cc744ce6c947602dca6ba708bdd1c61fab770d0962a1f3567002fe7eefc89b4bfe147a0ec11d45f03f18244e75d1be4955671872521b73a22bca3c888e2d46f425ac121edda501f4dba938711a8e2cbe1632da7e61417b6de3802caa950489b2016d8ca8f86afcd910c1382d73370ef893cfc8be9f37f77da7794d46c9e9f3520606501ece523263af0863d604a37665b97671e9e4f42180a2b7e459ab872b8d1909844b0effe9611b68796aa9e8de13256e18aa7565f1651be211b3b9c02afcd191a677a0272bb64684c9343bc65bfec6f0235713124f2d29ae6d4422539650666b59baa405d3e5e66e700965e39d916f71d6fed637c0b74b87d5a7339f423085aff0d99d9f424d9676629b435177163fefadd85831bf2fcf37d40ad27abbd75fe0794b650a8152d082116ef37edebcac8c670e4621061420e0e475f41f5fb498acf13f32b44cd26e7805a50f3c991aa53cb63432fc3e3021258a9528705a56cceb9bec');
console.log(arsde, Date.now() - s);

s = Date.now();
var arsen = cipher.aesEncrypt(arsde);
console.log(arsen, Date.now() - s);
