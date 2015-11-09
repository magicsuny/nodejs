/**
 * Created by liang on 15-11-9.
 */
var request = require('request'),
    assert  = require('assert'),
    _ = require('underscore');

var rootUrl = 'http://127.0.0.1:3000/wifi/v1';

describe('wifiTest', function() {

    describe('gatherWifiInfo', function () {
        var testWifi = {
            "device_id": "d66d5dd6cad2089d",
            "infos": [
                {
                    "_id": "",
                    "ssid": "MG Group WiFi Service",
                    "bssid": "00:1d:7e:bc:b2:9c",
                    "level": 0,
                    "sec_level": 0,
                    "capabilities": "[ESS]",
                    "frequency": 0,
                    "password": "",
                    "identity": "",
                    "keyMgmt": "",
                    "eap": "",
                    "ip": "",
                    "latitude": 0,
                    "longitude": 0,
                    "connectable": true,
                    "tryTime": 0,
                    "accuracy": "",
                    "sharedable": true,
                    "is_root": true,
                    "other_settings": ""
                }
            ]
        };

        it('test gather wifi info', function (done) {
            var url = rootUrl + '/wifi';
            console.log(url);
            request.post(url, {json:testWifi},function (err, resp, body) {
                if(err){
                    return done(err);
                }
                var result = body instanceof Object ? body : JSON.parse(body);
                assert.equal(result.code,0,'gather wifi info error');
                done();
            })
        })
    });

    describe('gatherWifiHotSpotInfo', function () {
        var testHotSpot = {
            "_id":"5640572f449a51959f271a9a",
            "device_id":"d66d5dd6cad2089d",
            "ssid":"gateway",
            "bssid":"4c:54:99:cd:a3:19",
            "sec_level":1,
            "frequency":2462,
            "password":"",
            "identity":"",
            "keyMgmt":"",
            "latitude":0,
            "longitude":0,
            "accuracy":0,
            "is_root":false};

        it('test gather wifi hotSpot info', function (done) {
            var url = rootUrl + '/hotspot';
            console.log(url);
            request.post(url, {json:testHotSpot},function (err, resp, body) {
                if(err){
                    return done(err);
                }
                var result = body instanceof Object ? body : JSON.parse(body);
                assert.equal(result.code,0,'gather wifi hotSpot info error');
                done();
            })
        })
    });

    describe('findwifi', function () {
        var testWifi = {
            "device_id": "d66d5dd6cad2089d",
            "infos": [
                {
                    "_id": "",
                    "ssid": "MG Group WiFi Service",
                    "bssid": "00:1d:7e:bc:b2:9c",
                    "level": 0,
                    "sec_level": 0,
                    "capabilities": "[ESS]",
                    "frequency": 0,
                    "password": "",
                    "identity": "",
                    "keyMgmt": "",
                    "eap": "",
                    "ip": "",
                    "latitude": 0,
                    "longitude": 0,
                    "connectable": true,
                    "tryTime": 0,
                    "accuracy": "",
                    "sharedable": true,
                    "is_root": true,
                    "other_settings": ""
                }
            ]
        };

        it('test find wifi', function (done) {
            var url = rootUrl + '/findwifi';
            console.log(url);
            request.post(url, {json:testWifi},function (err, resp, body) {
                if(err){
                    return done(err);
                }
                var result = body instanceof Object ? body : JSON.parse(body);
                assert.equal(result.code,0,'test find wifi info error');
                done();
            })
        })
    });

    describe('findposter', function () {
        var testWifi = {
            "infos": [
                {
                    "_id": "",
                    "bssid": "00:1d:7e:bc:b2:9c"
                }
            ]
        };

        it('test find poster', function (done) {
            var url = rootUrl + '/findposter';
            console.log(url);
            request.post(url, {json:testWifi},function (err, resp, body) {
                if(err){
                    return done(err);
                }
                var result = body instanceof Object ? body : JSON.parse(body);
                assert.equal(result.code,0,'test find poster error');
                done();
            })
        })
    });
});