/**
 * Created by sunharuka on 15/10/31.
 */
exports.mongoDebugMode = true;//稳定后去除
exports.posterBaseUrl = 'http:\/\/106.187.49.16:3000/wifi/v1/hotspot/poster/';//s3地址 需修改逻辑
exports.mongoDbConfig = {
    url    : 'mongodb://localhost:27017/leowifi',
    options: {
        db    : {native_parser: true},
        server: {
            poolSize      : 5,
            auto_reconnect: true,
            socketOptions : {
                keepAlive: 1
            }
        },
        //replset: { rs_name: 'myReplicaSetName' },
        user  : 'root',
        pass  : ''
    }
};
exports.AvatarS3BuketName = 'leowifi.avatar.production';