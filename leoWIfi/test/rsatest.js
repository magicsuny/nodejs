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
//s = Date.now();
//var arsen = cipher.aesEncrypt(JSON.stringify(data));
//console.log(arsen,Date.now()-s);

s= Date.now();
var arsde = cipher.aesDecrypt('MkU5NjA2QkMwOUYzMjczNDNEQUNDNkM1Rjg1MkQ5RTdDNzI5RTc1NkIzMjAzNTBENjM3QTE5RDEyMjM2QjgwRTMyMkQ3MTVFMkQwOUU4NTJBMTMyODc5QTU1QTQ0QTg0QTNCNTAwRDUxRTdCOEExQ0E4QUI0NzM2QUFCOEM2NUQ5Rjg3MjE5QUEyQzdCMTJEQjU5NEE3QzA2MTlDMDY2RjVGRjhFODVCOTk2QTIxM0Y5NjIwNUYzNzI2QkZDNTFGRDIxMkNENzZBMUVBMTA2QzY5QUIwOTE4Mzk1NEE4NEE3QkFCMURCQzk5QzRFNDBENTg4RjU0NEY0QkM0QkYwRDEwNTFFNEEzMjM1NjBEQTA0RTUxNzVGRUIzRkUwQkY3Q0I3MzVFMDNFNzE0OEI5N0I1RUY3OTdEMDU5MTlFRjU5RUFBNTVBOTFEMDE5RDMxODlCNTdGRjA4NDQzQUFBQjRCNjI3ODA5Njk4OUJCMzA2M0Q4ODY0QTE2OTUwQzMwNzRBQ0U2MkFGQzk1NTM4NThCQzA4RUI3NjVDQjNDMTZGMEY3QkQ1Qzc5NzYxQUUzNzkxRjA2NUEyNUE3MkQ3NkMxOUMzNUMwMDk3NjA3QTA0M0IxOUYzMjA3NEUzNkJFMUM2QUEwRTZBRTlEOUE5QTVCQTg1Nzk3NUI2REZCMjI2OUY1QzJCQ0REMDI0QUU4QzMxMTRBMUI2QUVCNTg4OEE1MjY5Q0M4NUI4M0RBNDQxMzk5MkRCQTk5MjJERTIwQ0FERUQyMkRFQzExMDVEOUREMEY3MUQ2MkYzNjlGRTgwMjlBMzZBRTUxMkMzM0Y5QUE2RjAyMTYzMDk4QUMxRUQxNjNGRkYxRjRDMzNBMTUwODk2QTI1RkMwMEU5RTRFMDAyQUMxRDRFREE0MDdEMzJCNDc1Q0UwRjVBRkNFMjVBOUY1OENDNDIzODg2QkJGREEyMUE0QUIzMDQyMjU5NDM4Q0FCQjg3MDI1MzJBNURGNEM1NjBDQTZCOTlBNTVEODI3NTExQUM1MDlBNDgxMjY5RTVEREUzNjhGOEVENzRENjNDQzE1QzJBOTY1OTY5MDZFQjNEQUVCRTQ5NjRBMTMyREQyNjJFMEExMUY3QjkwN0UzOTMzRUYyRTU2OEM1NDJDQ0IzRjA0MTJDQ0RBODlCODRFMTUyM0JBRjg0Q0VEQTI3NEI0MjlBQzhEQTlFQTI3NkVBRUM0MzYyQkYzRDlBNjc5MzA0NTZDNDUwOTI1Mjk5QzBDMDdBRUNEQjk1QzVGNzdFMzY5MjgyMkUzRURGNkQ2RjE3OTk3RTI3RDg1MzA3QzQ3MDVCRjczMjE2MDQ2OTY2NUU2Mjg4NkY1OUY1MTUwNEI2RkQ2QTkyMENEQTlDQjY2QkE2RjA1QjFCMzcxMTJDQzQyRkMzNzQ1MTgyOEZBNTU5MDFFNTU3MDY0NTQ2NEY5QUYwMUY5NzBFNDREMkY0Q0JFRkQ1MzdFMTczQjU5RDI3OUE2OTFBRURENkQwNDlBOUNBN0ZENUI0OEU3QjM3MjRDRDdFQjA1RDNDRDdGNUI3NDU3QUU0MUZFOEEwNUUzMTg3MkFGQTU4QjdFRUVFQTUxNzkyNjk3MjlCMjJEQjg0QUZGMTgyMEQ3NzUwQkI3RTczRkVDOEM2MkMzMzI3QTE0NjVCOTFFNTRDRTk4M0Y5NDQwMzM4MDU1MEU0NDc1NUYxRjM0MkE4Mjg1MzFGRTZENzU5ODI0NTFDQ0Y1MUNGQUI1NkUwQjU5OTA5NEJFOEY3QjA1RDc1NkUzMkVBMUQ2NjkzNTlCRDU2RTI0NTY5RUEwODM3QjU3RjI0NjIyODFDNTcwQkYxMzZBNDBDQ0Q4OTIyODQ0QjQ1OUFGMjc3OEYxNDc1RDg1NzQzQURGRkU4RTM1OUQ4N0YzOEY2QjFEREE0Q0JBRjk4NjJCMzAyNTE3QzExRjFDREQ1MEY5ODg3RTE4RTI2MDY3QTA3NkU2NTI5MUNGNjU0RUVGOTNFRERBMDAxQTJENjU5ODU0RDg5RTY2RkU4NTlFNTRDNjRGMzdGRkUxRjlFNjI5RUQ2NkRDMTJCMUY1MkI0RDI2RTk5MDBDQUY4MTgwQjM1REU0QkIwMjg2NEIwQjMyRTVFNjNCNDIwRTg2MUMxNUZENDhBQkQxQzI5RUJCNjMzQTYwRTREODdBRjNGRTc1NTQ3NjE1QkVBMDVGRUEzRTcxREZFOUE4Q0Q2NThEN0RGN0U4MTg0NEFEOEEwQ0UyNzNGNTNCQzJBNjUyM0M1N0YwMkRFNkUyMEExMkZCMTgwRTAyQTg2MDMxMjMzNEZBMzZEQzkxQkJBRTQ2QjUxMkE0QThFMjgwQUE0MzkzODVGMkQyMEQ1REQzRjY3QjlCOUU2NDE0ODVCQTVFNzEwOUQ1NzgyNEU0MUFGOTcwQjRBRDcyQzNDNUIwQUUwODQ3OEE2RUIwMTgxNkVBRTAzNDE2NUQ4NkU0NkY1RDUxNzFBMzE1M0MyNTgzRUU2Nzg3RkQ2MTM5REI2NUFCMjFCQjYxODkyNkRDRTRBNkRCRDBFMjUzNjNFRUVFQUEwMzBENDc2NjMyRTUzQjAxQTE4OEMwQTJBNUIzQTA4NDA1NUVERTlDNDMxM0E5QjUyMUI3M0EyMkJDQTNDODg4RTJENDZGNDI1QUMxMjFFRjJFQkI4Qjg0MDlGRDA2NjMyMTNGNkNDNjYxMzQ1MUVFMEE4NzhCRUEwQThEMUUxRUM5OEQ1RDMyQTFDRUQzOUI4Qjc1MkI5OTI0MkM3M0JCNjUwQkRBMjQ5NDU0OEQ3NzZDN0NFNTMxQUZBOTIyNUEyMDIxNzU0MzAxREEzMEQ=');
console.log(arsde,Date.now()-s);