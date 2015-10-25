var config = require('../profile/config');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
MongoClient.connect(config.mongoDbConfig.url,function(err,db){
    if(err) {
        console.error('Analyser connection error log: ' ,err);
        process.exit(1);
    };
    var wifis = db.collection('wifis');
    async.waterfall()


    var cursor = wifis.find({});
    var total = 0;
    cursor.each(function(err,item){


        if(item == null) {
            console.log('format complete ',total)
           return db.close();
        }
        if(item.longitude!=0&&item.latitude!=0){
            wifis.update({_id:item._id},{$set:{location:[item.longitude,item.latitude],connectable:true,poster:{normal:null,thumb:null}}});
            total++;
        }
    })
   console.log(1);
});
