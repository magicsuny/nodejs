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

var data = {
    "device_id": "333333334",
    "infos": [
        {

            "ssid": "tttttttttt",

            "level": 0,
            "sec_level": 6,
            "capabilities": "string",
            "frequency": 0,
            "password": "string",
            "identity": "string",
            "keyMgmt": "string",
            "eap": "fdsfdsfs",
            "ip": "string",
            "latitude": 0,
            "longitude": 0,
            "connectable": true,
            "tryTime": 1447671995122,
            "accuracy": "string",
            "sharedable": true,
            "is_root": true,
            "other_settings": "string"
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

s = Date.now();
var arsde = cipher.aesDecrypt('894981c3981cc18e1ef04fb049ee24fe5c601a22575b80ec3dde7fa80814ad29d081b52284f07af6cdf59a3e34fc5abf67adcba381d0d24d3b5ab962dc001993fbe7acca2a1115c999631d6fc434da8bace8fa75b6d01b728ed2e2f4dea073c519755bada082d2e04089ecf74041ed53bb26c63a39605f4b6a1995e1a9fdd2ba191a047194784e359198022c72895888f0f7bd5c79761ae3791f065a25a72d762a7672ccfca905c43370b8ccb102e4c1e78dd668b8b0f530a60282bd008d687b2bba7e6c04f65004beb064a61828b459aa378541df15d7cb383c330a71bb29280ccfd921517bc7f1311e288cb5218e3f7b48289b293ac2225335ef8b611eb0e9555331f26d58035bc38476f6ff00b00f9985cb89cc5fb455474a48baee254b1df00b1cbf7fb7fe8c8b7fc2c0c3fc73e0d95520ac861d4649d2cdd60dabeee63613eada43505d0a9bc637f71daaae5b2c');
console.log(arsde, Date.now() - s);

s = Date.now();
var arsen = cipher.aesEncrypt(arsde);
console.log(arsen, Date.now() - s);
