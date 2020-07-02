// pages/moreMedia/moreMedia.js
Page({

  /**
   * Page initial data
   */
  data: {
    items: [],
    cols: 2,
    cardWidth : '',
    type : 'vid',
    locale: wx.getStorageSync('locale'),
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const type = options.type;
    this.setData({ type: type})
    var title = "";
    if(type === "vid"){
      title = this.data.locale.videos;
    } else if (type === "img") {
      title = this.data.locale.images;
    } else if (type === "doc") {
      title = this.data.locale.documents;
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    var screenWidth = getApp().screenWidth;
    this.setData({
      cardWidth: (screenWidth / 2) - 20
    });
    
    const data = options.data;
    this.setData({ items: JSON.parse(data) })
  }
})