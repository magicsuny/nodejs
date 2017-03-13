/**
 * Created by sunyao on 2017/3/13.
 */
const redis  = require('redis');
const assert = require('assert');

module.exports = Limiter;

/**
 *
 * @param opts
 * @param opts.id
 * @param opts.db
 * @param opts.interval
 * @param opts.maxInInterval
 * @constructor
 */
function Limiter(opts) {
    this.id = opts.id;
    this.db = opts.db;

    //assert(this.db, '.db required');
    this.timeouts      = {};
    this.storage       = {};
    this.maxInInterval = opts.maxInInterval;
    this.interval      = opts.interval;
    this.key           = 'limiter:sets:' + this.id;
    assert(this.id, '.id required');
    assert(this.maxInInterval, '.maxInInterval required');
    assert(this.interval, '.interval required');
}

Limiter.prototype.info = function () {
    var now   = Date.now();
    var start = now - this.interval * 1000;
    return new Promise((resolve, reject) => {
        if (this.db) {
            this.db.multi()
                .zremrangebyscore(this.key, now, start)//clear expired data
                .zrange(this.key, 0, -1)
                .zadd(this.key, now, now)
                .expire(this.key, this.interval)
                .exec((err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    let count                = result[1].length;
                    let timeSinceLastRequest = Array.isArray(result[1]) && result[1].length > 0 ? now - result[1][result[1].length - 1] : 0;
                    let remaining            = (this.maxInInterval - count) < 0 ? -1 : this.maxInInterval - count;
                    let reset                = Array.isArray(result[1]) && result[1].length > 0 ? parseInt(result[1][0]) + this.interval * 1000 : now + this.interval * 1000;
                    return resolve({
                        remaining           : remaining,
                        timeSinceLastRequest: timeSinceLastRequest,
                        reset               : reset
                    });
                });
        } else {
            clearTimeout(this.timeouts[this.id]);
            let dataSet = this.storage[this.id] = (this.storage[this.id] || []).filter((timestamp) => {
                return timestamp > start;
            });
            let count                = dataSet.length;
            let timeSinceLastRequest = Array.isArray(dataSet) && dataSet.length > 0 ? now - dataSet[dataSet.length - 1] : 0;
            let remaining            = (this.maxInInterval - count) < 0 ? -1 : this.maxInInterval - count;
            let reset                = Array.isArray(dataSet) && dataSet.length > 0 ? parseInt(dataSet[0]) + this.interval * 1000 : now + this.interval * 1000;
            dataSet.push(now);
            this.timeouts[this.id] = setTimeout(() => {
                delete this.storage[this.id];
            }, this.interval);
            resolve({
                remaining           : remaining,
                timeSinceLastRequest: timeSinceLastRequest,
                reset               : reset
            })
        }
    });
}



