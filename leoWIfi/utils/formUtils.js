/**
 * Created by Daniels on 5/7/15.
 */

var formidable  = require('formidable');
var config      = require('../profile/config');
var fs          = require('fs');

exports.createFormidable = function(){
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = config.uploadFileTmpDir;
    form.maxFieldsSize = config.uploadFileSize;
    form.type = true;
    return form;
};

exports.clearTmpFile = function(path, cb){
    if(!cb) cb = function(){};
    if(!path) {
        cb(new Error('Not found file or path file is invalid'));
        return false;
    }
    return fs.unlink(path, cb);
};