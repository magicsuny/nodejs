/**
 * Created by sunharuka on 14-7-31.
 */
var https = require('https');
var config = require('../../config');

var AccessTokenService = function(ctx){
  this._ctx = ctx;
  this._appId = ctx._appId;
  this._appSecret = ctx._appSecret;
  this._store = ctx._store;
}

AccessTokenService.prototype.request = function(){
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: '/cgi-bin/token?grant_type=client_credential&appid='+this._appId+'&secret='+this._appSecret,
    method: 'GET'
  };

  var req = https.request(options, function(res) {
    var body = "";
    res.on('data', function(data) {
      body+=data;
    }).on('end',function(){
      body = JSON.parse(body);
      if(body.access_token){
        this.saveAccessToken();
      }
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}


/**
 * 保存accessToken
 */
AccessTokenService.prototype.saveAccessToken = function (accessToken) {
  this._store.save('accessToken',accessToken);
}


/**
 * 获取accessToken
 */
AccessTokenService.prototype.loadAccessToken = function () {
  this._store.load('accessToken');
}


/**
 * 注册任务
 */
AccessTokenService.prototype.register = function () {
 // var sched = later.parse.text('every 115 min');
 this._interval = setInterval(function () {
    this.request();
  }, 1000*7000);
  this.request();
}


/**
 * 注销任务
 */
AccessTokenService.prototype.unRegister = function (db) {
  // var sched = later.parse.text('every 115 min');
  clearInterval(this._interval);
}

module.exports = AccessTokenService;