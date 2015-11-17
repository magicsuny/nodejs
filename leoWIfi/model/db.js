var querystring = require('querystring');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cfg = require('../profile/config');
var _ = require('underscore');
var validator = require('validator');
var error = require('../utils/error');

mongoose.connect(cfg.mongoDbConfig.url, cfg.mongoDbConfig.options);
var db = mongoose.connection;

var ObjectId = require('mongodb').ObjectID;

mongoose.set('debug', cfg.mongoDebugMode);

// When successfully connected
db.on('connected', function (err) {
    'use strict';
    log.info('Mongodb is connected');
});

// If the connection throws an error
db.on('error', function (err) {
    log.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
db.on('disconnected', function () {
    log.warn('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    db.close(function () {
        log.warn('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


function commonPlugin(schema, options) {
    //schema.add({updatedAt: Date, createdAt: Date, deleted: false});

    schema.pre('save', function (next) {
//        console.log('commonPlugin, save, isNew: ' + this.isNew);
        if (this.isNew) {
            this.createdAt = this.updatedAt = new Date;
        } else {
            this.updatedAt = new Date;
        }
        next();
    });

    schema.pre('update', function (next) {
        this.updatedAt = new Date();
        next();
    });

    schema.pre('findOneAndUpdate', function (next) {
        this.updatedAt = new Date();
        this._update.updatedAt = new Date();
        next();
    });

    schema.pre('remove', function (next) { // TODO: need testing ?
        this.deleted = true;
        next();
    })

    /*if (options && options.index) {
     schema.path('lastMod').index(options.index)
     }*/
}

function makeQueryString(obj) {
    var result = {};
    for (var k in obj) {
        if (k != '$or' && k != '$and')
            result[k] = obj[k];
    }
    return querystring.stringify(result);
}
function findAndCountAllPlugin(schema, options) {
    schema.statics.findAndCountAll =
        function (terms, start, rows, fields, sort, cb) {
            start = start || 0;
            rows = rows || 10;
            if (start < 0)
                throw new error.Arg('invalid parameter: start, should be >= 0;');
            if (rows <= 0)
                throw new error.Arg('invalid parameter: rows, should be >0;');

            terms = terms || {};
            sort = sort || {};

            return Promise.resolve(this.count(terms).exec()).bind(this)
                .then(function (count) {
                    if (count <= start) {
//                        terms.start = Math.max(start - rows, 0);
//                        terms.rows  = rows;
                        var result = Promise.resolve({
                            data  : [],
                            length: 0,
                            prev  : '', //makeQueryString(terms),
                            next  : '',
                            total : count,
                            start : start,
                            rows  : rows
                        });

                        result.prev = makeQueryString(terms);
                        return cb ? result.nodeify(cb) : result;
                    }

                    var m = mongoose.model(schema.options.collection, schema);
                    return m.find(terms, fields, {sort: sort}).skip(start).limit(rows).exec()
                        .then(function (r) {
                            var nextUrl = '';
                            if (count > rows) {
                                terms.start = start + rows;
                                terms.rows = rows;
                                nextUrl = makeQueryString(terms)
                            }

                            var prevUrl = '';
                            if (start != 0) {
                                terms.start = Math.max(start - rows, 0);
                                terms.rows = rows;
                                prevUrl = makeQueryString(terms);
                            }

                            result = Promise.resolve({
                                data: r,
                                length: r.length,
                                prev: prevUrl,
                                next: nextUrl,
                                total: count,
                                start: start,
                                rows: rows
                            });
                            return cb ? result.nodeify(cb) : result;
                        })
                })
        }
}

/**
 * 以时间分页
 * @param condition
 * @param display
 * @param options
 * @param pagenate
 * @param cb
 * @returns {Promise.<T>}
 */
function pagenateByTimePlugin(schema, options, cb) {
    schema.statics.pagenateByTime = function (condition, display, options, pagenate, cb) {
        var startTime = pagenate.startTime ? pagenate.startTime : new Date().getTime();
        var endTime = pagenate.endTime;
        var limit = (pagenate.limit) ? pagenate.limit : cfg.DefaultRows;
        var timeCondition = {$lt: startTime};
        if (endTime) {
            timeCondition = {$gt: endTime};
        }
        _.extend(condition, {createdAt: timeCondition});
        if (!display) {
            display = {};
        }
        if (!options) {
            options = {};
            _.extend(options, {sort: {createdAt: 'desc'}});
        }
        _.extend(options, {limit: limit});
        var rtn = this.findAsync(condition, display, options);
        if (cb) {
            return rtn.nodeify(cb);
        }
        return rtn;
    };
}

/**
 * 逻辑删除
 * @param schema
 * @param options
 * @param cb
 */
function logicDeletePlugin(schema, options, cb) {
    schema.statics.logicDelete = function (condition, options) {
        if (!options) {
            options = {};
        }
        _.extend(options, {multi: true});
        var rtn = this.updateAsync(condition, {deleted: true}, options);
        if (cb) {
            return rtn.nodeify(cb);
        }
        return rtn;
    }
}

/**
 * schema 覆盖toJSON方法 去掉_id 与 __v
 * @param doc
 * @param ret
 * @param options
 */
function transformToJSON(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
}

var wifiSchema = new Schema({
    ssid           : {type: String, index: true},
    bssid          : {type: String, index: true},
    level          : Number,
    sec_level      : Number,
    capabilities   : String,
    frequency      : Number,
    password       : String,
    keyMgmt        : String,
    eap            : String,
    identity       : String,
    latitude       : Number,  // redundant
    longitude      : Number,  // redundant
    location       : {type: [Number]},
    accuracy       : Number,
    is_root        : Boolean,
    is_hotspot     : {type:Boolean,index:true},
    deviceId       : String,
    sharedable     : Boolean,
    connectable    : Boolean,
    country        : String,
    city           : String,
    ip             : String,
    poster         : {
        normal: {type: String},
        thumb : {type: String}
    },
    lastConnectedAt: Date,
    gatherTimes    : {type: Number, default: 1},          //上报次数
    other_settings : String,
    createdAt      : Date,
    updatedAt      : Date
}, {collection: 'wifis'});
wifiSchema.index({"country": 1, "bssid": 1});
wifiSchema.index({connectable: 1, sec_level: 1, bssid: 1})
wifiSchema.index({connectable: 1, sec_level: 1, ssid: 1, location: "2dsphere"});
wifiSchema.plugin(commonPlugin);
wifiSchema.plugin(findAndCountAllPlugin);
wifiSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

var deviceSchema = new Schema({
    market_id  : {type: String, index: true},
    guid       : {type: String, index: true},
    app_id     : String,
    app_ver    : String,
    os_name    : String,
    android_ver: String,
    vendor     : String,
    model      : String,
    screen_des : String,
    screen_dpi : String,
    language   : String,
    timezone   : String,
    imei       : String,
    imsi       : String,
    mac        : String,
    android_id : String
},{collection:'devices'});

deviceSchema.plugin(commonPlugin);
deviceSchema.plugin(findAndCountAllPlugin);
deviceSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};


var apiStatictisSchema = new Schema({
    deviceId : {type: String},
    type     : {type: String, index: true},
    meta     : {type: mongoose.Schema.Types.Mixed},
    createdAt: Date,
    updatedAt: Date
}, {collection: 'apiStatictis'});
apiStatictisSchema.plugin(commonPlugin);

function promisify(model) {
    Promise.promisifyAll(model);
    Promise.promisifyAll(model.collection);
    Promise.promisifyAll(model.prototype);
    return model;
}

exports.Wifi = promisify(mongoose.model('Wifi', wifiSchema));
exports.Device = promisify(mongoose.model('Device', deviceSchema));
exports.ApiStatictis = promisify(mongoose.model('ApiStatictis', apiStatictisSchema));
//end
