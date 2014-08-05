/**
 * Created by sunharuka on 14-7-31.
 */
exports.renderMsg = function (msg) {
  var msgTmpl = {
    text: '<xml>' +
      '<ToUserName><![CDATA['+msg.toUserName+']]></ToUserName>' +
      '<FromUserName><![CDATA['+msg.fromUserName+']]></FromUserName>' +
      '<CreateTime>'+msg.createTime+'</CreateTime>' +
      '<MsgType><![CDATA[text]]></MsgType>' +
      '<Content><![CDATA['+msg.content+']]></Content>' +
      '</xml>',
    image: '<xml>' +
      '<ToUserName><![CDATA['+msg.toUserName+']]></ToUserName>' +
      '<FromUserName><![CDATA['+msg.fromUserName+']]></FromUserName>' +
      '<CreateTime>'+msg.createTime+'</CreateTime>' +
      '<MsgType><![CDATA[image]]></MsgType>' +
      '<Image>' +
      '<MediaId><![CDATA['+msg.mediaId+']]></MediaId>' +
      '</Image>' +
      '</xml>',
    voice: '<xml>' +
      '<ToUserName><![CDATA['+msg.toUserName+']]></ToUserName>' +
      '<FromUserName><![CDATA['+msg.fromUserName+']]></FromUserName>' +
      '<CreateTime>'+msg.createTime+'</CreateTime>' +
      '<MsgType><![CDATA[voice]]></MsgType>' +
      '<Voice>' +
      '<MediaId><![CDATA['+msg.mediaId+']]></MediaId>' +
      '</Voice>' +
      '</xml>',
    video: '<xml>' +
      '<ToUserName><![CDATA['+msg.toUserName+']]></ToUserName>' +
      '<FromUserName><![CDATA['+msg.fromUserName+']]></FromUserName>' +
      '<CreateTime>'+msg.createTime+'</CreateTime>' +
      '<MsgType><![CDATA[video]]></MsgType>' +
      '<Video>' +
      '<MediaId><![CDATA['+msg.mediaId+']]></MediaId>' +
      '<ThumbMediaId><![CDATA['+msg.thumbMediaId+']]></ThumbMediaId>' +
      '</Video>' +
      '</xml>',
    music: '<xml>' +
      '<ToUserName><![CDATA['+msg.toUserName+']]></ToUserName>' +
      '<FromUserName><![CDATA['+msg.fromUserName+']]></FromUserName>' +
      '<CreateTime>'+msg.createTime+'</CreateTime>' +
      '<MsgType><![CDATA[music]]></MsgType>' +
      '<Music>' +
      '<Title><![CDATA['+msg.title+']]></Title>' +
      '<Description><![CDATA['+msg.description+']]></Description>' +
      '<MusicUrl><![CDATA[{MusicUrl}]]></MusicUrl>' +
      '<HQMusicUrl><![CDATA[{HQMusicUrl}]]></HQMusicUrl>' +
      '<ThumbMediaId><![CDATA['+msg.thumbMediaId+']]></ThumbMediaId>' +
      '</Music>' +
      '</xml>',
    news: '<xml>' +
      '<ToUserName><![CDATA['+msg.toUserName+']]></ToUserName>' +
      '<FromUserName><![CDATA['+msg.fromUserName+']]></FromUserName>' +
      '<CreateTime>'+msg.createTime+'</CreateTime>' +
      '<MsgType><![CDATA[news]]></MsgType>' +
      '<ArticleCount>'+msg.articleCount+'</ArticleCount>' +
      '<Articles>' +
      msg.item +
      '</Articles>' +
      '</xml>',
    item: '<item>' +
      '<Title><![CDATA['+msg.title+']]></Title>' +
      '<Description><![CDATA['+msg.description+']]></Description>' +
      '<PicUrl><![CDATA['+msg.picUrl+']]></PicUrl>' +
      '<Url><![CDATA['+msg.url+']]></Url>' +
      '</item>'
  };
  return msgTmpl[msg.msgType];
};

