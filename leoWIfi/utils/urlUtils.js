/**
 * Created by william on 15-7-6.
 */

var crypto = require('crypto');

exports.createProxyURL = function(urlPattern, options){
    if(!options ) return urlPattern;

    for(var key in options){
        var keyPattern = ['{{',key,'}}'].join('');
        urlPattern = urlPattern.replace(keyPattern, options[key]);
    }

    return urlPattern;
};

exports.createMd5Key = function(args){
    /*
     *@args          all the params and it must be an array
     * */
    if (!Array.isArray(args)) return false;
    var md5 = crypto.createHash('md5');
    var str = '';
    for (var i = 0, len = args.length; i < len; i++){
        str += args[i];
    };
    md5.update(str);
    return md5.digest('hex');
};
