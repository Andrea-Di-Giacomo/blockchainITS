var buffer = require('buffer');
var path = require('path');
function encode_base64(file) {
    var buf = Buffer.from(file);
    return buf.toString('base64');
}


function decode_base64(base64str){

    return Buffer.from(base64str,'base64');

}
module.exports={encode_base64,decode_base64};
