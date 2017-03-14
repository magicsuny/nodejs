const rLimiter = require('../');
const redis = require('redis');


let client = redis.createClient({host:'192.168.99.100'});

function redisTest(){
    rLimiter({id:'test',db:client,maxPerSecond:10}).then((result)=>{
        console.dir(result);
    })
    setTimeout(redisTest,90)
}

redisTest();


