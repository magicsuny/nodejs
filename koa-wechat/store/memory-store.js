/**
 * Created by sunharuka on 14-8-4.
 */

/**
 * @param db {Object} MongoDB db object.
 * @param options {Object} connection options.
 * @constructor
 */
var MemoryStore = function() {
  this._data = {};
};


/**
 * Load data for given id.
 * @param sid {String} session id.
 * @return {String} data.
 */
MemoryStore.prototype.load = function*(sid) {
  var data = this._data[sid];
  if (data&&data.blob) {
    return data.blob;
  } else {
    return null;
  }
};


/**
 * Save data for given id.
 * @param sid {String} session id.
 * @param blob {String} data to save.
 */
MemoryStore.prototype.save = function*(sid, blob) {
  var data = {
    blob: blob,
    updatedAt: new Date()
  };

  return this._data[sid] = data;
};


/**
 * Remove data for given id.
 * @param sid {String} session id.
 */
MemoryStore.prototype.remove = function*(sid) {
  var data = this._data[sid];
  this._data[sid] = null;
  return data;
};

exports.create = function(){
  return new MemoryStore();
}