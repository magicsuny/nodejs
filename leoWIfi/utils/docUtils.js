/**
 * Created by sunharuka on 15/7/2.
 */
var _  = require('underscore')

var _tbl = function(){
    this._content ='\n '+ _.values(arguments).join('|')+' \n';
    var splice = [];
    var divider = '------';
    for(var i=0;i<arguments.length;i++){
        splice.push(divider);
    }
    this._content+=splice.join('|')+' \n';
}

_tbl.prototype = {
    row:function(){
        var _rowContent = _.values(arguments).join('|')+' \n';
        this._content += _rowContent;
        return this;
    },
    render:function(){
        return this._content;
    }
};


exports.tbl = _tbl;