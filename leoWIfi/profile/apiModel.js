/**
 * Created by sunharuka on 15/7/1.
 */

var errorCode = require('../profile/config').errorCode;
var _         = require('underscore');
var util      = require('util');

exports.wifiInfo = {
    type: 'object', properties: {
        ssid: {type: 'string', description: "wifi ssid"},
        bssid: {type: 'string', description: "wifi bssid"},
        level: {type: 'integer', description: "wifi bssid"},
        sec_level: {type: 'integer', description: "wifi bssid"},
        capabilities: {type: 'string', description: "wifi bssid"},
        frequency: {type: 'integer', description: "wifi bssid"},
        password: {type: 'string', description: "wifi bssid"},
        identity: {type: 'string', description: "wifi bssid"},
        keyMgmt: {type: 'string', description: "wifi bssid"},
        eap: {type: 'string', description: "wifi bssid"},
        latitude: {type: 'string', description: "wifi bssid"},
        longitude: {type: 'string', description: "wifi bssid"},
        accuracy: {type: 'string', description: "wifi bssid"},
        is_root:{type:'boolean',description: "wifi bssid"},
        other_settings:{type:'string',description:"other setting"}
    }
};

exports.simpleWifiInfo = {
    type: 'object', properties: {
        ssid: {type: 'string', description: "wifi ssid"},
        bssid: {type: 'string', description: "wifi bssid"},
        level: {type: 'integer', description: "wifi bssid"},
        sec_level: {type: 'integer', description: "wifi bssid"},
        capabilities: {type: 'string', description: "wifi bssid"},
        frequency: {type: 'integer', description: "wifi bssid"},
        identity: {type: 'string', description: "wifi bssid"},
        keyMgmt: {type: 'string', description: "wifi bssid"},
        eap: {type: 'string', description: "wifi bssid"},
    }
};




exports.Memo = {
    type: 'object', properties: {
        score: {type: 'integer', description: "comment's score"},
        user : {
            $ref: '#/definitions/User'
        }
    }
};

exports.Comment = {
    type: 'object', properties: {
        id        : {type: 'string', description: 'comment id'},
        content   : {type: 'string', description: 'content'},
        createTime: {type: 'integer'},
        replyCount: {type: 'integer', description: 'reply count'},
        enjoyCount: {type: 'integer', description: 'enjoy count'},
        userId    : {type: 'string'},
        c1        : {type: 'string', description: 'level 1 class'},
        c2        : {type: 'string', description: 'level 2 class'},
        topicId   : {type: 'string', description: 'topic id'},
        memo      : {'$ref': '#/definitions/Memo'}
    }
};

exports.commentResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code', default: 0},
        msg : {type: 'string', description: 'error message'},
        data: {$ref: '#/definitions/Comment'}
    }
};

exports.commentListResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code', default: 0},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/Comment'}
        },
        prev: {type: 'string', description: '上一个分页url'},
        next: {type: 'string', description: '下一个分页url'}
    }
};

exports.reply = {
    type: 'object', properties: {
        id        : {type: 'string', description: 'reply id'},
        content   : {type: 'string', description: 'content'},
        createTime: {type: 'integer'},
        memo      : {'$ref': '#/definitions/Memo'},
        commentId : {type: 'string', description: 'comment id'}
    }
};

exports.User = {
    type: 'object', properties: {
        userid    : {type: 'string'},
        name      : {type: 'string'},
        nickname  : {type: 'string'},
        headposter: {type: 'string', description: 'avatar url'},
        isVIP     : {type: 'boolean'},
        gender    : {
            type       : 'string',
            description: '用户性别, male:男性, female: 女性',
            enum       : ['male', 'female'],
            default    : 'male'
        }
    }
};


exports.UserListResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code'},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/User'}
        },
        prev: {type: 'string', description: '上一个分页url'},
        next: {type: 'string', description: '下一个分页url'}
    }
};

