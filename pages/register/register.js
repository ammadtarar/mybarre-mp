// pages/register/register.js
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale')
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.locale.signUp,
    })
  }
})