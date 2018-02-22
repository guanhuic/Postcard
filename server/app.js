/**
 * @file 服务器 nodejs + express
 * @author Chen Guanhui
 */

var express = require('express');
var app = express();
var fs = require("fs");
var payment = require('./libs/payment.js');
var upload = require('./libs/multerUtils.js');

const config = require('./config');

app.use(express.static(__dirname + '/public'));

// 获取openid
app.get('/getopenid', function(req, res){
  var promise = payment.getOpenid(req.query.code);
  promise.then(function(result){
    res.send(result);
  }).finally(function(error) {
    res.send(error);
  });
});

// 获取预付id
app.get('/getprepayid', function (req, res) {
  var promise = payment.getPrepayId(req.query.openid);
  promise.then(function (result) {
    res.send(result);
  }).catch(function (error) {
    res.send(error);
  });
});

// 上传照片
app.post('/uploadimage', upload.single('image'), function (req, res) {
  res.send(req.file.filename);
});

// 支付成功回调函数
app.get('/paymentdone', function (req, res) {
});

// 监听端口，等待连接
app.listen(config.serverPort);