//req body object
exports.UserReq = {
    type: 'object', properties: {
        account : {type: 'string'},
        password: {type: 'string'}
    }
}

//
exports.YcyModel = {
    type: 'object', properties: {
        id              : {type: 'string', description: 'ycy id'},
        album           : {
            type: 'object', properties: {
                albumId  : {type: 'string', description: '专辑ID'},
                albumName: {type: 'string', description: '专辑名称'},
                movieId  : {type: 'string', description: '专辑关联电影ID'}
            }
        },
        title           : {type: 'string', description: '影次元名称'},
        description     : {type: 'string', description: '影次元描述'},
        author          : {
            type      : 'object',
            properties: {
                userid    : {type: 'string', description: '用户ID'},
                account   : {type: 'string', description: ''},
                name      : {type: 'string', description: '用户名'},
                nickname  : {type: 'string', description: '用户昵称'},
                headposter: {type: 'string', description: '用户头像'},
                isVIP     : {type: 'boolean', description: '是否VIP'},
                gender    : {type: 'string', description: '性别'},
                location  : {type: 'string', description: '位置'},
                address   : {type: 'string', description: '地址'},
                occupation: {type: 'string', description: '所在城市'},
                mail      : {type: 'string', description: '邮箱'},
                birthDay  : {type: 'string', format: 'date', description: '生日'}
            }
        },
        playTimes       : {type: 'integer', description: '音频播放次数'},
        comments        : {type: 'integer', description: '评论数'},
        sharedTimes     : {type: 'integer', description: '分享次数'},
        collectTimes    : {type: 'integer', description: '收藏次数'},
        likedTimes      : {type: 'integer', description: '赞数'},
        picUrl          : {type: 'string', description: '图片url'},
        voiceUrl        : {type: 'string', description: '音频url'},
        recommendByAlbum: {type: 'boolean', description: '专辑推荐'},
        pos             : {
            type       : 'array',
            items      : {type: 'number', description: '[0]为经度 [1]为纬度'},
            description: 'WG84经纬度坐标'
        },
        createdAt       : {
            type       : 'string',
            format     : 'date-time',
            description: '创建时间'
        },
        updatedAt       : {
            type       : 'string',
            format     : 'date-time',
            description: '更新时间'
        }
    }
}
//
exports.YcyListResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code'},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/YcyModel'}
        },
        prev: {type: 'string', description: '上一个分页url'},
        next: {type: 'string', description: '下一个分页url'}
    }
};

exports.Movie = {
    type      : 'object',
    properties: {
        "actor"       : {type: 'string', description: 'e.g. 黎筱濛/李佳怡/林强/张圣'},
        "director"    : {type: 'string', description: 'e.g. 马克·斯蒂文·约翰逊'},
        "hasImax"     : {type: 'boolean', description: 'true/false'},
        "intro"       : {type: 'string', description: '简介'},
        "movieLength" : {type: 'number', description: '影片时长， e.g. 80'},
        "movieName"   : {type: 'string', description: ''},
        "publishTime" : {type: 'string', description: "2015-07-03"},
        "score"       : {type: 'number', description: '8.0'},
        "status"      : {type: 'string', description: 'ONLINE|OFFLINE|COMING'},
        "highlight"   : {type: 'string', description: '一句话描述'},
        "trailers"    : {
            type       : 'array',
            description: '预告片列表',
            items      : {type: 'object'}
        },
        "createdAt"   : {
            type       : 'string',
            description: "e.g. 2015-07-02T03:22:59.514Z"
        },
        "updatedAt"   : {
            type       : 'string',
            description: "e.g. 2015-07-02T03:22:59.514Z"
        },
        "ycyCount"    : {type: 'number', description: '影次元数量'},
        "inviteCount" : {type: 'number', description: '影评数量'},
        "commentCount": {type: 'number', description: '评论数'},
        "bigPoster"   : {type: 'string', description: '大海报/首张海报'},
        "poster"   : {
            type       : 'array',
            description: '海报',
            items      : {type: 'string'}
        },
        "snapshots"   : {
            type       : 'array',
            description: '剧照列表',
            items      : {type: 'string'}
        },
        "specs"       : {
            type       : 'array',
            description: '电影特性列表',
            items      : {type: 'string'}
        },
        "analysis3DId": {type: 'string', description: '3D分析结果的id'},
        "want"        : {type: 'number', description: '想看人数'},
        "deleted"     : {type: 'boolean', description: 'true/false'},
        "published"   : {type: 'boolean', description: 'true/false'},
        "albumId"     : {type: 'string', description: '关联专辑的id'},
        "has3D"       : {type: 'boolean', description: 'true/false'},
        "has2D"       : {type: 'boolean', description: 'true/false'},
        "id"          : {
            type       : 'string',
            description: "e.g. 5594ae3b6e5db62c0bf1dd60"
        }
    }
};

