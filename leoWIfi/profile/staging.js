/**
 * Created by ianl on 7/14/15.
 */
exports.cache          = {
    url : '10.10.10.90',
    port: 6679
};
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

exports.ucConfig = {
    base    : 'http://10.10.10.95/v1.5',
    check   : '/home/check',
    register: '/register',
    login   : '/login'
};

exports.payConfig = {
    base: 'http://10.10.10.95/pay',
    add : '/goods/add'
};

exports.statd = {
    host     : '10.10.10.182',
    port     : 8125,
    prefix   : 'yuan.',
    globalize: true
};

exports.vrsConfig = {
    baseUrl          : 'http://10.10.10.150',
    channelId        : 15,
    vrsVideoAPI      : '/api/albums/{{albumId}}/videos/{{videoId}}?channelId={{channelId}}',
    md5StrKeyForVideo: 'runmit600',
    publicStatic     : "ceto.d3dstore.com"
};