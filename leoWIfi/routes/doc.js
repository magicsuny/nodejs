/**
 * Created by zhaohailong on 6/3/15.
 */

var util = require('util');
var Router = require('express').Router;
var fs = require('fs');
var path = require('path');
var apiJsonPath = path.join(__dirname, '..', 'public', 'swagger', 'api.json');
var models = require('../profile/apiModel');

var apiDesc = "# 访问规则\n * DMAIN+APP_ID+API_VERSION+API_NAME ex:http://api.leomaster.com/wifi/v1/init\n * 加密方式待定\n"
    + "<pre>**header** </pre>\n";

function gen(modules, cb) {
    var root = {};
    root.swagger = '2.0';
    root.info = {
        title      : 'LeoWifi API',
        description: apiDesc,
        version    : '1.0'
    };
    root.basePath = '/wifi/v1';
    root.tags = [];
    root.schemes = ['http'];
    root.consumes = ['application/json'];
    root.produces = ['application/json'];
    root.paths = {};
    root.definitions = {};
    for (var i = 0; i < modules.length; i++) {
        var m = modules[i];
        root.tags.push(buildTag(m));
        var profiles = m.profile;
        if (profiles && profiles.length) {
            for (var j = 0; j < profiles.length; j++) {
                var p = profiles[j];
                //filter path start at /a
                if (p.path.indexOf('/a') === 0) continue;
                var path = p.path.replace(/:(\w+)/g, '{$1}');
                var doc = root.paths[path] || {};
                buildApiDoc(doc, m, p);
                root.paths[path] = doc;
            }
        }

        for (var k in models) {
            root.definitions[k] = models[k];
        }
    }

    fs.writeFile(apiJsonPath, JSON.stringify(root), cb);
}

function buildTag(m) {
    return {name: m.tag || 'default ', description: m.description || ''};
}

function buildApiDoc(doc, m, p) {
    var rtn = {
        tags       : [m.tag || 'default'],
        description: p.description || '',
        summary    : p.summary || ''
    };

    var params = buildParams1(p.params);

    if (params.length > 0) {
        rtn.parameters = params;
    }

    rtn.responses = {};
    if ('responses' in p) {
        rtn['responses'] = p.responses;
    }
    rtn.responses['x-error'] = {
        schema: {
            required: ['type'],
            type    : 'object',
            $ref    : '#/definitions/ErrorRtn'
        }
    };

    doc[p.method] = rtn;
}

function buildParams1(params) {
    var rtn = [];

    for (var k in params) {
        var data = {};
        var v = params[k] || {};
        if (!'in' in v || !'type' in v) {
            continue;
        }
        data.name = k;
        for (var j in v) {
            if (j === 'type') {
                if (v[j] && typeof v[j] !== 'string' && 'name' in v[j]) {
                    data[j] = v[j].name.toLowerCase();
                } else {
                    data[j] = 'string';
                }
            } else {
                data[j] = v[j];
            }
        }

        rtn.push(data);
    }

    return rtn;
};

module.exports = function () {
    var modules = Array.prototype.slice.call(arguments, 0);
    var r = Router();

    r.all('/', function (req, res, next) {
        var apiProfiles = [];
        for (var i = 0; i < modules.length; i++) {
            apiProfiles = apiProfiles.concat(modules[i].profile);
        }
        //res.send(ejs.render('doc.ejs', {profiles:apiProfiles}));
        res.render('doc.ejs', {profiles: apiProfiles});
    });

    r.get('/api', function (req, res, next) {
        gen(modules, function (err) {
            if (err) {
                return next(err);
            } else {
                res.json({complete: true});
            }
        });
        //    var root         = {};
        //    root.swagger     = '2.0';
        //    root.info        = {
        //        title      : '影讯API',
        //        description: apiDesc,
        //        version    : '1.0'
        //    };
        //    root.basePath    = '/v1';
        //    root.tags        = [];
        //    root.schemes     = ['http'];
        //    root.consumes    = ['application/json'];
        //    root.produces    = ['application/json'];
        //    root.paths       = {};
        //    root.definitions = {};
        //    for (var i = 0; i < modules.length; i++) {
        //        var m        = modules[i];
        //        root.tags.push(buildTag(m));
        //        var profiles = m.profile;
        //        if (profiles && profiles.length) {
        //            for (var j = 0; j < profiles.length; j++) {
        //                var p = profiles[j];
        //                //filter path start at /a
        //                if (p.path.indexOf('/a') === 0) continue;
        //                var path         = p.path.replace(/:(\w+)/g, '{$1}');
        //                var doc          = root.paths[path] || {};
        //                buildApiDoc(doc, m, p);
        //                root.paths[path] = doc;
        //            }
        //        }
        //
        //        for (var k in models) {
        //            root.definitions[k] = models[k];
        //        }
        //    }
        //
        //    var type = req.query.type;
        //
        //    if (type === 'readmine') {
        //
        //    } else {
        //        fs.writeFile(apiJsonPath, JSON.stringify(root), function (err) {
        //            if (err) return res.json(err);
        //            res.json({complete: true});
        //        })
        //    }
        //});
        //
        //function buildTag(m) {
        //    return {name: m.tag || 'default ', description: m.description || ''};
        //}
        //
        //function buildApiDoc(doc, m, p) {
        //    var rtn = {
        //        tags   : [m.tag || 'default'],
        //        summary: p.description || ''
        //    };
        //
        //    var params = buildParams1(p.params);
        //
        //    if (params.length > 0) {
        //        rtn.parameters = params;
        //    }
        //
        //    rtn.responses = {};
        //    if ('responses' in p) {
        //        rtn['responses'] = p.responses;
        //    }
        //    rtn.responses['x-error'] = {
        //        schema: {
        //            required: ['type'],
        //            type    : 'object',
        //            $ref    : '#/definitions/ErrorRtn'
        //        }
        //    };
        //
        //    doc[p.method] = rtn;
        //}
        //
        //function buildParams(params) {
        //    var p = [];
        //
        //    for (var i = 0; i < params.length; i++) {
        //        var param = params[i];
        //
        //        if ('name' in param && 'in' in param && 'type' in param) {
        //            p.push(param);
        //        }
        //    }
        //
        //    return p;
        //}
        //
        //function buildParams1(params) {
        //    var rtn = [];
        //
        //    for (var k in params) {
        //        var data = {};
        //        var v    = params[k] || {};
        //        if (!'in' in v || !'type' in v) {
        //            continue;
        //        }
        //        data.name = k;
        //        for (var j in v) {
        //            if (j === 'type') {
        //                if (v[j] && typeof v[j] !== 'string' && 'name' in v[j]) {
        //                    data[j] = v[j].name.toLowerCase();
        //                } else {
        //                    data[j] = 'string';
        //                }
        //            } else {
        //                data[j] = v[j];
        //            }
        //        }
        //
        //        rtn.push(data);
        //    }
        //
        //    return rtn;
    });

    gen(modules);
    return r;
};