exports.movieResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code', default: 0},
        msg : {type: 'string', description: 'error message'},
        data: {$ref: '#/definitions/Movie'}
    }
};

exports.movieListResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code', default: 0},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/Movie'}
        },
        prev: {type: 'string', description: '上一个分页url'},
        next: {type: 'string', description: '下一个分页url'}
    }
};

exports.Cinema = {
    type      : 'object',
    properties: {
//        banner               : {type: 'string', description: 'aaa'},
        cinemaAddress    : {type: 'string', description: '地址'},
//        cinemaId             : {type: 'number', description: ''},
        cinemaIntro      : {type: 'string', description: '简介'},
        cinemaName       : {type: 'string', description: '名称'},
        cinemaTel        : {type: 'string', description: '电话'},
        cityId           : {type: 'number', description: ''},
        cityName         : {type: 'string', description: ''},
        closeTicketTime  : {type: 'number', description: ''},
        districtId       : {type: 'number', description: ''},
        districtName     : {type: 'string', description: '地区'},
        drivePath        : {type: 'string', description: '驾车路线'},
//        foreignCinemaId      : {type: 'string', description: 'aaa'},
//        galleries            : {type: Array, default: []},
//        hot                  : {type: 'number', description: 'aaa'},
        latitude         : {type: 'string', description: ''},
        longitude        : {type: 'string', description: ''},
        distance         : {type: 'number', description: '距离，单位 米'},
//        machineType          : {type: 'number', description: ''},
        openTime         : {type: 'string', description: ''},
//        platform             : {type: 'number', description: ''},
//        ticketType           : {type: 'number', description: ''},
//        movies               : {type: Array, default: []},
//        plans          : [planSchema],
        deleted          : {type: 'boolean', description: ''},
        published        : {type: 'boolean', description: ''},
        spec             : {
            type      : 'object',
            properties: {
                id      : {type: 'string', description: ''},
                name    : {type: 'string', description: ''},
                icon    : {type: 'string', description: ''}
            }
        }, // 影院特色, id of tags(IMAX 4D 3DBOX ...)
        score            : {type: 'string', description: '评分'}, // 评分
        basicScore       : {type: 'string', description: '基础评分'}, // 基础评分
        parkInfo         : {type: 'string', description: '停车信息'}, // 停车信息
        dietInfo         : {type: 'string', description: '周边餐饮'}, // 周边餐饮
        shoppingInfo     : {type: 'string', description: '周边购物'}, // 周边购物
        entertainmentInfo: {type: 'string', description: '周边娱乐'}, // 周边娱乐
        ticketInfo       : {type: 'string', description: '福利票信息'}, // 福利票信息
        salesInfo        : {type: 'string', description: '优惠活动'}, // 优惠活动
        videoHallInfo    : {type: 'string', description: '影厅信息'}, // 影厅信息
        restAreaInfo     : {type: 'string', description: '休息区'}, // 休息区
        cinemaAreaInfo   : {type: 'string', description: '影院地区信息'},  // 影院地区信息
        commentCount     : {type: 'number', description: '评论数量'},
        like             : {type: 'number', description: ''}
//        recommendCommentCount: {type: 'number', description: ''}
    }
}

