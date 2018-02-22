/**
 * @file 支付模块
 * @author Chen Guanhui
 */

var https = require('https');
var Promise = require('promise');
var config = require('../config');
var crypto = require('crypto'); 

// 获取openid
var getOpenid = function(code){
  var url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`;
  var promise = new Promise(function(resolve, reject){
    https.get(url, function (response) {
      response.on('data', function (data) {
        resolve({"openid" : JSON.parse(data).openid});
      });
    }).on("error", function (err) {
      reject(err);
    });
  });
  return promise;  
};

// 获取预付id
var getPrepayId = function(openid){
  var info = {
    appid: config.appId,
    body: '极速专属明信片',
    mch_id: config.mch_id,
    nonce_str: Math.random().toString(36).substr(2, 15),
    notify_url: config.host + '/paymentdone',
    openid: openid,
    out_trade_no: generateTradeNo(),
    spbill_create_ip: config.server_ip,
    total_fee: 100,
    trade_type: 'JSAPI'
  }

  var signature = sign(info);

  var bodyData = '<xml>';
  bodyData += '<appid>' + info.appid + '</appid>';  // 小程序ID
  bodyData += '<body>' + info.body + '</body>'; // 商品描述
  bodyData += '<mch_id>' + info.mch_id + '</mch_id>'; // 商户号
  bodyData += '<nonce_str>' + info.nonce_str + '</nonce_str>'; // 随机字符串
  bodyData += '<notify_url>' + info.notify_url + '</notify_url>'; // 支付成功的回调地址
  bodyData += '<openid>' + info.openid + '</openid>'; // 用户标识
  bodyData += '<out_trade_no>' + info.out_trade_no + '</out_trade_no>'; // 商户订单号
  bodyData += '<spbill_create_ip>' + info.spbill_create_ip + '</spbill_create_ip>'; // 终端IP
  bodyData += '<total_fee>' + info.total_fee + '</total_fee>'; // 总金额 单位为分
  bodyData += '<trade_type>JSAPI</trade_type>'; // 交易类型 小程序取值如下：JSAPI
  bodyData += '<sign>' + signature + '</sign>';
  bodyData += '</xml>';

  var options = {
    host: 'api.mch.weixin.qq.com',
    path: '/pay/unifiedorder',
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml;text/xml;charset=UTF-8',
      'Content-Length': Buffer.byteLength(bodyData)
    }
  };

  var promise = new Promise(function (resolve, reject) {
    var req = https.request(options, function (response) {
      response.on('data', function (data) {
        // retrieve prepay_id
        var timestamp = createTimeStamp();
        var prepay_id = data.toString().split('<prepay_id>')[1].split('</prepay_id>')[0].split('[')[2].split(']')[0];
        var requiredInfo = {  
            "appId": info.appid,  
            "nonceStr": info.nonce_str,  
            "package": "prepay_id=" + prepay_id,  
            "signType": "MD5",  
            "timeStamp": timestamp
        }; 
        requiredInfo.paySign = generateCode(requiredInfo);
        resolve(requiredInfo);
      });
    });    
    req.on("error", function (err) {
      reject(err);
    });
    req.write(bodyData);
    req.end();
  });
  return promise;
};

// 创建时间戳
var createTimeStamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

// 签名
var sign = function(info) {
  return generateCode(info);
};

var generateCode = function(target){
  var code = Object.keys(target).map(function(key){
    return key + '=' + target[key];
  }).join('&');
  code = code + '&key=' + config.mch_key;
  return crypto.createHash('md5').update(code).digest('hex').toUpperCase();
}

// 随机32位数字
var generateTradeNo = function(){
  var arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  var result = '';
  for(var i = 0; i< 32; i++){
    result = result + arr[Math.round(Math.random() * 9)];
  }
  return result;
}

module.exports = {
  getOpenid: getOpenid,
  getPrepayId: getPrepayId
}