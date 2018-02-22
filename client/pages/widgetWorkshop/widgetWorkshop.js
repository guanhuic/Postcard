/**
 * @file 自定义明信片组件页面
 * @author Chen Guanhui
 */

// pages/widgetWorkshop/widgetWorkshop.js
var config = require("../../config.js");
var utils = require("../../utils/util.js");

const windowSize = utils.getWindowSize();
const context = wx.createCanvasContext('widgetcanvas');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    responsiveHeight: windowSize.height - config.reservedHeight,
    responsiveWidth: windowSize.width,
    hideWidgets: true,
    disabled: true,
    globalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    wx.hideShareMenu();
    var templateData = wx.getStorageSync('currentTemplate');
    this.setData({
      imageUrl: wx.getStorageSync('background').url
    });
    this.setData({
        templateData: templateData,
        hintHidden:true
    });
    wx.showLoading({
      title: '加载',
    });
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

  postcardLoad: function (e) {
    wx.hideLoading();
    this.setData({
      realWidth: e.detail.width,
      realHeight: e.detail.height,
      widthRatio: e.detail.width / windowSize.width,
      heightRatio: e.detail.height / this.data.responsiveHeight,
      hideWidgets: false,
      globalHidden: false
    }, function(){
      wx.setStorageSync('widthRatio', this.data.widthRatio);
      wx.setStorageSync('heightRatio', this.data.heightRatio);
    });
    var respX = this.data.templateData.blessing.x / this.data.widthRatio;
    var respY = this.data.templateData.blessing.y / this.data.heightRatio;
    this.setData({
        respX: respX,
        respY: respY,
        hintHidden: false
    });
  },

  handleNextStep: function (e) {
    wx.showLoading({
      title: '组件合成中...',
    });
    this.setData({
      disabled: true
    })
    var self = this;
    var template = wx.getStorageSync('background');
    wx.downloadFile({
      url: template.url, //have to download it...otherwise the drawImage won't wait for image loaded......
      success: function (background) {
        if (background.statusCode === 200) {
          context.drawImage(background.tempFilePath, 0, 0, self.data.realWidth, self.data.realHeight);
          var widgets = wx.getStorageSync('widgets') || [];
          var promises = widgets.map((w) => {
            return new Promise(function(resolve, reject){
              wx.downloadFile({
                url: w.url,
                success: function (widget) {
                  context.drawImage(widget.tempFilePath, w.x, w.y, w.width, w.height);
                  resolve();
                },
                fail: function(){
                  reject();
                }
              });
            });                        
          });
          Promise.all(promises).then(function(){
            context.draw(false, function (e) {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: self.data.realWidth,
                height: self.data.realHeight,
                destWidth: self.data.realWidth,
                destHeight: self.data.realHeight,
                canvasId: 'widgetcanvas',
                quality: 1,
                success: function (res) {
                  wx.setStorageSync('widgetAddedBackground', { "url": res.tempFilePath, "width": self.data.realWidth, "height": self.data.realHeight })
                  wx.navigateTo({
                    url: '../blessingWorkshop/blessingWorkshop'
                  });
                },
                fail: function (err) {
                  wx.showToast({
                    title: '出错，请重试。',
                    icon: "none"
                  });
                },
                complete: function(){
                  wx.hideLoading();
                  self.setData({
                    disabled: false
                  });
                }
              })
            });
          }).catch(function(err){
            wx.showToast({
              title: '网络出错，请重试。',
              icon: "none"
            });
            wx.hideLoading();
            self.setData({
              disabled: false
            })
          });
        }
      }
    });
  },

  calculateActiveWidgets: function(){
    var remaining = wx.getStorageSync('remainingWidgets');
    if (remaining === 0){
      this.setData({
        disabled: false
      })
    }
  }
})