exports.cinemaResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code', default: 0},
        msg : {type: 'string', description: 'error message'},
        data: {$ref: '#/definitions/Cinema'}
    }
};

exports.cinemaListResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code', default: 0},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/Cinema'}
        },
        prev: {type: 'string', description: '上一个分页url'},
        next: {type: 'string', description: '下一个分页url'}
    }
}

exports.Plan = {
    type     : 'object',
    properties: {
        cinemaId        : {type: 'string', description: '影院id'},
        featureNo       : {type: 'string', description: ''},
        featureTime     : {type: 'string', description: ''},
        foreignCinemaId : {type: 'string', description: ''},
        hallName        : {type: 'string', description: '影厅名称'},
        hallNo          : {type: 'string', description: '影厅编号'},
        language        : {type: 'string', description: ''},
        movieId         : {type: 'string', description: '影片id'},
        planId          : {type: 'string', description: '排期id'},
        platform        : {type: 'string', description: ''},
        price           : {type: 'string', description: '影片定价'},
        screenType      : {
            type: 'string',
            description: '',
            enum       : ['2D', '3D']},
        standardPrice   : {type: 'string', description: ''},
        subtitle        : {type: 'string', description: ''},
        unavailableCount: {type: 'string', description: ''},
        vipPrice        : {type: 'string', description: 'vip定价'}
    }
};

exports.planListResponse = {
    type : 'object',
    properties:{
        err : {type: 'number', description: 'error code', default: 0},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {
                type: 'object',
                properties:{
                    cinemaAddress : {type: 'string', description: '影院地址'},
                    cinemaId : {type: 'string', description: '影院id'},
                    cinemaIntro : {type: 'string', description: '影院介绍'},
                    cinemaName : {type: 'string', description: '影院名称'},
                    cinemaTel : {type: 'string', description: '影院电话'},
                    movies: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties:{
                                id : {type: 'string', description: '影片id'},
                                movieName : {type: 'string', description: '影片名称'},
                                score : {type: 'string', description: '影片评分'},
                                movieLength: {type: 'string', description: '影片时长'},
                                highlight: {type: 'string', description: '影片一句话介绍'},
                                poster : {type: 'array', items: {type: 'string'},description: '影片海报'},
                                plans : {
                                    type: 'array',
                                    items: {$ref: '#/definitions/Plan'}
                                }
                            }

                        }
                    }
                }

            }
        }
    }
};

exports.Analysis3D = {
    type      : 'object',
    properties: {
        "name"           : {type: 'string', description: '3D分析结果名称'},
        "content"        : {type: 'string', description: '3D分析的内容'},
        "surroundScore"  : {type: 'boolean', description: '包围感'},
        "depthScore"     : {type: 'string', description: '纵深感'},
        "ImgQualityScore": {type: 'number', description: '画质'},
        "atmosphereScore": {type: 'string', description: '氛围'},
        "storyScore"     : {type: 'string', description: "剧情"},
        "images"         : {  //{type: 'array', description: '3D分析的图片url'},
            type : 'array',
            items: {type: 'string'}
        },
        "id"             : {
            type       : 'string',
            description: "5594ae3b6e5db62c0bf1dd60"
        }
    }
}

exports.movieListResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code'},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/Movie'}
        },
        prev: {type: 'string', description: '上一个分页url'},
        next: {type: 'string', description: '下一个分页url'}
    }
};


