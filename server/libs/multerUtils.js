/**
 * @file 上传图片处理
 * @author Chen Guanhui
 */

var multer  = require('multer');

var storage = multer.diskStorage({  
  destination: function (req, file, cb) {  
    cb(null, './public/tmp/');
  },  
  filename: function (req, file, cb) {  
    cb(null, Date.now() + '.png');  
  }  
})  
   
module.exports = multer({ storage: storage });