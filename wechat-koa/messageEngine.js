/**
 * Created by sunharuka on 14-7-31.
 */
var xml2js=require("xml2js");
var https = require("https");
var EventEmitter = require('events').EventEmitter;
var parser = new xml2js.Parser({explicitRoot:false});
var sendMsgTmpl = require('./sendMsgTmpl');
var event = new EventEmitter();
var MES_TYPE = 'MsgType';
var EVENT_TYPE = 'Event';
function parseMessage(data,fn,scope){

  parser.addListener('end', function(result) {
    var err = null;
    if(result){
      var obj = {};
      for(var item in result){
        obj[item] = result[item][0];
      }
    }else{
      err = new Error();
      err.code = 101;
      err.message = "解析消息失败";
    }
    if(fn){
      scope = scope?scope:this;
      fn.apply(scope,obj);
    }

    if(obj[MES_TYPE]!='event'){
      //emit Msg event .eg textMsg imageMsg
      event.emit(obj[MES_TYPE]+'Msg',err,obj);
    }else{
      //emit event .eg subscribeEvent LOCATIONEvent
      event.emit(obj[EVENT_TYPE]+'Event',err,obj);
    }
  });
  parser.parseString(data);
}

function buildMessage(data){
    return sendMsgTmpl.renderMsg(data);
}

function sendCustomServiceMsg(accessToken,msg){
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: '/cgi-bin/message/custom/send?access_token='+accessToken,
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
  req.write(msg);
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}

function on(eventName,fn){
  event.on(eventName,fn);
}

exports.parse = parseMessage;
exports.build = buildMessage;
exports.sendCustomServiceMsg = sendCustomServiceMsg;
exports.on = on;