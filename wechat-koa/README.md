# wechat-koa

基于生成器开发的微信公众平台组件，用于koa框架

## Installation

```
$ npm install wechat-koa
```

## Example

初始化对象


```
var WechatKoa = require('wechat-koa');
var wechatKoa = new WechatKoa({
  store: {type: 'mongo',url:'mongodb://127.0.0.1:27017/db'},
  appId: 'your appId',
  appSecret: 'your appSecret',
  token: 'your appToken'
});
```


微信验证方法


```
function* signature() {
    if (this.req.url) {
      var echostr = wechatKoa.checkSignature(this.req.url)
      if (echostr) {
        this.body = echostr;
      } else {
        this.status = 500;
        this.body = "Bad Token!";
      }
    }
  }
```

消息解析回复

```
function* onWechatMsg(){
	var msg = yield wechatKoa.parse(postQuery);
	var responesMsg = {
      "toUserName":msg.FromUserName,
      "fromUserName":msg.ToUserName,
      "createTime":new Date().toTimeString(),
      "msgType":"text",
      "content":"reponse text"
    };
     this.type = 'application/xml'
    this.body = wechatKoa.build(responesMsg);
}
```

# License

  MIT