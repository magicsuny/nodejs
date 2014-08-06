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
/**
 * oauth2.0 授权获取网页accessToken
 * @param code oauth2.0登录后返回的code值
 * @returns {*}
 */
AccessTokenService.prototype.oAuthRequest = function *(code){
  var self = this;
  var options = {
    url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+this._appId+'&secret='+this._appSecret+'&code='+code+'&grant_type=authorization_code',
    method: 'GET'
  };
  var res = yield coRequest(options);
  if(res.body){
    var body = JSON.parse(res.body);
    if(body.errcode){
      throw new Error(body.errcode,body.errmsg);
    }else{
      return body;
    }
  }
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
    if(body.errcode){
      throw new Error(body.errcode,body.errmsg);
    }else{
      yield self.saveAccessToken(body.access_token);
      return body.access_token;
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
      try{
        yield self.request();
      }catch(e){
        console.log(e);
      }
    })();
  },1000*7000);
  try {
    yield this.request();
  }catch(e){
    console.log(e);
  }

}


/**
 * 注销任务
 */
AccessTokenService.prototype.unRegister = function (db) {
  // var sched = later.parse.text('every 115 min');
  clearInterval(this._interval);
}

module.exports = AccessTokenService;