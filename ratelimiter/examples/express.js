var express = require('express');
var rLimiter = require('../');
var app = express();

app.use(function (req, res,next) {
    rLimiter({id: req.ip, maxPerSecond: 5}).then(function(result){
        if (result.remaining > 0) {
            next();
        }else{
            let err = new Error('Too many requests!');
            err.status = err.statusCode || err.status || 429;
            next(err);
        }
    });

});

app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});