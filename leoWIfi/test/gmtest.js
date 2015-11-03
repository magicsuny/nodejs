/**
 * Created by sunharuka on 15/11/3.
 */
var gm = require('gm');

gm(__dirname+'/test.jpg').thumb(100, 100, './test-thumb.jpg', 100, function(err,data){
    debugger;
});

gm(__dirname+'/test.jpg').resize(100, 100).write('./test-resize.jpg', function(err,data){
    debugger;
});