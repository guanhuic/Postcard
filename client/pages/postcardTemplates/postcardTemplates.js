/**
 * @file 明信片底板
 * @author Chen Guanhui
 */

// pages/postcardTemplates/postcardTemplates.js
var config = require("../../config.js");
var utils = require("../../utils/util.js");
const windowSize = utils.getWindowSize();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    current: 0,
    responsiveHeight: windowSize.height - config.reservedHeight,
    prevHidden: true,
    nextHidden: false,
    globalHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '模板加载中',
    })
    var self = this;
    wx.request({
      url: config.service.host + '/json/templates.json',
      success: function(res){
        self.setData({
          templateUrls: res.data
        });
      }
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
    this.setData({ disabled: false });
    wx.clearStorageSync();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 选定底板事件
  handleConfirm: function (e) {
    wx.showLoading({
      title: '加载...',
    })
    var templateNumber = this.data.current + 1;
    var self = this;
    wx.request({
      url: `${config.service.host}/json/template${templateNumber}.json`,
      success: function(res) {
        // TODO get template json file from server and save to local storage
        wx.setStorageSync('activeWidget', false);
        wx.setStorageSync('currentTemplate', res.data);
        wx.setStorageSync('remainingWidgets', res.data.widgets.length);
        wx.setStorageSync('background', { "url": self.data.templateUrls[self.data.current], "width": windowSize.width, "height": self.data.responsiveHeight });
        wx.navigateTo({
          url: '../widgetWorkshop/widgetWorkshop',
        })
      },
      complete: function(){
        wx.hideLoading();
      }
    })
    this.setData({ disabled: true });

  },

  //滑动触发事件 
  handleSwiper: function (e) {
    if (e.detail.source === 'touch'){
      this.setData({
        current: e.detail.current
      });
      this.calculateArrows();
    }    
  },
  
  // 左右箭头实现
  calculateArrows: function() {
    if (this.data.current === 0) {
      this.setData({
        prevHidden: true,
        nextHidden: false
      });
    } else if (this.data.current === this.data.templateUrls.length - 1) {
      this.setData({
        nextHidden: true,
        prevHidden: false
      });
    } else {
      this.setData({
        prevHidden: false,
        nextHidden: false
      });
    }
  },

  imageLoad: function (e) {
    wx.hideLoading();
    this.setData({
      globalHidden: false
    })
  },
  
  prevImage: function(){
    var prev = this.data.current - 1;
    if(prev === 0){
      this.setData({
        prevHidden: true
      });
    }
    else{
      this.setData({
        prevHidden: false,
        nextHidden: false
      });
    }
    this.setData({
      current: prev
    });
  },

  nextImage: function(){
    var next = this.data.current + 1;
    if (next === this.data.templateUrls.length - 1) {
      this.setData({
        nextHidden: true
      });
    }
    else {
      this.setData({
        nextHidden: false,
        prevHidden: false
      });
    }
    this.setData({
      current: next
    });
  }
})