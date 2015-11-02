/**
 * Created by sunharuka on 15/11/1.
 */

var aws = require('aws-sdk');
var config = require('../profile/config');
aws.config.loadFromPath(__dirname+'/../profile/AwsConfig.json');
var s3 = new aws.S3();
var fs = require('fs');
/**
 * 上传文件
 * @param remoteFilename
 * @param fileName
 */
exports.uploadFile = function(remoteFilename, fileName,mimeType,cb) {
    //var fileBuffer = fs.readFileSync(fileName);
    var metaData = getContentTypeByFile(fileName);
    fs.stat(fileName, function(err, file_info) {
        var bodyStream = fs.createReadStream( fileName );

        var options = {
            ACL: 'public-read',
            Bucket    : config.AvatarS3BuketName,
            Key    : remoteFilename,
            ContentType : mimeType,
            Body          : bodyStream
        };

        s3.putObject(options, function(err, data) {
            log.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
            cb(err,data);
        });
    });
};

/**
 * 下载文件
 * @param ObjectName
 * @param cb
 */
exports.streamingDownload = function(ObjectName,cb){
    s3.getObject({
        Bucket:config.AvatarS3BuketName,
        Key:ObjectName
    },cb);
};


function getContentTypeByFile(fileName) {
    var rc = 'application/octet-stream';
    var fileNameLowerCase = fileName.toLowerCase();

    if (fileNameLowerCase.indexOf('.html') >= 0) rc = 'text/html';
    else if (fileNameLowerCase.indexOf('.css') >= 0) rc = 'text/css';
    else if (fileNameLowerCase.indexOf('.json') >= 0) rc = 'application/json';
    else if (fileNameLowerCase.indexOf('.js') >= 0) rc = 'application/x-javascript';
    else if (fileNameLowerCase.indexOf('.png') >= 0) rc = 'image/png';
    else if (fileNameLowerCase.indexOf('.jpg') >= 0) rc = 'image/jpg';

    return rc;
}

/**
 * 获取文件列表
 * @param path
 * @returns {Array}
 */
exports.getFileList = function(path) {
    var i, fileInfo, filesFound;
    var fileList = [];

    filesFound = fs.readdirSync(path);
    for (i = 0; i < filesFound.length; i++) {
        fileInfo = fs.lstatSync(path + filesFound[i]);
        if (fileInfo.isFile()) fileList.push(filesFound[i]);
    }

    return fileList;
}


function createBucket(bucketName) {
    s3.createBucket({Bucket: bucketName}, function() {
        console.log('created the bucket[' + bucketName + ']')
        console.log(arguments);
    });
}

