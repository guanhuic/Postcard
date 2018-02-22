/**
 * @file 挂件组件
 * @author Chen Guanhui
 */

// pages/components/widget.js
var config = require("../../config.js");
var util = require("../../utils/util.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    widgetList: {
      type: Array
    },
    widgetUrl: {
      type: String,
      value: '../../images/defaultwidget.png',
      observer: function(newImage, oldImage){
        var widgets = wx.getStorageSync('widgets') || [];
        var victim = widgets.findIndex(x => x.url === oldImage);
        if (victim !== -1) {
          widgets.splice(victim, 1);
          wx.setStorageSync('widgets', widgets);
        }
      }
    },
    leftIndex: {
      type: Number
    },
    topIndex: {
      type: Number
    },
    widthRatio: {
      type: Number
    },
    heightRatio: {
      type: Number,
      observer: function (e) {
        if(e !== 0)
        {
          var widgets = wx.getStorageSync('widgets') || [];
          var targetIndex = widgets.findIndex(x => x.url === this.data.widgetUrl);
          // 这里需要update一下, image load的时候 heightRatio是0 racing issue
          if (targetIndex !== -1) {
            widgets[targetIndex].width = this.data.realWidth;
            widgets[targetIndex].height = this.data.realHeight;
            widgets[targetIndex].x = this.properties.leftIndex * this.properties.widthRatio;
            widgets[targetIndex].y = this.properties.topIndex * this.properties.heightRatio;
            wx.setStorageSync('widgets', widgets);
          }
        }
      }
    },
    hideWidget : {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultLeft: util.getWindowSize().width,
    open: false,
    activated: false,
    widgetConfirmButtonHidden: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSwiper: function (e) {
      var index = e.detail.current;
      this.setData({
        widgetUrl: this.properties.widgetList[index]
      })
    },

   // 图片加载完成事件
    widgetLoad: function (e) {
      this.setData({
        realWidth: e.detail.width,
        realHeight: e.detail.height
      }, function () {
        this.setData({
          hideWidget: false
        });
        var widgets = wx.getStorageSync('widgets') || [];
        var targetIndex = widgets.findIndex(x => x.url === this.data.widgetUrl);
        if (targetIndex == -1) {
          widgets.push(
            {
              "url": this.properties.widgetUrl,
              "width": e.detail.width,
              "height": e.detail.height,
              "x": this.properties.leftIndex * this.properties.widthRatio,
              "y": this.properties.topIndex * this.properties.heightRatio
            }
          );
          wx.setStorageSync('widgets', widgets);
        }
      });     
    },

    // 图片加载完成事件
    candidateLoad: function (e) {
      var ratio = e.detail.height / config.swiperDefaultHeight;
      this.setData({
        candidateWidth: e.detail.width / ratio
      })
    },

    // 处理点击更换组件
    widgetToggle: function (e) {      
      //只能有一个组件更换处于活跃状态
      var activeWidget = wx.getStorageSync('activeWidget');
      if (!activeWidget) {
        wx.setStorageSync('activeWidget', true);
        this.setData({
          open: true
        });
        if (this.data.widgetUrl === '../../images/defaultwidget.png') {
          this.setData({
            widgetUrl: this.data.widgetList[0]
          });
        }
        this.setData({
          widgetConfirmButtonHidden: false
        });
      }
    },

    // 处理确认选定该组件事件
    handWidgetConfirm: function() {
      wx.setStorageSync('activeWidget', false);
      this.setData({
        open: false
      });
      if (!this.data.activated) {
        this.data.activated = true;
        var remainingWidgets = wx.getStorageSync('remainingWidgets');
        wx.setStorageSync('remainingWidgets', remainingWidgets - 1);
      }
      this.setData({
        widgetConfirmButtonHidden: true
      });
    }
  }
})
