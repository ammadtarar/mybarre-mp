//app.js

const locale = require('./utils/locale.js');
App({
  onLaunch: function () {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        const lang = res.language || 'en';
        wx.setStorageSync('lang', lang)
        if (lang.includes('zh')) {
          wx.setStorageSync('locale', locale.localList['zh'])
        } else {
          wx.setStorageSync('locale', locale.localList['en'])
        }
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });
    
  },
  globalData: {
    userInfo: null,
    lang : 'en'
  }
})