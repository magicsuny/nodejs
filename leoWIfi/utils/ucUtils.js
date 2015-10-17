/**
 * Created by zhaohailong on 5/13/15.
 */


//Connect to UC somehow
exports.getUserInfo = function(userId, cb){

    cb(null, {
        userid  : userId,
        name: 'testUserName'+userId,
        avatar  : 'https://ss0.baidu.com/8_1ZdTmk2RIF8t7jm9iCKT-xh_/data2/pic/115828410/115828410.jpg'
     });

};


