/**
 * Created by sunyao on 2017/3/13.
 */
const assert = require('assert');

module.exports = Limiter;
let timeouts      = {};
let storage       = {};
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
    let id = opts.id;
    let db = opts.db;
    let maxInInterval = opts.maxInInterval;
    let interval      = opts.interval;
    let key           = 'limiter:sets:' + id;
    assert(id, '.id required');
    assert(maxInInterval, '.maxInInterval required');
    assert(interval, '.interval required');

    var now   = Date.now();
    var start = now - interval * 1000;
    return new Promise((resolve, reject) => {
        if (db) {
            db.multi()
                .zremrangebyscore(key, now, start)//clear expired data
                .zrange(key, 0, -1)
                .zadd(key, now, now)
                .expire(key, interval)
                .exec((err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    let count                = result[1].length;
                    let timeSinceLastRequest = Array.isArray(result[1]) && result[1].length > 0 ? now - result[1][result[1].length - 1] : 0;
                    let remaining            = (maxInInterval - count) < 0 ? -1 : maxInInterval - count;
                    let reset                = Array.isArray(result[1]) && result[1].length > 0 ? parseInt(result[1][0]) + interval * 1000 : now + interval * 1000;
                    return resolve({
                        remaining           : remaining,
                        timeSinceLastRequest: timeSinceLastRequest,
                        reset               : reset
                    });
                });
        } else {
            clearTimeout(timeouts[id]);
            let dataSet = storage[id] = (storage[id] || []).filter((timestamp) => {
                return timestamp > start;
            });
            let count                = dataSet.length;
            let timeSinceLastRequest = Array.isArray(dataSet) && dataSet.length > 0 ? now - dataSet[dataSet.length - 1] : 0;
            let remaining            = (maxInInterval - count) < 0 ? -1 : maxInInterval - count;
            let reset                = Array.isArray(dataSet) && dataSet.length > 0 ? parseInt(dataSet[0]) + interval * 1000 : now + interval * 1000;
            dataSet.push(now);
            timeouts[id] = setTimeout(() => {
                delete storage[id];
            }, interval*1000);
            resolve({
                remaining           : remaining,
                timeSinceLastRequest: timeSinceLastRequest,
                reset               : reset
            })
        }
    });
}




