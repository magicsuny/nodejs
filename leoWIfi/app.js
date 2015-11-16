var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var config = require('./profile/config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require('fs');
global._ = require('underscore');
require('./utils/encoder');
var os = require('os');

var cm = require('./routes/common');
var wifi = require('./routes/wifi');
var configuration = require('./routes/configuration');
var testApi = require('./routes/testApi');

var docs = require('./routes/doc');
var error = require('./utils/error');
var util = require('util');
var validate = require('./utils/validate');
var errorCode = require('./profile/config').errorCode;

var auth = require('./routes/auth');

var base = express();
var app = express();
var v1 = express();
var v2 = express();

// view engine setup
base.set('views', path.join(__dirname, 'views'));
base.set('view engine', 'html');
base.set('trust proxy', config.trustProxy);
//base.engine('html', require('ejs').renderFile);
base.use(morgan('dev'));
base.use(bodyParser.text({type:'text/plain'}));
base.use(bodyParser.json({type:'application/json'}));
base.use(bodyParser.urlencoded({extended: false}));
base.use(cookieParser());

//set appId
base.use('/wifi', app);

app.use('/', express.static(path.join(__dirname, 'public'), {
    'setHeaders': function (res, path, stat) {
        if (path.indexOf('.json') > 0) {
            console.log('path:', path);
            res.setHeader("Content-Type", "application/json; charset=utf-8");
        }
    }
}));
//app.use(cm.sessionSetting);
app.use(compression({threshold: 512}));
//app.use(favicon('public/img/logo.png'));
app.use('/heartbeat',function(req,res,next){
   res.send('ok');
});
app.use('/v1', v1);
app.use('/v2', v2);
//v1.use(cm.gatherDeviceInfo);                    //暂时只在需要收集的API上设置中间件
v1.use(auth.router);                              //暂时关闭，客户端完成后开始联调
v1.use('/docs', docs(wifi,configuration,testApi));
v1.use(wifi.router);
v1.use(configuration.router);
v1.use(testApi.router);
v1.use(function (req, res, next) {
    res.set('X-Powered-By','Leomaster');
    if (res.body) {
        return res.send({
            code : 0,
            msg : '',
            data: res.body
        });
    }
    next();
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(new error.NotFound(util.format('%s not found', req.path)));
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 200);
        req.failure = true;
        err.stack = err.stack;
        var result = {
            code : err.code || errorCode.unknownError,
            msg  : err.msg || err.message,
            data : [],
            stack: err.stack
        };
        res.json(result);
        console.error(result);
        // res.json(err);
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.error(err);
    req.failure = true;
    res.status(err.status || 200);
    res.json({
        code: err.code || errorCode.unknownError,
        msg : err.msg || err.err,
        data: []
    });
});

//
//var versions = {
//    '1': v1,
//    '2': v2
//};
//
//
//function validateProfile(p) {
//    return p.hasOwnProperty('path') && p.hasOwnProperty('version') &&
//        p.hasOwnProperty('handler') && p.hasOwnProperty('method');
//}
//
//
//function validateReq(req, res, next) {
//    console.log('validate request');
//    next();
//}

//
//function loadProfile(p) {
//    if (!validateProfile(p)) {
//        return false;
//    }
//    var path    = p.path,
//        handler = p.handler,
//        method  = p.method;
//    //v       = p.version;
//    //if (v && versions.hasOwnProperty(v)) {
//    var vApp = v1;
//
//    if (!Array.isArray(handler)) {
//        return false;
//    } else {
//        var vFct = validate;
//        if (p.hasOwnProperty('validate') && typeof p['validate'] === 'function') {
//            //validate must be a middleware
//            vFct = p['validate'];
//        }
//    }
//    handler.unshift(
//        function (req, res, next) {
//            req.profile = p;
//            next();
//        },
//        vFct
//    );
////}
//
//    var m = vApp[method];
//    m.call(vApp, path, handler);
//    return true;
//}

//
//function loadRouter() {
//    var normalizedPath = require('path').join(__dirname, 'routes');
//    var routers = [];
//    require('fs').readdirSync(normalizedPath).forEach(function (f) {
//        var item = require('./routes/' + f);
//
//        if (item.hasOwnProperty('profile')) {
//            var profiles = item.profile;
//
//            if (Array.isArray(profiles)) {
//                profiles.forEach(function (profile) {
//                    var loaded = loadProfile(profile);
//                    if (!loaded) {
////                        console.warn('load profile %j in %s fail', profile, f);
//                    } else {
////                        console.info('load profile %j in %s', profile, f);
//                    }
//                });
//            } else {
////                console.warn('skip load %s, since not profile', f);
//            }
//
//            routers.push(item);
//        } else {
////            console.warn('skip load %s, since no profile found', f);
//        }
//    });
//    return routers;
//}
////var routers    = loadRouter();
////v1.use('/docs', docs.apply(v1, routers));
module.exports = base;
//end
