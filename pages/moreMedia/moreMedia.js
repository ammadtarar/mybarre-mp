// pages/moreMedia/moreMedia.js
Page({

  /**
   * Page initial data
   */
  data: {
    items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    cols: 2,
    cardWidth : '',
    type : 'vid',
    locale: wx.getStorageSync('locale')
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
    const d = JSON.parse(data);
    this.setData({ items: d })


    let columns = []
    let mid = Math.ceil(this.data.items.length / this.data.cols)
    for (let col = 0; col < this.data.cols; col++) {
      columns.push(this.data.items.slice(col * mid, col * mid + mid))
    }
    this.setData({ columns: columns });


  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})