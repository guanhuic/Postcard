/**
 * @file app
 * @author Chen Guanhui
 */

var config = require("./config.js");

App({
  onLaunch: function () {
    var self = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId
        wx.request({
          url: config.service.host + '/getopenid',
          data: {code : res.code},
          success: function(response){
            self.globalData.openid = response.data.openid;
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo'] === false) {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常制作贺卡，请确定并在授权管理中选中用户信息。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function success(res) {
                  }
                });
              }
            }
          })
        } else {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              self.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (self.userInfoReadyCallback) {
                self.userInfoReadyCallback(res)
              }
            }
          });
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    openid: ''
  }
})