// pages/userApprovalPending/userApprovalPending.js
const urls = require('../../utils/urls.js');
Page({
  data: {
    locale: wx.getStorageSync('locale'),
    coverImgUrl: urls.baseUrl + "download/static/bg_launch.jpg"
  },
  onLoad: function (options) {
    this.setData({
      msg : options.message
    })
  }
})