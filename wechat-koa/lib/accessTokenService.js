/**
 * Created by sunharuka on 14-7-31.
 */
var co = require('co');
var coRequest = require('co-request');
var debug = require('debug')('wechat-koa-AccessTokenService');
var AccessTokenService = function(ctx){
  this._ctx = ctx;
  this._appId = ctx._appId;
  this._appSecret = ctx._appSecret;
  this._store = ctx._store;
}

AccessTokenService.prototype.request = function *(){
  var self = this;
//  var options = {
//    hostname: 'api.weixin.qq.com',
//    port: 443,
//    path: '/cgi-bin/token?grant_type=client_credential&appid='+this._appId+'&secret='+this._appSecret,
//    method: 'GET'
//  };
  var options = {
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+this._appId+'&secret='+this._appSecret,
    method: 'GET'
  };
  var res = yield coRequest(options);
  if(res.body){
    var body = JSON.parse(res.body);
    if(body.access_token){
      yield self.saveAccessToken(body.access_token);
    }else{
      throw new Error(body);
    }
  }
//  var req = https.request(options, function(res) {
//
//    var body = "";
//    res.on('data', function(data) {
//      body+=data;
//    }).on('end',function(){
//      body = JSON.parse(body);
//      if(body.access_token){
//
//        debug('accessToken updated:'+body.access_token);
//      }
//    });
//  });
//  req.end();
//
//  req.on('error', function(e) {
//    console.error(e);
//  });
}


/**
 * 保存accessToken
 */
AccessTokenService.prototype.saveAccessToken = function*(accessToken) {
  yield this._store.save('accessToken',accessToken);
  console.log('accessToken saved');
}


/**
 * 获取accessToken
 */
AccessTokenService.prototype.loadAccessToken = function*() {
  var sccessToken = yield this._store.load('accessToken');
  return sccessToken;
}


/**
 * 注册任务
 */
AccessTokenService.prototype.register = function *() {
 var self = this;
 // var sched = later.parse.text('every 115 min');
  console.log('AccessTokenService registered!')
  this._interval = setInterval(function(){
    co(function*(){
      yield self.request();
    })();
  },1000*7000);
  yield this.request();

}


/**
 * 注销任务
 */
AccessTokenService.prototype.unRegister = function (db) {
  // var sched = later.parse.text('every 115 min');
  clearInterval(this._interval);
}

module.exports = AccessTokenService;