exports.albumModel = {
    type      : 'object',
    properties: {
        _id            : {
            type       : 'string',
            default    : "5590ed6357f8682247d826d7",
            description: 'ObjectId("albumId"), 专辑ID'
        },
        title          : {type: 'string', default: '泰迪熊2', description: '专辑名称'},
        description    : {
            type       : 'string',
            default    : "贱熊浪漫大婚，婚后求子心切的泰迪（塞思·麦克法兰配音）" +
            "想尽办法与好基友约翰踏上寻子之路。一路上两人上演了深夜爬进NFL四分卫汤姆·布拉迪家盗取完美DNA的闹剧，" +
            "也遇到了年轻貌美与他们一样爱抽大麻的律师萨曼莎（阿曼达·塞弗里德饰）。虽说求子路漫漫，" +
            "但泰迪并没有放弃，而基友约翰（马克·沃尔伯格饰）对它不离不弃，也为泰迪的求子愿望拼尽全力。",
            description: '专辑描述'
        },
        movie          : {
            type      : 'object',
            properties: {
                id  : {
                    type       : 'string',
                    default    : '5565ea1f2d175ba503facc2f',
                    description: 'ObjectId("movieId"), 电影ID'
                },
                name: {type: 'string', default: '泰迪熊2', description: '电影名称'}
            }
        },
        imageUrl       : {
            type       : 'string',
            default    : 'http://14.17.86.211/cloud_file/20150625/c36daa26e4a74626b620b5ef4987eb56.jpg?reqtype=0&key=3640ca5c44dcf37e630e00c4aa9194b3',
            description: '图片下载使用地址'
        },
        fileId         : {type: 'number', default: 0, description: '图片ID'},
        albumType      : {
            type       : 'string',
            default    : '电影',
            description: '专辑所关联的电影'
        },
        state          : {
            type       : 'boolean',
            default    : false,
            description: 'false(未发布) , true(已发布)'
        },
        ycynum         : {type: 'number', default: 0, description: '影次元数量'},
        recommendYcyNum: {type: 'number', default: 0, description: '影次元推荐数量'},
        recommendAlbum : {
            type       : 'number',
            default    : 0,
            description: '专辑推荐标识, 1(已推荐), 0(未推荐)'
        },
        count          : {
            type       : 'object',
            description: '统计数据',
            properties : {
                comments: {type: 'number', default: 0, description: '评论统计'}
            }
        },
        createdAt      : {
            type       : 'string',
            format     : 'date-time',
            default    : '2015-06-29T07:01:55.210Z',
            description: '专辑创建时间'
        },
        updatedAt      : {
            type       : 'string',
            format     : 'date-time',
            default    : '2015-06-29T07:01:55.210Z',
            description: '专辑最后更新时间'
        }
    }
};

exports.albumResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: '错误代码', default: 0},
        msg : {type: 'string', description: '错误信息'},
        data: {
            type       : 'array',
            description: '专辑返回数据',
            items      : {$ref: '#/definitions/albumModel'}
        },
        prev: {type: 'string', description: '上一个分页url'},
        next: {type: 'string', description: '下一个分页url'}
    }
};

