/**
 * @file 添加祝福语
 * @author Li Zheng
 */

// pages/blessingWorkshop/blessingWorkshop.js

var config = require("../../config.js");
var utils = require("../../utils/util.js");

const windowSize = utils.getWindowSize();
const context = wx.createCanvasContext('blessingcanvas');
const app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        responsiveHeight: windowSize.height - config.reservedHeight,
        responsiveWidth: windowSize.width,
        typeModalHidden: true,
        fontSizeRange: ["迷你", "标准", "巨无霸"],
        fontValue: [1],
        textareaHidden: false,
        actionSheetHidden: true,
        blessingSelected: 0,
        globalHidden: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      var self = this;
      wx.showLoading({
        title: '加载',
      })
      wx.request({
        url: config.service.host + '/json/blessing.json',
        success: function(res){
          wx.hideLoading();
          self.setData({
            blessingfile : res.data
          });
          wx.setStorageSync("blessingfile", res.data);
          var widgetAddedBackground = wx.getStorageSync('widgetAddedBackground');
          var imageUrl = wx.getStorageSync("widgetAddedBackground").url;
          var templateData = wx.getStorageSync('currentTemplate');
          // 比例
          var widthRatio = wx.getStorageSync("widthRatio");
          var heightRatio = wx.getStorageSync("heightRatio");
          // 用户、祝福语

          if (app.globalData.userInfo == null) {
            wx.setStorageSync("userContent", 'XXX');
          }
          else {
            wx.setStorageSync("userContent", "—— " + app.globalData.userInfo.nickName);
          }
          var userContent = wx.getStorageSync("userContent");
          if (wx.getStorageSync("blessingContent") === null) {
            wx.setStorageSync("blessingContent", "");
            self.setData({
              btnDisabled: true
            });
          } else if (wx.getStorageSync("blessingContent") === "") {
            self.setData({
              btnDisabled: true
            });
          } else {
            self.setData({
              btnDisabled: false
            });
          }
          var blessingContent = wx.getStorageSync("blessingContent");
          var blessingSize = templateData.blessing.fontSize;
          wx.setStorageSync("blessingSize", templateData.blessing.fontSize);
          var placeHolder = "点击输入^_^";
          // 祝福语响应位置、长宽
          var respX = templateData.blessing.x / widthRatio;
          var respY = templateData.blessing.y / heightRatio;
          var respWidth = templateData.blessing.width / widthRatio;
          var respHeight = templateData.blessing.height / heightRatio;
          wx.setStorageSync("respWidth", respWidth);
          wx.setStorageSync("respHeight", respHeight);
          // 用户响应位置、长宽
          var respUserX = templateData.user.x / widthRatio;
          var respUserY = templateData.user.y / heightRatio;
          var respUserWidth = templateData.user.width / widthRatio;
          var respUserHeight = templateData.user.height / heightRatio;
          wx.setStorageSync("respUserWidth", respUserWidth);
          wx.setStorageSync("respUserHeight", respUserHeight);
          // 日期
          var date = new Date();
          var dateValue = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
          //祝福语字体大小
          var fontSize = wx.getStorageSync("blessingSize");
          var fontX = Math.floor(respWidth / fontSize);
          var fontY = Math.floor(respHeight / fontSize);
          var maxLength = 30;
          // 邮戳地点、时间、文字中心点、扭转角度
          if (app.globalData.userInfo == null) {
            wx.setStorageSync("postmarkLocation", '火星');
          } else {
            if (app.globalData.userInfo.province === ""){
              wx.setStorageSync("postmarkLocation", app.globalData.userInfo.country);
            }
            else{
              wx.setStorageSync("postmarkLocation", app.globalData.userInfo.province);
            }            
          }
          wx.setStorageSync("postmarkLocationX", templateData.location.x);
          wx.setStorageSync("postmarkLocationY", templateData.location.y);
          wx.setStorageSync("postmarkDate", dateValue);
          wx.setStorageSync("postmarkDateX", templateData.date.x);
          wx.setStorageSync("postmarkDateY", templateData.date.y);
          wx.setStorageSync("postmarkSize", templateData.date.fontSize);
          wx.setStorageSync("postmarkAngle", templateData.date.degree);

          self.setData({
            templateData: templateData,
            imageUrl: imageUrl,
            blessingContent: blessingContent,
            placeHolder: placeHolder,
            respX: respX,
            respY: respY,
            respWidth: respWidth,
            respHeight: respHeight,
            respUserX: respUserX,
            respUserY: respUserY,
            respUserWidth: respUserWidth,
            respUserHeight: respUserHeight,
            fontSize: fontSize,
            fontSizeTmp: fontSize,
            maxLength: maxLength,
            userContent: userContent,
            globalHidden: false
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

    doPop() {
        this.setData({
            typeModalHidden: false,
            textareaHidden: true
        })
    },

    doBlur: function (e) {
        if (e.detail.value.length===0) {
            wx.setStorageSync("blessingContent", e.detail.value);
            this.setData({
                btnDisabled: true
            });
        }else{
            wx.setStorageSync("blessingContent", e.detail.value);            
            this.setData({
                btnDisabled: false
            });
        }
    },

    doConfirm: function (e) {
        if (e.detail.value.length===0) {
            this.setData({
                btnDisabled: true
            });
        }else{
            wx.setStorageSync("blessingContent", e.detail.value);            
            this.setData({
                btnDisabled: false
            });
        };
        this.setData({
            blessingContent: wx.getStorageSync("blessingContent"),
        })
    },

    btnTap: function (e) {
        var blsNum = Math.round(Math.random() * 13 + 1);
        var blsKey = "b" + blsNum;
        var content = this.data.blessingfile[blsKey];
        wx.setStorageSync("blessingContent", content);
        this.setData({
            blessingContent: content,
            btnDisabled: false           
        });
    },

    // add blessing action sheet
    btnTap1: function (e) {
      var blessingRange = [];
      var bls = wx.getStorageSync("blessingfile");
      for (let i = 1; i <= 14; i++) {
        let blsKey = "b" + i;
        blessingRange.push(bls[blsKey]);
      };
      this.setData({
        blessingRange: blessingRange
      });
      this.setData({
          actionSheetHidden: false            
      });
      if (blessingRange.indexOf(this.data.blessingContent) === -1)
      {
        this.setData({
          blessingContent: blessingRange[0]
        });
        wx.setStorageSync("blessingContent", blessingRange[0]);   
      }
    },

    actionSheetChange:function(){
        this.setData({
            actionSheetHidden: true,
            btnDisabled:false
        })
    },

    typeCancel: function (e) {
        this.setData({
            typeModalHidden: true,
            textareaHidden: false
        });
    },

    typeConfirm: function (e) {
        wx.setStorageSync("blessingSize", this.data.fontSizeTmp);
        this.setData({
            fontSize: this.data.fontSizeTmp,
            textareaHidden: false
        });
        wx.setStorageSync("maxLength", this.data.maxLength);        
        var blessingTmp = wx.getStorageSync("blessingContent").substr(0, this.data.maxLength);
        wx.setStorageSync("blessingContent", blessingTmp);
        this.setData({
            blessingContent: wx.getStorageSync("blessingContent"),
            typeModalHidden: true,
        });
    },

    pickerChange: function (e) {

        switch (e.detail.value[0]) {
            case 0:
                this.setData({
                    fontSizeTmp: 15,
                    maxLength:40
                });
                break;
            case 1:
                this.setData({
                    fontSizeTmp: 20,
                    maxLength:30
                });
                break;
            case 2:
                this.setData({
                    fontSizeTmp: 25,
                    maxLength:20
                });
                break;
        }
    },

    // add blessing action sheet
    blessingPickerChange: function (e) {
        let blsfile = this.data.blessingfile;
        let index ="b"+ (e.detail.value[0]+1);
        wx.setStorageSync("blessingContent", blsfile[index]);
        let tmpContent = wx.getStorageSync("blessingContent");        
        this.setData({
            blessingContent: tmpContent
        });
    },

    handleNextStep: function (e) {
      wx.showLoading({
        title: '加载...'
      });
      this.setData({
        btnDisabled: true
      });
        var self = this;

        var template = wx.getStorageSync('widgetAddedBackground');
        var templateData = wx.getStorageSync('currentTemplate');
        var content = wx.getStorageSync("blessingContent");
        var userContent = wx.getStorageSync("userContent");
        var fontSize = wx.getStorageSync("blessingSize");
        var widthRatio = wx.getStorageSync("widthRatio");
        var heightRatio = wx.getStorageSync("heightRatio");

        var respWidth = this.data.respWidth;
        var respHeight = this.data.respHeight;
        var fontX = Math.floor(respWidth / fontSize);
        var maxLength = this.data.maxLength;
        var respX = this.data.respX;
        var respY = this.data.respY;
        var respUserX = this.data.respUserX;
        var respUserY = this.data.respUserY;

        // 底板
        context.drawImage(template.url, 0, 0, template.width, template.height);
        var pieces = content.split('\n');
        var baseY = templateData.blessing.y;
        pieces.map(function(piece){
          var contentLength = piece.length;
          var contentLines = 0;
          if (contentLength % fontX === 0) {
            contentLines = contentLength / fontX;
          } else {
            contentLines = Math.floor(contentLength / fontX) + 1;
          }
          // 祝福语
          context.setFontSize(fontSize * widthRatio);
          var final = baseY;
          for (let i = 0; i < contentLines; i++) {
            let drawY = i * fontSize * widthRatio + baseY;
            let drawContent = "";
            if (i != contentLines - 1) {
              drawContent = piece.substr(i * fontX, fontX);
              context.fillText(drawContent, templateData.blessing.x, drawY);
            } else {    
              final = drawY;      
              drawContent = piece.substr(i * fontX);
              context.fillText(drawContent, templateData.blessing.x, drawY);
            }
          }
          baseY = final + fontSize * widthRatio;
        })     

        // 邮戳
        context.save();
        var postmarkLocation = wx.getStorageSync("postmarkLocation");
        var postmarkLocationX= wx.getStorageSync("postmarkLocationX");
        var postmarkLocationY = wx.getStorageSync("postmarkLocationY");
        var postmarkDate = wx.getStorageSync("postmarkDate");
        var postmarkDateX = wx.getStorageSync("postmarkDateX");
        var postmarkDateY = wx.getStorageSync("postmarkDateY");
        var postmarkAngle = wx.getStorageSync("postmarkAngle");
        var postmarkSize = wx.getStorageSync("postmarkSize");                        
        var tempX = 0;
        if (postmarkLocation.length < postmarkDate.length / 2) {
            tempX = postmarkDate.length / 2;
        } else {
            tempX = postmarkLocation.length;
        }
        context.setFontSize(postmarkSize * widthRatio);
        context.translate(postmarkLocationX, postmarkLocationY);
        context.rotate(postmarkAngle * Math.PI / 180);                
        context.fillText(postmarkLocation, 0, 0);
        context.fillText(postmarkDate, 0, postmarkSize * widthRatio);
        context.restore();

        // 用户
        context.setFontSize(15 * widthRatio);
        context.fillText(userContent, templateData.user.x, templateData.user.y);

        context.draw(true, function (e) {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: template.width,
                height: template.height,
                destWidth: template.width,
                destHeight: template.height,
                canvasId: 'blessingcanvas',
                quality: 1,
                success: function (res) {
                    wx.setStorageSync('blessingAddedBackground', { "url": res.tempFilePath, "width": template.width, "height": template.height });
                    wx.navigateTo({
                        url: '../stampWorkshop/stampWorkshop'
                    })
                },
                complete: function(){
                  wx.hideLoading();
                  self.setData({
                    btnDisabled: false
                  })
                }
            })
        });
    },

    imageLoad: function (e) {
        this.setData({
          realWidth: e.detail.width,
          realHeight: e.detail.height,
        });
      }    
})