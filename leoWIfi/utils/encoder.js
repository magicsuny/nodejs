/*
 * Created by Daniels on 5/12/15.
 *
 * Functional  These methods will load to global object for use it immediately
 *
 * Example for
 *             > require('utils/encoder');
 *             > var bs6 = base64(md5('This string will encode to md5 & base64'));
 *             > console.log(bs6);
 *              'MTE0NDIwMzM2NTc3YmIzNzI0ZjkzYjQ0ZjQxNTFlNWM='
 *
 */
var crypto   = require('crypto');

global.md5 = function(str, output_encode){
    if(!str && !isNaN(str)) return undefined;
    return crypto.createHash('md5').update(str, 'utf8').digest(output_encode || 'hex');
};

global.sha1 = function(str, output_encode){
    if(!str && !isNaN(str)) return undefined;
    return crypto.createHash('sha1').update(str, 'utf8').digest(output_encode || 'hex');
};

global.base64 = function(str){
    if(!str && !isNaN(str)) return undefined;
    return new Buffer(str).toString('base64');
};

global.base64ToUtf8 = function(str){
    if(!str && !isNaN(str)) return undefined;
    return new Buffer(str, 'base64').toString('utf8');
};