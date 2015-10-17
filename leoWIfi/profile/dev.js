/**
 * Created by ianl on 5/21/15.
 */
exports.mongoDbConfig = {
    url    : 'mongodb://192.168.20.204:27017/yuan',
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

exports.mongoDebugMode = true;