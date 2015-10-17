/**
 * Created by Jason on 2015/4/16.
 */

var crypto = require('crypto');
var promise = require('bluebird');
var request = require('request');
var requestp = promise.promisify(request);
//var pmongo = require('promised-mongo');
var error = require('../utils/error');


//var mongodbUrl = "mongodb://127.0.0.1:27017/yuan";
//var db = pmongo(mongodbUrl);

var url = "http://test.komovie.cn/api_movie/service?";
var key = "mq3CwYZL";
var actions = {
    "city_Query": "city_Query",           // 获得城市列表
    "cinema_Channel": "cinema_Channel",   // 获取渠道支持的影院
    "cinema_Query": "cinema_Query",       // 获取影院详细信息  cinema_id ：影院 ID
                                          // 通过城市获取影院列表  city_id ：城市 ID
    "movie_Query": "movie_Query",         // 获取影院上映的片列表  cinema_id : 影院 ID
                                          // 获取城市上映的影片列表  city_id
                                          // 获取即将上映的影片列表  coming: > 0
                                          // 获取影片详情
    "plan_Query": "plan_Query",           // 查看排期列表  cinema_id, [movie_id, begin_date, end_date]
    "seat_Query": "seat_Query",           // 查询某个场次的座位图  plan_id, [only_unavailable]
                                          // 查询影厅的座位图  hall_id, cinema_id
    "order_Add": "order_Add",             // 创建在线选座订单  mobile, seat_no([12,13,14,...]), plan_id, send_message(default ture)
    "order_Create": "order_Create",       //
    "order_Delete": "order_Delete",       // 取消订单（不删除）  order_id
    "order_Confirm": "order_Confirm",     // 确认订单  order_id, balance, [pay_method], callback_url, bank
    "order_Query": "order_Query"          // 查询单个订单详情  order_id
};


function generateEnc(param){
    var args = [];
    for(var k in param){
//        if(param[k] == undefined || param[k] == "") continue;
        var arg = {key: k, value: param[k]};
        args.push(arg);
    }
    args.sort(function(a, b){
        return a.key >= b.key ? 1 : -1;
    });

    var str = "";
    for(var i=0; i<args.length; i++){
        str += args[i].value;
    }
    str += key;
//    console.log(str);

    var enc = crypto.createHash('md5').update(str).digest('hex').toLowerCase();
//    console.log(enc);
    return enc;
}


function generateUrl(param){
    var enc = generateEnc(param);
    param.enc = enc;
    var query = "";
    for(var k in param){
        query += k+"="+param[k]+"&";
    }
    query = query.substring(0, query.length-1);
    return query;
}


function sendRequest(param, timeout){
    param.time_stamp = Date.now();
    timeout = timeout || 30000;

    var option = {
        url: url + generateUrl(param),
        headers: {channel_id: 9},
        method: "GET",
        timeout: timeout
    };
    var timeStart = new Date().getTime();
    return requestp(option)
        .then(function(res){
            console.log("request timecost: "+ (new Date().getTime() - timeStart));
            if(res[0].statusCode != 200){
                console.log("url: ", option.url);
                console.log('request result status code: ', JSON.stringify(res[0]));
                return res[1];
            }

            try{
                var result = JSON.parse(res[1]);
            }catch(e){
                throw new error.Arg(res[1]);
            }

            if(!result.status || result.status != 0){
                console.log("url: ", option.url);
                console.log('error: ', JSON.stringify(result.error));
                throw new error.Arg(result);
            }
//            result.url = option.url;
            return result;
        })
        .catch(function(err){
            console.log("url: ", option.url);
            console.log('error: ', JSON.stringify(err));
//            return err;
            throw new error.Arg(err);
        })
}


/**
 * 查询某个场次的座位图
 */
var getSeatsByPlanId = function(plan_id, only_unavailable){
    var action = actions.seat_Query;
    only_unavailable = only_unavailable || false;
    return sendRequest({action: action, plan_id: plan_id, only_unavailable: only_unavailable})
        .then(function(r){
            return r;
        })
}

/**
 * 查询影厅的座位图
 */
function getSeatsByHallId(hall_id, cinema_id){
    var action = actions.seat_Query;
    return sendRequest({action: action, hall_id: hall_id, cinema_id: cinema_id})
        .then(function(result){
//            console.log('Seats in hall: ', JSON.stringify(result));
            return result;
        })
}

/**
 * 创建在线选座订单
 * @mobile 手机号码
 * @seat_no 座位 id, 英文逗号分隔
 * @plan_id 场次 ID
 * @send_message 是否需要抠电影发送验证码，默认需要
 */
function createOrder(mobile, seat_no, plan_id, send_message){
    var action = actions.order_Add;
    return sendRequest({action: action, mobile: mobile, seat_no: seat_no, plan_id: plan_id})
        .then(function(result){
//            console.log('order status: ', result.order.orderStatus, ', amount: ', result.order.money);
            return result;
        })
}

/**
 * 确认订单
 * @order_id 订单id
 */
function confirmOrder(order_id, balance, pay_method, callback_url, bank){
    var action = actions.order_Confirm;
    return sendRequest({action: action, order_id: order_id, balance: balance, pay_method: pay_method, callback_url: callback_url, bank: bank})
        .then(function(result){
            console.log('confirm order: ', JSON.stringify(result));
            return result;
        })
}

/**
 * 取消订单
 * @order_id 订单id
 */
function cancelOrder(order_id){
    var action = actions.order_Delete;
    return sendRequest({action: action, order_id: order_id})
        .then(function(result){
            console.log('cancel order: ', JSON.stringify(result));
            return result;
        })
}

/**
 * 查询订单
 * @order_id 订单id
 */
function getOrder(order_id){
    var action = actions.order_Query;
    return sendRequest({action: action, order_id: order_id})
        .then(function(result){
            console.log('get order: ', JSON.stringify(result.orders));
            return result;
        })
}


module.exports = {
    sendRequest: sendRequest,
    actions: actions,

    getSeatsByPlanId: getSeatsByPlanId,
    getSeatsByHallId: getSeatsByHallId,
    createOrder: createOrder,
    confirmOrder: confirmOrder,
    cancelOrder: cancelOrder,
    getOrder: getOrder
};