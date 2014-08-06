/**
 * Created by sunharuka on 14-8-6.
 */
var coRequest = require('co-request');
var messageEnging = require('./messageEngine');
var AccessTokenService = require('./accessTokenService');

/**
 * 请求用户信息
 * @param openId
 * @returns {*}
 */
function* requestUserInfo(openId){
  var accessToken = yield this.accessTokenService.loadAccessToken();
  var options = {
    url: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+accessToken+'&openid='+openId+'&lang=zh_CN',
    method: 'GET'
  };
  var res = yield coRequest(options);
  var response = JSON.parse(res.body);
  if(response.errcode){
    var err = new Error();
    err.code = response.errcode;
    err.message = response.errmsg;
    throw err;
  }else{
    return res;
  }
}

///**
// * 监听用户地理位置信息
// */
//messageEnging.on('LOCATIONEvent',function(err,obj){
//
//});

exports.requestUserInfo = requestUserInfo;