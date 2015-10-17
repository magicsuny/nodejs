/**
 * Created by ianl on 6/8/15.
 */

var validator  = require('validator');
var _f         = require('util').format;
var _          = require('underscore');
var error      = require('./error');
/**
 *
 * @param data 需要验证的值
 * @param def  验证定义对象
 * @return '' 验证通过, 'msg'失败原因
 */

module.exports = function (req, res, next) {
    if (req.profile && req.profile.params) {
        var rtn = _v(req, req.profile.params);

        if (rtn !== '') {
            return next(rtn);
        }
    }
    next();
};

function _v(req, params) {
    for (var i = 0; i < params.length; i++) {
        if (_.has(params[i], 'required') && _.has(params[i], 'in')) {
            var data;
            switch (params[i].in) {
                case 'path':
                    data = req.params;
                    break;
                case 'query':
                    data = req.query;
                    break;
                case 'body':
                    data = req.body;
                    break;
            }

            if (data) {
                if (!_.has(data, params[i].name.trim())) {
                    throw new error.Arg('required ' + params[i].name + ' in ' + params[i].in);
                }
            }
        }
    }
}

function validate(data, key, def) {
    if (def['required'] && data[key] === undefined) {
        return _f('required %s not found', key);
    }

    var obj = data[key];

    if (obj) {
        var type = def['type'];

        if (type === 'date') {
            if (!validator.isDate(obj)) {
                return _f('require %s is date, current is %j', key, obj);
            }
        }

        if (type === 'number') {
            if (!validator.isNumeric(obj)) {
                return _f('require % is number, current is %j', key, obj);
            }
        }

        if (type === 'boolean') {
            if (!validator.isBoolean(obj)) {
                return _f('require % is boolean, current is %j', key, obj);
            }
        }

        return validateOther(obj, key, def);
    }

    return '';
};


function validateOther(obj, key, def) {

    for (k in def) {
        console.log('key:%s', k);
        if (_.has(validator, k)) {
            var m      = validator[k];
            var v      = def[k];
            var result = m.call(validator, obj, v);

            if (!result) {
                return _f('required %s match %j fail, data:%j', key, def, obj);
            }
        }
    }

    return '';
}
//end