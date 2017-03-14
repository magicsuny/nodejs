const rLimiter = require('../');

for(let i=0;i<20;i++){
    rLimiter({id:'test',interval:10,maxInInterval:5}).then((result)=>{
        console.dir(result);
    })
}