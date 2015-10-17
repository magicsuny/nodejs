/**
 * Created by Daniels on 5/11/15.
 */

exports.defendCallback = function(cb){
    if(_.isFunction(cb)) return cb;
    return new Function();
};