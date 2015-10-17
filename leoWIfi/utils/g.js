/**
 * Created by ianl on 7/7/15.
 */

var statdCnf   = require('../profile/config').statd;
var os         = require('os');
var onFinished = require('on-finished');


var client = new StatD(statdCnf);

module.exports = function (req, res, next) {
    onFinished(res,
        function (err, res) {
            if (req.profile &&
                (req.profile.path.indexOf('/a') < 0 || req.profile.path.indexOf('/console') < 0)) {
                var profile   = req.profile;
                var isFailure = req.failure;
                var hostName  = os.hostname();
                hostName      = hostName.replace(/\./g, '_');
                var path      = profile.path;
                var method    = profile.method;
                var key       = isFailure ? '_api_failure_' : '_api_success_';
                client.increment([hostName + '_api',
                    hostName + key,
                    hostName + key + method + '_' + path
                ]);

                var cur = Date.now();
                client.timing(hostName + '_resp', cur - req._startTime);
                client.timing(hostName + key + method + '_' + path, cur - req._startTime);
            }
        }
    );

    return next();
};
