/**
 * Created by sunharuka on 14-8-4.
 */

var crypto=require("crypto"),
  co = require('co'),
 debug = require('debug')('wechat-koa'),
  url = require('url'),
  AccessTokenService = require('./lib/accessTokenService'),
  userInfoService = require('./lib/userInfoService'),
  memoryStore = require('./lib/store/memory-store'),
  mongoStore = require('./lib/store/mongo-store'),
  messageEnging = require('./lib/messageEngine'),
  https = require('https');

var WechatCore = function(options) {
  var self = this;
  this._store = options.store;
  if(!options.store||!options.store.type){
    this._store = memoryStore.create();
  }else{
    if(!options.store.type){
       debug('param store not specified!');
      var err =  new Error();
      err.message = 'param store not specified!';
      throw err;
    }
    if('mongo'==options.store.type.toLowerCase()){
      this._store = mongoStore.create(options.store);
    }
  }
  this._appId = options.appId;
  this._appSecret = options.appSecret;
  this._token = options.token;
  /**
   * 执行accessToken注册
   */
  co(function*(){
    self.accessTokenService = new AccessTokenService(self);

    console.log('yield register');
    yield self.accessTokenService.register();
  })();
};

/**
 * 校验微信平台请求合法性
 * @param req_url
 * @returns {*}
 */
WechatCore.prototype.checkSignature = function (req_url){
  var query = url.parse(req_url,true).query;
  if(!query){
    console.log('checkSignature request url ERROR!');
    return false;
  }
  var signature = query.signature;
  var echostr = query.echostr;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = this._token;//这里填写你的token
  oriArray.sort();

  var original = oriArray[0]+oriArray[1]+oriArray[2];
  var hasher=crypto.createHash("sha1");
  hasher.update(original);
  var scyptoString=hasher.digest('hex');
  if (signature == scyptoString) {
    return echostr||true;
  }else {
    console.log('Signature is invalidate!!');
    return false;
  }
}

/**
 * 创建菜单
 * @param menuJson
 * @param accessToken
 */
WechatCore.prototype.createMenu = function*(menuJson){
  var accessToken = yield this.accessTokenService.loadAccessToken();
  console.log(accessToken);
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: '/cgi-bin/menu/create?access_token='+accessToken,
    method: 'POST'
  };

  var req = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);
    var body = "";
    res.on('data', function(d) {
      body+=d;
    }).on('end',function(){
      body = JSON.parse(body);
      if(body.errcode>0){
        console.log('创建菜单失败!:'+body.errmsg);
      }
    });
  });
  req.write(JSON.stringify(menuJson));
  req.end();
  req.on('error', function(e) {
    console.error(e);
  });
}

WechatCore.prototype.parse = messageEnging.parse;

WechatCore.prototype.build = messageEnging.build;

WechatCore.prototype.sendCustomServiceMsg = messageEnging.sendCustomServiceMsg;

WechatCore.prototype.on = messageEnging.on;

WechatCore.prototype.once = messageEnging.once;

WechatCore.prototype.requestUserInfo = userInfoService.requestUserInfo;

WechatCore.prototype.oAuthAccessTokenRequest = function*(code){
  return yield this.accessTokenService.oAuthRequest(code);
}

module.exports = WechatCore;

process.on('exit',function(){

})