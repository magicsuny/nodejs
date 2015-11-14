var NodeRSA = require('node-rsa');
var fs = require('fs');
var privatekey = fs.readFileSync(__dirname + '/../certs/server/wifimaster.key.pem');
var publickey = fs.readFileSync(__dirname + '/../certs/client/wifimaster.pub');

var skey = new NodeRSA(privatekey);
var ckey = new NodeRSA(publickey);

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
var arsde = cipher.aesDecrypt('2E9606BC09F327343DACC6C5F852D9E7C729E756B320350D637A19D12236B80E322D715E2D09E852A132879A55A44A84A3B500D51E7B8A1CA8AB4736AAB8C65D9F87219AA2C7B12DB594A7C0619C066F5FF8E85B996A213F96205F3726BFC51FD212CD76A1EA106C69AB09183954A84A7BAB1DBC99C4E40D588F544F4BC4BF0D1051E4A323560DA04E5175FEB3FE0BF7CB735E03E7148B97B5EF797D05919EF59EAA55A91D019D3189B57FF08443AAAB4B6278096989BB3063D8864A16950C3074ACE62AFC9553858BC08EB765CB3C16F0F7BD5C79761AE3791F065A25A72D76C19C35C0097607A043B19F32074E36BE1C6AA0E6AE9D9A9A5BA857975B6DFB2269F5C2BCDD024AE8C3114A1B6AEB5888A5269CC85B83DA4413992DBA9922DE20CADED22DEC1105D9DD0F71D62F369FE8029A36AE512C33F9AA6F02163098AC1ED163FFF1F4C33A150896A25FC00E9E4E002AC1D4EDA407D32B475CE0F5AFCE25A9F58CC423886BBFDA21A4AB3042259438CABB8702532A5DF4C560CA6B99A55D827511AC509A481269E5DDE368F8ED74D63CC15C2A96596906EB3DAEBE4964A132DD262E0A11F7B907E3933EF2E568C542CCB3F0412CCDA89B84E1523BAF84CEDA274B429AC8DA9EA276EAEC4362BF3D9A67930456C450925299C0C07AECDB95C5F77E3692822E3EDF6D6F17997E27D85307C4705BF732160469665E62886F59F51504B6FD6A920CDA9CB66BA6F05B1B37112CC42FC37451828FA55901E5570645464F9AF01F970E44D2F4CBEFD537E173B59D279A691AEDD6D049A9CA7FD5B48E7B3724CD7EB05D3CD7F5B7457AE41FE8A05E31872AFA58B7EEEEA5179269729B22DB84AFF1820D7750BB7E73FEC8C62C3327A1465B91E54CE983F94403380550E44755F1F342A828531FE6D75982451CCF51CFAB56E0B599094BE8F7B05D756E32EA1D669359BD56E24569EA0837B57F2462281C570BF136A40CCD8922844B459AF2778F1475D85743ADFFE8E359D87F38F6B1DDA4CBAF9862B302517C11F1CDD50F9887E18E26067A076E65291CF654EEF93EDDA001A2D659854D89E66FE859E54C64F37FFE1F9E629ED66DC12B1F52B4D26E9900CAF8180B35DE4BB02864B0B32E5E63B420E861C15FD48ABD1C29EBB633A60E4D87AF3FE75547615BEA05FEA3E71DFE9A8CD658D7DF7E81844AD8A0CE273F53BC2A6523C57F02DE6E20A12FB180E02A860312334FA36DC91BBAE46B512A4A8E280AA439385F2D20D5DD3F67B9B9E641485BA5E7109D57824E41AF970B4AD72C3C5B0AE08478A6EB01816EAE034165D86E46F5D5171A3153C2583EE6787FD6139DB65AB21BB618926DCE4A6DBD0E25363EEEEAA030D476632E53B01A188C0A2A5B3A084055EDE9C4313A9B521B73A22BCA3C888E2D46F425AC121EF2EBB8B8409FD0663213F6CC6613451EE0A878BEA0A8D1E1EC98D5D32A1CED39B8B752B99242C73BB650BDA2494548D776C7CE531AFA9225A2021754301DA30D');
console.log(arsde, Date.now() - s);

s = Date.now();
var arsen = cipher.aesEncrypt(arsde);
console.log(arsen, Date.now() - s);
