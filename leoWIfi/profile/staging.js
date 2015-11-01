
exports.mongoDebugMode = false;
exports.mongoDbConfig  = {
    url    : 'mongodb://10.10.10.193:27017/yuan',
    options: {
        db    : {native_parser: true},
        server: {
            poolSize      : 5,
            auto_reconnect: true,
            socketOptions : {
                keepAlive: 1
            }
        },
        user  : 'root',
        pass  : ''
    }
};
exports.AvatarS3BuketName = 'leowifi.avatars.staging';