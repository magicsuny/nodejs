var util = require('util');
var errorCode = require('../profile/config').errorCode;
var assert = require('assert');

exports.HTTP_STATUS = httpStatus = {
    OK            : 200,
    BAD_REQUEST   : 400,
    UNAUTHORIZED  : 401,
    FORBIDDEN     : 403,
    NOT_FOUND     : 404,
    INTERNAL_ERROR: 500
};

Error.extend = function (typeName, errCode, status) {
    assert(typeName, 'typeName is required');

    var SubType = function (msg) {
        if (msg instanceof SubType) {
            return msg;
        }
        this.typeName = typeName;
        this.msg = msg || '';
        this.code = errCode || errorCode.unknownError;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    };

    util.inherits(SubType, this);
    SubType.prototype.toString = function () {
        return this.typeName + ':' + this.msg;
    };

    SubType.extend = this.extend;
    return SubType;
};


exports.NotFound = Error.extend('NotFound', errorCode.notfoudError, httpStatus.NOT_FOUND);
exports.Arg = Error.extend('BadRequest', errorCode.paramsError, httpStatus.OK);
exports.Header = Error.extend('BadRequest', errorCode.headerError, httpStatus.OK);
exports.Auth = Error.extend('Unauthorized', errorCode.authError, httpStatus.OK);
exports.Login = Error.extend('Forbidden', errorCode.authError, httpStatus.OK);
exports.Server = Error.extend('InternalError', errorCode.unknownError, httpStatus.OK);
exports.Upload = Error.extend('UploadError', errorCode.uploadedError, httpStatus.OK);


//Application Error
function createAppError(settings) {
    return ( new AppError(settings, createAppError) );
}

function AppError(settings, implementationContext) {
    settings = ( settings || {} );
    this.name = ( settings.name || "AppError" );
    this.type = ( settings.type || "Application" );
    this.message = ( settings.message || "An error occurred." );
    this.detail = ( settings.detail || "" );
    this.extendedInfo = ( settings.extendedInfo || "" );
    this.errorCode = ( settings.errorCode || "" );

    this.isAppError = true;
    Error.captureStackTrace(this, ( implementationContext || AppError ));

}
util.inherits(AppError, Error);

exports.AppError = AppError;
exports.createAppError = createAppError;

//example
/*var throwError = function(){
 throw createAppError({
 name: 'Error Test',
 type: 'JSON.parse',
 message: 'Using JSON.parse to convert string to json',
 detail: 'illegal strings ',
 errorCode: 1000
 });
 };
 try{
 throwError();
 }catch(error){
 console.log( error.stack );
 console.log( "Type: " + error.type );
 console.log( "Message: " + error.message );
 console.log( "Detail: " + error.detail );
 console.log( "Extended Info: " + error.extendedInfo );
 console.log( "Error Code: " + error.errorCode );

 };*/
