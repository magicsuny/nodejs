/**
 * Created by liang on 15-11-10.
 */
var express   = require('express');
var router    = express.Router();
var request   = require('request');
var config    = require('../profile/config');
var _         = require('underscore');
var error     = require('../utils/error');
var errorCode = require('../profile/config').errorCode;
var hashUtils = require('../utils/hashUtils');

router.use('/*', function (req, res, next) {
    parseToken(req,res,next);
});

function parseToken(req,res,next) {
    var token = req.headers['token'] || req.query['token'],
        tokens,
        user;

    if (!token) return next(new error.Auth('no token found in request header.'));

    tokens = token.trim().split(':');

    if(tokens.length < 3){
        return next(new error.Auth('invalid token'));
    }

    var hash = tokens[tokens.length - 1],
        guid = tokens[0],
        time = tokens[1],
        privateKey = config.tokenPrivateKey,
        expiredTime= config.tokenTimesout;

    if(hashUtils.checksum(guid+time+privateKey) != hash){
        return next(new error.Auth('invaild token'));
    }

    if(expiredTime + expiredTime < (new Date()).getTime()){
        return next(new error.Auth('token expired'));
    }

    next();
}

module.exports = {
    router         : router
};