exports.activityModel = {
    type      : 'object',
    properties: {
        _id        : {
            type       : 'string',
            default    : '55796907d5f1d7710346eb6d',
            description: '活动ID'
        },
        title      : {type: 'string', default: '龙凤飞', description: '活动名称'},
        description: {
            type       : 'string',
            default    : '号外号外！高分萌音电影配音大赛扬帆起航啦！' +
            '\r\n你是想在台下当一辈子的跑腿，还是想在台上闪闪发光？' +
            '\r\n你是想当电影小白还是从现在开始和我们一起开口玩配音？' +
            '\r\n╭(′▽`)╯ 别犹豫了！！！这里就是专属于你的舞台！！！进击吧，童鞋！' +
            '\r\no(*≧▽≦)ツ用声音去装饰你的梦想，用生命去卖萌！！！' +
            '\r\no(*≧▽≦)ツ哈雅酷一起来！\r\n',
            description: '活动描述'
        },
        imageUrl   : {
            type       : 'string',
            default    : 'http://14.17.86.211/cloud_file/20150625/bcc5b9f6d21f4ab188949ed181b2c799.jpg?reqtype=0&key=d24e5f715b5a0286de55d488da920cfb',
            description: '活动图片下载使用地址'
        },
        fileId     : {type: 'number', default: 0, description: '图片文件ID'},
        albumId    : {
            type       : 'string',
            default    : 'null',
            description: '活动所关联的专辑ID'
        },
        albumName  : {type: 'string', default: '', description: '活动所关联的专辑名称'},
        state      : {
            type       : 'boolean',
            default    : false,
            description: 'false(未发布) , true(已发布)'
        },
        startTime  : {
            type       : 'string',
            default    : '2015-01-11 18:53:47',
            description: '活动开始时间'
        },
        endTime    : {
            type       : 'string',
            default    : '2015-02-11 18:53:47',
            description: '活动结束时间'
        },
        createdAt  : {
            type       : 'string',
            default    : '2015-06-11T10:55:03.461Z',
            description: '活动创建时间'
        },
        updatedAt  : {
            type       : 'string',
            default    : '2015-06-11T10:55:03.461Z',
            description: '活动最后更新时间'
        }
    }
};

exports.activityResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: '错误代码', default: 0},
        msg : {type: 'string', description: '错误信息'},
        data: {
            type       : 'array',
            description: '活动返回数据',
            items      : {$ref: '#/definitions/activityModel'}
        },
        prev: {type: 'string', description: '上一个分页url'},
        next: {type: 'string', description: '下一个分页url'}
    }
};


exports.inviteResponse = {
    type      : 'object',
    properties: {
        "expiredTime"  : {type: 'string', format: 'date-time'},
        "message"      : {type: 'string'},
        "city"         : {type: 'string'},
        "targetType"   : {type: 'string'},
        "destCandidate": {$ref: '#/definitions/User'},
        "updatedAt"    : {type: 'string', format: 'date-time'},
        "createdAt"    : {type: 'string', format: 'date-time'},
        "status"       : {type: 'string'},
        "candidates"   : {
            type       : 'array',
            description: 'candidate users',
            items      : {
                type      : 'object',
                properties: {
                    "at": {type: 'string', format: 'date-time'},
                    user: {$ref: '#/definitions/User'}
                }
            }
        },
        "movie"        : {$ref: '#/definitions/Movie'},
        "inviteType"   : {type: 'string'},
        "to"           : {
            type      : 'object',
            properties: {
                "gender": {type: 'string'},
                "userid": {type: 'string'}
            }
        },
        "from"         : {$ref: '#/definitions/User'},
        "id"           : {type: 'string'}
    }

};

exports.City = {
    type      : 'object',
    properties: {
        "cityName"       : {type: 'string'},
        "cityPinYin"     : {type: 'string'},
        "latitude"       : {type: 'string'},
        "longitude"      : {type: 'string'},
        "createdAt"      : {type: 'string'},
        "updatedAt"      : {type: 'string'},
        "districts"      : {
            type : "array",
            items: {$ref: '#/definitions/District'}
        },
        "ticketCinemaCnt": {type: 'number'},
        "otherCinemaCnt" : {type: 'number'},
        "couponCinemaCnt": {type: 'number'},
        "cityId"         : {type: 'number'},
        "cityHot"        : {type: 'number'},
        "allCinemaCnt"   : {type: 'number'},
        "id"             : {type: 'string'}
    }
};

exports.District = {
    type      : 'object',
    properties: {
        "districtName": {type: 'string'},
        "districtId"  : {type: 'number'}
    }
};

exports.cityListResponse = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: 'error code'},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/City'}
        }
    }
};

exports.Spec = {
    type: 'object',
    properties: {
        "id" : {type: 'string'},
        "name":{type: 'string'},
        "icon":{type: 'string'}
    }
};

