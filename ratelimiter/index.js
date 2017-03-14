/**
 * Created by sunyao on 2017/3/13.
 */
const assert    = require('assert');
const microtime = require("microtime-nodejs");
module.exports  = Limiter;
let timeouts    = {};
let storage     = {};
/**
 *
 * @param opts
 * @param opts.id
 * @param opts.db
 * @param opts.maxPerSecond
 * @constructor
 */
function Limiter(opts) {
    let id           = opts.id;
    let db           = opts.db;
    let maxPerSecond = opts.maxPerSecond;
    let interval     = 1;
    let key          = 'limiter:sets:' + id;
    assert(id, '.id required');
    assert(maxPerSecond, '.maxPerSecond required');

    let now   = microtime.now();
    let start = now - interval * 1000000;
    return new Promise((resolve, reject) => {
        if (db) {
            db.multi()
                .zremrangebyscore(key, 0, start)//clear expired data
                .zrange(key, 0, -1)
                .zadd(key, now, now)
                .expire(key, interval)
                .exec(function (err, result) {
                    if (err) {
                        return reject(err);
                    }
                    let sets                       = result[1];
                    let count                      = sets.length;
                    let millionsecSinceLastRequest = Array.isArray(sets) && sets.length > 0 ? (now - sets[sets.length - 1]) / 1000 : 0;
                    let remainTimes                = (maxPerSecond - count) < 0 ? -1 : maxPerSecond - count;
                    let isOutOfLimit               = maxPerSecond <= count;
                    let resetAt                    = Array.isArray(sets) && sets.length > 0 ? parseInt(sets[0]) + interval * 1000000 : now + interval * 1000000;
                    return resolve({
                        isOutOfLimit: isOutOfLimit,
                        details     : {
                            resetAt                   : Math.ceil(resetAt/1000),
                            remainTimes               : remainTimes,
                            millionsecSinceLastRequest: millionsecSinceLastRequest
                        }
                    });
                });
        } else {
            clearTimeout(timeouts[id]);
            let dataSet = storage[id] = (storage[id] || []).filter((timestamp) => {
                return timestamp > start;
            });
            let count                      = dataSet.length;
            let millionsecSinceLastRequest = Array.isArray(dataSet) && dataSet.length > 0 ? (now - dataSet[dataSet.length - 1]) / 1000 : 0;
            let remainTimes                = (maxPerSecond - count) < 0 ? -1 : maxPerSecond - count;
            let isOutOfLimit               = maxPerSecond <= count;
            let resetAt                    = Array.isArray(dataSet) && dataSet.length > 0 ? parseInt(dataSet[0]) + interval * 1000000 : now + interval * 1000000;
            dataSet.push(now);
            timeouts[id] = setTimeout(() => {
                delete storage[id];
            }, interval * 1000);
            resolve({
                isOutOfLimit: isOutOfLimit,
                details     : {
                    resetAt                   : Math.ceil(resetAt/1000),
                    remainTimes               : remainTimes,
                    millionsecSinceLastRequest: millionsecSinceLastRequest
                }
            })
        }
    });
}




