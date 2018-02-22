/**
 * @file 上传照片 用于制作邮票
 * @author Chen Guanhui
 */

// pages/stampWorkshop/stampWorkshop.js
var config = require("../../config.js");
var utils = require("../../utils/util.js");

const context = wx.createCanvasContext('stampworkshop');
const windowSize = utils.getWindowSize();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stampHeight: 300,
    stampWidth: 300,
    responsiveHeight: windowSize.height-188,
    imageHeight: windowSize.height - config.reservedHeight,
    windowSize: windowSize,
    disableMake: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var stampframe = wx.getStorageSync('currentTemplate').stamp.file;
    // context.drawImage(stampframe, 0, 0, 300, 300);
    context.draw();
    this.setData({
        stampframe: stampframe
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  handleUpload: function (e) {
    var self = this;
    this.setData({
      disableUpload: true
    });
    wx.chooseImage({
      count: 1, // 只需要一张
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '加载中',
        });
        const src = res.tempFilePaths[0]
        // context.drawImage(self.data.stampframe, 0, 0, 300, 300);
        context.drawImage(src, 0, 0, 300, 300);
        context.draw();
        context.save();
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 300,
            height: 300,
            destWidth: 300,
            destHeight: 300,
            canvasId: 'stampworkshop',
            quality: 1,
            success: function (res) {
              self.setData({
                disableMake: false
              });
              wx.hideLoading();
              wx.setStorageSync('stamp', { "url": res.tempFilePath, "width": 300, "height": 300 });              
            }
          })
        }, 2000);
      },
      complete: function () {
        self.setData({
          disableUpload: false,
        });        
      }
    })
  },

  handleMake: function() {
    wx.reLaunch({
      url: '../postcardDelivery/postcardDelivery'
    })
    // wx.showLoading({
    //   title: '请稍等...',
    // })
    // wx.request({
    //   url: config.service.host + '/getprepayid',
    //   method: 'GET',
    //   data: { openid: getApp().globalData.openid },
    //   header: { 'content-type': 'application/json' },
    //   success: function (res) {
    //     wx.hideLoading();
    //     wx.requestPayment({
    //       'timeStamp': res.data.timeStamp,
    //       'nonceStr': res.data.nonceStr,
    //       'package': res.data.package,
    //       'signType': 'MD5',
    //       'paySign': res.data.paySign,
    //       success: function (paysuccess) {
    //         wx.showToast({
    //           title: '支付成功',
    //           icon: 'success',
    //           duration: 2000,
    //           success: function(){
    //             wx.reLaunch({
    //               url: '../postcardDelivery/postcardDelivery'
    //             })  
    //           }
    //         });
    //       },
    //       fail: function (res) {
    //         wx.showToast({
    //           title: '支付失败',
    //           icon: 'none',
    //           duration: 2000
    //         })
    //       }
    //     })
    //   }
    // })
  }
})