exports.specListResponse = {
    type :'object',
    properties: {
        err : {type: 'number', description: 'error code'},
        msg : {type: 'string', description: 'error message'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/Spec'}
        }
    }
};

exports.Seat = {
    type      : 'object',
    properties: {
        "graphCol"     : {
            type       : 'string',
            description: '8,  相对于屏幕的列号，第四象限坐标系  x'
        },
        "graphRow"     : {
            type       : 'string',
            description: '4,  相对于屏幕的排号，第四象限坐标系  y'
        },
        "hallId"       : {type: 'string', description: '厅 ID'},
        "seatCol"      : {type: 'string', description: '"99", 影厅规定的列号，用于打印影票'},
        "seatNo"       : {type: 'string', description: '"4_99", 座位号'},
        "seatPieceName": {type: 'string', description: ' "0000000000000001"'},
        "seatPieceNo"  : {type: 'string', description: ' "0000000000000001"'},
        "seatRow"      : {type: 'string', description: '"4", 影厅规定的排号，  用于打印影票'},
        "seatState"    : {type: 'string', description: '0, 0  可用  1  不可用'},
        "seatType"     : {type: 'string', description: '0, 0 普通座    1 情侣座'}
    }
}


exports.Seat = {
    type      : 'object',
    properties: {
        orderId   : {
            type       : 'string',
            description: '"a1362714145092156758",订单 id'
        },
        activityId: {type: 'string', description: '0,活动 id'},
        agio      : {type: 'string', description: '"40.00",还需要支付的金额'},
        ticketNo  : {type: 'string', description: '"9711193",票务平台的票号'},
        unitPrice : {type: 'string', description: '40.00,单价'},
        userId    : {type: 'string', description: '10,购买用户'},
        channelId : {type: 'string', description: '9,购买渠道'},
        count     : {type: 'string', description: '1,张数'},
        mobile    : {type: 'string', description: '"18601040701",手机号'},
        money     : {
            type       : 'string',
            description: '"40.00",订单总额         orderStatus: 1,订单状态'
        },
        seatInfo  : {type: 'string', description: '"8_9",座位信息'},
        seatNo    : {type: 'string', description: '"01010104",座位号'}
    }
}


exports.Product = {
    type      : 'object',
    properties: {
        "_id"        : {type: 'string', description: '产品Id'},
        "expiredTime": {type: 'number', description: '产品时间,单位天'},
        "description": {type: 'string', description: '产品描述'},
        "title"      : {type: 'string', description: '产品名称'},
        "productId"  : {type: 'number', description: '在支付系统中的产品Id，用来购买vip'},
        "createdAt"  : {
            type: 'string', format: 'date-time'
        },
        "priceId"    : {type: 'number', description: '支付系统定价Id'},
        'price'      : {
            type       : 'number',
            format     : 'double',
            description: '价格，单位元'
        },
        "status"     : {type: 'string', description: '产品状态'}
    }
};

exports.ProductRtn = {
    type      : 'object',
    properties: {
        err : {type: 'number', description: '错误代码'},
        msg : {type: 'string', description: '错误描述'},
        data: {
            type : 'array',
            items: {$ref: '#/definitions/Product'}
        }
    }
};

function genErrorMsg() {
    var desc = '错误代码,返回成功时错误代码是０, 错误代码：';
    desc += util.format('%j', errorCode);
    return desc;
}

var errorMessage = genErrorMsg();
var errCode      = _.values(errorCode);

exports.ErrorRtn = {
    type      : 'object',
    required  : ['code'],
    properties: {
        code: {
            type       : 'integer',
            description: '错误代码',
            enum       : errCode,
            default    : 101
        },
        msg: {type: 'string', description: '错误描述', default: ''}
    }
};

exports.OperRtn = {
    type      : 'object',
    properties: {
        err: {type: 'integer', description: '错误代码，操作成功返回0', default: 0},
        msg: {type: 'string', description: '错误描述信息', default: ''}
    }
};
