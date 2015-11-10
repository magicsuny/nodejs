/**
 * Created by sunharuka on 15/11/4.
 */
var fs = require('fs');
fs.readFile('./test-resize.jpg', function(err,data){
    var buffer = new Buffer(data);
    console.log(buffer.toString('base64'));

    fs.writeFile('./fff.jpg', new Buffer(buffer.toString('base64'), 'base64'), function(err) {
debugger;
    });
});