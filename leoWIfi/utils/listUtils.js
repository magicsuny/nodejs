/**
 * Created by zhaohailong on 5/14/15.
 */
var _ = require('underscore');
var URL = require('url');
var QS = require('querystring');

/**
 * 生成时间分页返回结果
 * @param options
 */
exports.paginateList = function (dataList, req) {

    if(!dataList || dataList.length == 0){
        return {err:0, msg:'', data:[]};
    }

    var endTime   = new Date(dataList[0].createdAt).getTime();
    var startTime = new Date(dataList[dataList.length - 1].createdAt).getTime();

    try{
        var urlObj = URL.parse(req.originalUrl, true);

        var prev = _.extend(_.clone(urlObj.query), {startTime:startTime});
        var next = _.extend(_.clone(urlObj.query), {endTime:endTime});

        var prevUrl = [urlObj.pathname, QS.stringify(prev)].join('?');
        var nextUrl = [urlObj.pathname, QS.stringify(next)].join('?');

        return {
            err:'0',
            data:dataList,
            prev:prevUrl,
            next:nextUrl
        }
    }catch(err){
        return {err:1, msg:err.toString()};
    }

};