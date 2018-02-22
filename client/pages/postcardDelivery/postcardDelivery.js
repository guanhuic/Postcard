/**
 * @file 最终生成明信片并保存到相册
 * @author Chen Guanhui
 */

// pages/postcardDelivery/postcardDelivery.js
var config = require("../../config.js");
var utils = require("../../utils/util.js");
const windowSize = utils.getWindowSize();
const finalcanvas = wx.createCanvasContext('finalcanvas');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    responsiveHeight: windowSize.height - config.reservedHeight,
    globalHidden: true,
    canvasHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    wx.hideShareMenu();
    wx.showLoading({
      title: '正在生成贺卡...',
    });
    var self = this;
    var template = wx.getStorageSync("currentTemplate");
    var stampX = template.stamp.x + template.stamp.photo.x;
    var stampY = template.stamp.y + template.stamp.photo.y;
    var stampWidth =template.stamp.photo.length;
    var stampHeight = template.stamp.photo.length;
    var background = wx.getStorageSync('blessingAddedBackground');
    this.setData({
      realWidth: background.width,
      realHeight: background.height,
      canvasHidden: false
    });
    setTimeout(() => {
      var stamp = wx.getStorageSync('stamp');
      finalcanvas.drawImage(background.url, 0, 0, background.width, background.height);
      finalcanvas.drawImage(stamp.url, stampX, stampY, stampWidth, stampHeight);
      finalcanvas.draw();
      finalcanvas.save();
      // 这里设置 setTimeout， 原因是finalcanvas还没画好就开始保存照片， draw的回调函数不起作用
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: background.width,
          height: background.height,
          destWidth: background.width,
          destHeight: background.height,
          canvasId: 'finalcanvas',
          quality: 1,
          success: function (res) {
            self.setData({
              imageUrl: res.tempFilePath,
              globalHidden: false
            });
            wx.hideLoading();
            self.saveToAlbum();
          },
          fail: function (res) {

          }
        })
      }, 1000);
    }, 500);
       
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

  handleMake: function (){
    wx.reLaunch({
      url: '../postcardTemplates/postcardTemplates',
    })
  },

  handleAbout: function(){
    wx.navigateTo({
      url: '../aboutus/aboutus',
    });
  },

  saveToAlbum: function(){
    var self = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum'] === false) {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常保存贺卡，请确定并在授权管理中选中保存相册。',
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
        }else{
          wx.saveImageToPhotosAlbum({
            filePath: self.data.imageUrl,
            success: function (res) {
              wx.showToast({
                title: '保存相册',
                icon: 'success',
                duration: 2000
              })
            },
            fail: function (res) {
              
            }
          });
        }
      }
    });
    
    
  },

  handleSave: function (){
    this.saveToAlbum();
  }
})